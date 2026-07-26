"use client";

import { BookOpen, Bot, Search, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { FormEvent, useState } from "react";
import { askEcho, type GroundedAnswerSource } from "@/services/cortex";

type AskEchoProps = {
    incidentTitle?: string;
    incidentType?: string;
};

export function AskEcho({ incidentTitle, incidentType }: AskEchoProps) {
    const [query, setQuery] = useState("");
    const [answer, setAnswer] = useState("");
    const [sources, setSources] = useState<GroundedAnswerSource[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submittedQuery, setSubmittedQuery] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const trimmedQuery = query.trim();

        if (!trimmedQuery || isLoading) return;

        setIsLoading(true);
        setError(null);
        setSubmittedQuery(trimmedQuery);

        setAnswer("");
        setSources([]);

        try {
            const result = await askEcho(trimmedQuery);

            setAnswer(result.answer);
            setSources(result.sources);
        } catch (searchError) {
            setError(
            searchError instanceof Error
                ? searchError.message
                : "Unable to search SOP documents.",
            );
        } finally {
            setIsLoading(false);
        }
    }

    function handleSuggestedQuestion(question: string) {
        setQuery(question);
    }

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
        incidentType === "MEDICAL"
            ? "What is the mass casualty triage procedure?"
            : null,
        "What resources should be deployed first?",
    ].filter((question): question is string =>
        Boolean(question),
    );

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

            {incidentTitle && (
                <div className="mt-5 rounded-xl border border-slate-800 bg-[#0B1220] px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Current Incident
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white">
                    {incidentTitle}
                    </p>
                </div>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
                {suggestedQuestions.map((question) => (
                    <button
                    key={question}
                    type="button"
                    onClick={() =>
                        handleSuggestedQuestion(question)
                    }
                    className="rounded-full border border-slate-700 bg-[#0B1220] px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-500/40 hover:text-white"
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
                        disabled={isLoading}
                        className="h-12 w-full rounded-xl border border-slate-700 bg-[#0B1220] pl-11 pr-4 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-cyan-500/60 disabled:opacity-60"
                    />
                </div>

                <button
                    type="submit"
                    disabled={!query.trim() || isLoading}
                    className="flex h-12 items-center gap-2 rounded-xl bg-cyan-600 px-5 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                >
                    <Send size={15} />
                    {isLoading ? "Searching..." : "Ask"}
                </button>
            </form>

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

                    <div className="mt-5 flex items-center gap-2 border-t border-cyan-500/20 pt-3">
                        <Bot size={14} className="text-cyan-300" />
                        <p className="text-[11px] text-slate-400">
                            Generated with Snowflake Cortex AI • Grounded using emergency SOPs
                        </p>
                    </div>
                </div>
            )}

            {!isLoading &&
                submittedQuery &&
                !answer &&
                sources.length === 0 && (
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
                        {sources.map((document, index) => (
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

                                <p className="mt-3 line-clamp-6 text-xs leading-5 text-slate-400">
                                    {document.CONTENT}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}