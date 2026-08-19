"use client";

import { useState } from "react";
import { Bot, Send, X } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { askEcho, type EchoIncidentContext } from "@/services/cortex";

type FloatingAskEchoProps = {
  incident: EchoIncidentContext | null;
};

export function FloatingAskEcho({ incident }: FloatingAskEchoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuestion = question.trim();

    if (!incident || !trimmedQuestion || isLoading) {
      return;
    }

    try {
        setIsLoading(true);
        setError(null);

        const result = await askEcho(trimmedQuestion, incident);
        setAnswer(result.answer);

    } catch (error) {
        setError(error instanceof Error ? error.message : "Unable to get a response from ECHO.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[90] flex h-[480px] w-[380px] flex-col overflow-hidden rounded-2xl border border-cyan-500/20 bg-[#131C2E] shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
          <div className="flex items-start justify-between border-b border-slate-800 p-4">
            <div>
              <div className="flex items-center gap-2">
                <Bot size={18} className="text-cyan-300"/>

                <p className="text-sm font-semibold text-white">
                  Ask ECHO
                </p>
              </div>

              <p className="mt-1 max-w-[280px] truncate text-xs text-slate-400">
                {incident ? incident.title : "No active incident"}
              </p>
            </div>

            <button
              type="button"
              aria-label="Close Ask ECHO"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-white"
            >
              <X size={17} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {!incident ? (
              <div className="rounded-xl border border-dashed border-slate-700 p-4 text-sm text-slate-500">
                Select an incident to start asking ECHO.
              </div>
            ) : answer ? (
              <div className="space-y-3">
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-md bg-blue-600 px-4 py-3 text-sm leading-5 text-white">
                    {question}
                  </div>
                </div>

                <div className="flex gap-2">
                    <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-300">
                        <Bot size={15} />
                    </div>

                    <div className="min-w-0 max-w-[85%] rounded-2xl rounded-tl-md border border-slate-800 bg-[#0B1220] px-4 py-3 text-sm leading-6 text-slate-300">
                        <ReactMarkdown
                            components={{
                            p: ({ children }) => (
                                <p className="mb-3 last:mb-0">
                                    {children}
                                </p>
                            ),
                            strong: ({ children }) => (
                                <strong className="font-semibold text-cyan-200">
                                    {children}
                                </strong>
                            ),
                            ul: ({ children }) => (
                                <ul className="my-2 list-disc space-y-1 pl-5">
                                    {children}
                                </ul>
                            ),
                            ol: ({ children }) => (
                                <ol className="my-2 list-decimal space-y-1 pl-5">
                                    {children}
                                </ol>
                            ),
                            li: ({ children }) => (
                                <li className="leading-6">
                                    {children}
                                </li>
                            ),
                            }}
                        >
                            {answer}
                        </ReactMarkdown>
                    </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-white">
                  How can I assist?
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Ask about evacuation, resources, safety procedures, or operational guidance for the current incident.
                </p>

                <div className="mt-5 space-y-2">
                  <button
                    type="button"
                    onClick={() =>
                      setQuestion(
                        "What should responders prioritise first?",
                      )
                    }
                    className="w-full rounded-xl border border-slate-800 bg-[#0B1220] px-3 py-2.5 text-left text-xs text-slate-300 transition hover:border-cyan-500/30"
                  >
                    What should responders
                    prioritise first?
                  </button>

                  <button
                    type="button"
                    onClick={() => setQuestion("What safety procedures should be followed?")}
                    className="w-full rounded-xl border border-slate-800 bg-[#0B1220] px-3 py-2.5 text-left text-xs text-slate-300 transition hover:border-cyan-500/30"
                  >
                    What safety procedures
                    should be followed?
                  </button>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="mt-4 flex items-center gap-2 text-xs text-cyan-300">
                <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
                Searching operational guidance...
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
                {error}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-slate-800 p-4">
            <div className="flex gap-2">
              <input
                value={question}
                disabled={!incident || isLoading}
                onChange={(event) => {
                  setQuestion(event.target.value);

                  if (answer) {
                    setAnswer(null);
                  }
                }}
                placeholder="Ask about this incident..."
                className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-[#0B1220] px-3 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-cyan-500/50 disabled:cursor-not-allowed disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={
                  !incident ||
                  !question.trim() ||
                  isLoading
                }
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500 text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        type="button"
        aria-label="Open Ask ECHO"
        onClick={() =>
          setIsOpen((current) => !current)
        }
        className="fixed bottom-6 right-6 z-[90] flex h-14 w-14 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-500 text-slate-950 shadow-[0_10px_40px_rgba(6,182,212,0.3)] transition hover:scale-105 hover:bg-cyan-400"
      >
        {isOpen ? (
          <X size={22} />
        ) : (
          <Bot size={22} />
        )}
      </button>
    </>
  );
}