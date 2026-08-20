"use client";

import { AlertTriangle, BookOpen, Bot, Check, ChevronDown, Clock3, Copy, Database, FileSearch, MapPin, Search, Send, ShieldCheck, Truck } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { FormEvent, useEffect, useState } from "react";
import { askEcho, type EchoIncidentContext, type GroundedAnswerSource } from "@/services/cortex";

type AskEchoProps = {
    incident: EchoIncidentContext | null;
};

const loadingStages = [
  "Searching emergency SOPs...",
  "Retrieving relevant evidence...",
  "Grounding response with incident context...",
  "Generating operational guidance...",
] as const;

function getSeverityClasses(severity: string) {
    switch (severity) {
        case "CRITICAL":
            return "border-red-500/30 bg-red-500/10 text-red-200";

        case "HIGH":
            return "border-orange-500/30 bg-orange-500/10 text-orange-200";

        case "MEDIUM":
            return "border-amber-500/30 bg-amber-500/10 text-amber-200";

        case "LOW":
            return "border-emerald-500/30 bg-emerald-500/10 text-emerald-200";

        default:
            return "border-slate-700 bg-slate-800/60 text-slate-300";
    }
}

export function AskEcho({ incident }: AskEchoProps) {
    const [query, setQuery] = useState("");
    const [answer, setAnswer] = useState("");
    const [sources, setSources] = useState<GroundedAnswerSource[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submittedQuery, setSubmittedQuery] = useState("");
    const [loadingStageIndex, setLoadingStageIndex] = useState(0);
    const [expandedSourceId, setExpandedSourceId] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!isLoading) return;

        const interval = window.setInterval(() => {
            setLoadingStageIndex((current) =>
                Math.min(
                    current + 1,
                    loadingStages.length - 1,
                ),
            );
        }, 1200);

        return () => {
            window.clearInterval(interval);
        };
    }, [isLoading]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const trimmedQuery = query.trim();

        if (!trimmedQuery || isLoading || !incident) return;

        setLoadingStageIndex(0);
        setIsLoading(true);
        setError(null);
        setSubmittedQuery(trimmedQuery);

        setAnswer("");
        setSources([]);
        setExpandedSourceId(null);

        try {
            const result = await askEcho(trimmedQuery, incident);

            setAnswer(result.answer);
            setSources(result.sources);
        } catch (searchError) {
            setError(
            searchError instanceof Error
                ? searchError.message
                : "Unable to generate an ECHO response.",
            );
        } finally {
            setIsLoading(false);
        }
    }

    function handleSuggestedQuestion(question: string) {
        setQuery(question);
    }

    async function handleCopyAnswer() {
        if (!answer) return;

        try {
            await navigator.clipboard.writeText(answer);

            setCopied(true);

            window.setTimeout(() => {
            setCopied(false);
            }, 2000);
        } catch {
            // Ignore clipboard failures
        }
    }

    const incidentType = incident?.type;
    const suggestedQuestions = [
        incidentType === "FIRE"
            ? "What is the evacuation procedure for this bushfire?"
            : null,
        incidentType === "FLOOD"
            ? "What flood protection actions should responders take?"
            : null,
        incidentType === "HAZMAT"
            ? "How should the exclusion zone be managed?"
            : null,
        incidentType === "COLLISION"
            ? "What is the mass casualty triage procedure?"
            : null,
        incidentType === "STORM"
            ? "What storm response actions should responders prioritise?"
            : null,
            
        "What resources should be deployed first?",
    ].filter((question): question is string =>
        Boolean(question),
    );

    const generatedAt = answer ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit"}) : null;

    return (
        <section className="rounded-2xl border border-slate-800 bg-[#131C2E] p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Cortex Search
                    </p>

                    <h2 className="mt-2 flex items-center gap-2 text-xl font-semibold text-white">
                        <Bot size={20} className="text-cyan-300" />
                        Ask ECHO
                    </h2>

                    <p className="mt-2 text-sm text-slate-400">
                        Search operational procedures and emergency
                        response guidance.
                    </p>
                </div>

                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-200">
                    RAG Retrieval
                </div>
            </div>

            {incident ? (
                <div className="mt-5 rounded-2xl border border-slate-800 bg-[#0B1220] p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                Current Incident Briefing
                            </p>

                            <h3 className="mt-2 text-base font-semibold text-white">
                                {incident.title}
                            </h3>

                            {incident.description && (
                                <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-400">
                                    {incident.description}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-semibold text-cyan-200">
                                {incident.type}
                            </span>

                            <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${getSeverityClasses(incident.severity)}`}>
                                {incident.severity}
                            </span>

                            <span className="rounded-full border border-slate-700 bg-slate-800/60 px-2.5 py-1 text-[10px] font-semibold text-slate-300">
                                {incident.status}
                            </span>
                        </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl border border-slate-800 bg-[#131C2E] p-4">
                            <div className="flex items-center gap-2 text-cyan-300">
                                <MapPin size={15} />
                                <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">
                                    Location
                                </span>
                            </div>

                            <p className="mt-3 text-sm font-semibold text-white">
                                {incident.location ?? "Unknown location"}
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-800 bg-[#131C2E] p-4">
                            <div className="flex items-center gap-2 text-blue-300">
                                <Truck size={15} />
                                <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">
                                    Resources
                                </span>
                            </div>

                            <p className="mt-3 text-sm font-semibold text-white">
                                {incident.resourceCount ?? 0} allocated
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-800 bg-[#131C2E] p-4">
                            <div className="flex items-center gap-2 text-amber-300">
                                <AlertTriangle size={15} />
                                <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">
                                    Severity
                                </span>
                            </div>

                            <p className="mt-3 text-sm font-semibold text-white">
                                {incident.severity}
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-800 bg-[#131C2E] p-4">
                            <div className="flex items-center gap-2 text-emerald-300">
                                <ShieldCheck size={15} />
                                <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">
                                    Status
                                </span>
                            </div>

                            <p className="mt-3 text-sm font-semibold text-white">
                                {incident.status}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 rounded-xl border border-cyan-500/15 bg-cyan-500/5 p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
                            Current Recommendation
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-300">
                            {incident.recommendation ?? "Recommendation pending incident analysis."}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-700 bg-[#0B1220] p-6 text-center">
                    <p className="text-sm font-semibold text-slate-300">
                        No active incident selected
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                        Select an incident before requesting operational guidance.
                    </p>
                </div>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
                {suggestedQuestions.map((question) => (
                    <button
                        key={question}
                        type="button"
                        disabled={!incident || isLoading}
                        onClick={() => handleSuggestedQuestion(question)}
                        className="rounded-full border border-slate-700 bg-[#0B1220] px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-500/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {question}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-5 flex gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"/>

                    <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Ask about evacuation, triage, resources, or SOPs..."
                        disabled={isLoading || !incident}
                        className="h-12 w-full rounded-xl border border-slate-700 bg-[#0B1220] pl-11 pr-4 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-cyan-500/60 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                </div>

                <button
                    type="submit"
                    disabled={!query.trim() || isLoading || !incident}
                    className="flex h-12 items-center gap-2 rounded-xl bg-cyan-600 px-5 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                >
                    <Send size={15} />
                    {isLoading ? "Working..." : "Ask"}
                </button>
            </form>

            {isLoading && (
                <div className="mt-5 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B1220]">
                            <Bot size={18} className="animate-pulse text-cyan-300"/>
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                                ECHO is analysing
                            </p>

                            <p className="mt-1 text-sm text-slate-300">
                                {loadingStages[loadingStageIndex]}
                            </p>
                        </div>

                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-300" />
                    </div>

                    <div className="mt-4 grid grid-cols-4 gap-2">
                        {loadingStages.map((stage, index) => (
                            <div
                                key={stage}
                                className={`h-1.5 rounded-full transition-colors ${
                                    index <= loadingStageIndex
                                    ? "bg-cyan-400"
                                    : "bg-slate-800"
                                }`}
                            />
                        ))}
                    </div>
                </div>
                )}

            {error && (
                <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                </div>
            )}

            {answer && (
                <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                        Grounded Answer
                    </p>

                    <div className="mt-3 text-sm leading-7 text-slate-200">
                        <ReactMarkdown
                            components={{
                            h1: ({ children }) => (
                                <h3 className="mt-4 text-base font-semibold text-white">
                                {children}
                                </h3>
                            ),
                            h2: ({ children }) => (
                                <h3 className="mt-4 text-base font-semibold text-white">
                                {children}
                                </h3>
                            ),
                            h3: ({ children }) => (
                                <h4 className="mt-4 text-sm font-semibold text-white">
                                {children}
                                </h4>
                            ),
                            p: ({ children }) => (
                                <p className="mt-3 leading-7 text-slate-200">
                                {children}
                                </p>
                            ),
                            strong: ({ children }) => (
                                <strong className="font-semibold text-cyan-200">
                                {children}
                                </strong>
                            ),
                            ul: ({ children }) => (
                                <ul className="mt-3 space-y-2 pl-5 text-slate-200">
                                {children}
                                </ul>
                            ),
                            ol: ({ children }) => (
                                <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-200">
                                {children}
                                </ol>
                            ),
                            li: ({ children }) => (
                                <li className="list-disc leading-6">
                                {children}
                                </li>
                            ),
                            code: ({ children }) => (
                                <code className="rounded bg-[#0B1220] px-1.5 py-0.5 text-cyan-200">
                                {children}
                                </code>
                            ),
                            }}
                        >
                            {answer}
                        </ReactMarkdown>
                    </div>
                    
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-cyan-500/20 pt-3">
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                            <Bot size={14} className="text-cyan-300" />

                            <span>Generated with Snowflake Cortex AI</span>
                            <span>•</span>
                            <span>Grounded using emergency SOPs</span>

                            {generatedAt && (
                                <>
                                    <span>•</span>
                                    <Clock3 size={12} />
                                    <span>{generatedAt}</span>
                                </>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleCopyAnswer}
                            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-[#0B1220] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-cyan-500/40 hover:text-white"
                        >
                            {copied ? (
                                <>
                                    <Check size={14} />
                                    Copied
                                </>
                            ) : (
                                <>
                                    <Copy size={14} />
                                    Copy Guidance
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {!isLoading &&
                submittedQuery &&
                !answer &&
                sources.length === 0 &&
                !error && (
                    <div className="mt-5 rounded-xl border border-dashed border-slate-700 bg-[#0B1220] p-6 text-center">
                        <p className="text-sm font-semibold text-slate-300">
                            No relevant SOP documents found
                        </p>

                        <p className="mt-2 text-xs text-slate-500">
                            Try using a more specific emergency response
                            question.
                        </p>
                    </div>
            )}

            {answer && (
                <div className="mt-6 rounded-2xl border border-slate-800 bg-[#0B1220] p-5">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                Response Trace
                            </p>

                            <h3 className="mt-2 text-sm font-semibold text-white">
                                Grounding Summary
                            </h3>
                        </div>

                        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase text-emerald-300">
                            Grounded
                        </span>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl border border-slate-800 bg-[#131C2E] p-4">
                            <div className="flex items-center gap-2 text-cyan-300">
                                <ShieldCheck size={16} />

                                <p className="text-[10px] font-semibold uppercase tracking-[0.16em]">
                                    Incident
                                </p>
                            </div>

                            <p className="mt-3 text-sm font-semibold text-white">
                                {incident?.type ?? "General"}
                            </p>

                            <p className="mt-1 truncate text-xs text-slate-500">
                                {incident?.location ?? "No active location"}
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-800 bg-[#131C2E] p-4">
                            <div className="flex items-center gap-2 text-blue-300">
                                <FileSearch size={16} />

                                <p className="text-[10px] font-semibold uppercase tracking-[0.16em]">
                                    SOP Sources
                                </p>
                            </div>

                            <p className="mt-3 text-sm font-semibold text-white">
                                {sources.length} documents
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Semantic retrieval
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-800 bg-[#131C2E] p-4">
                            <div className="flex items-center gap-2 text-violet-300">
                                <Database size={16} />

                                <p className="text-[10px] font-semibold uppercase tracking-[0.16em]">
                                    Search Service
                                </p>
                            </div>

                            <p className="mt-3 truncate text-sm font-semibold text-white">
                                ECHO_SOP_SEARCH
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Snowflake Cortex
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-800 bg-[#131C2E] p-4">
                            <div className="flex items-center gap-2 text-emerald-300">
                                <Bot size={16} />

                                <p className="text-[10px] font-semibold uppercase tracking-[0.16em]">
                                    AI Model
                                </p>
                            </div>

                            <p className="mt-3 text-sm font-semibold text-white">
                                llama3.1-8b
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                AI_COMPLETE
                            </p>
                        </div>
                    </div>
                </div>
                )}

            {sources.length > 0 && (
                <div className="mt-6">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Sources Used
                        </p>

                        <span className="text-xs text-slate-500">
                            {sources.length} documents
                        </span>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                        {sources.map((document, index) => {
                            const isExpanded = expandedSourceId === document.DOC_ID;

                            return (
                                <article key={document.DOC_ID} className="rounded-2xl border border-slate-800 bg-[#1A2438] p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0B1220] text-cyan-300">
                                            <BookOpen size={17} />
                                        </div>

                                        <span className="rounded-full border border-slate-700 bg-[#0B1220] px-2 py-1 text-[10px] font-semibold text-slate-400">
                                            Source {index + 1}
                                        </span>
                                    </div>

                                    <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
                                        {document.DOC_TYPE} · {document.DOC_ID}
                                    </p>

                                    <h3 className="mt-2 text-sm font-semibold leading-5 text-white">
                                        {document.TITLE}
                                    </h3>

                                    <p
                                        className={`mt-3 text-xs leading-5 text-slate-400 ${
                                        isExpanded ? "" : "line-clamp-6"
                                        }`}
                                    >
                                        {document.CONTENT}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setExpandedSourceId((current) =>
                                                current === document.DOC_ID
                                                ? null
                                                : document.DOC_ID,
                                        )}
                                        className="mt-4 flex items-center gap-2 text-xs font-semibold text-cyan-300 transition hover:text-cyan-200"
                                        aria-expanded={isExpanded}
                                    >
                                        {isExpanded ? "Show less" : "Read full SOP"}

                                        <ChevronDown
                                            size={14}
                                            className={`transition-transform ${
                                                isExpanded ? "rotate-180" : ""
                                            }`}
                                        />
                                    </button>
                                </article>
                            );
                            })}
                    </div>
                </div>
            )}
        </section>
    );
}