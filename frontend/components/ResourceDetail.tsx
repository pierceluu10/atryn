"use client";

import { useState } from "react";
import { Resource } from "@/types";
import { askAboutResource, draftEmail } from "@/lib/api";

const categoryLabels: Record<string, string> = {
  campus_service: "Campus Service",
  lab: "Research Lab",
  professor: "Professor",
  opportunity: "Opportunity",
  student_group: "Student Group",
};

interface Props {
  resource: Resource;
  onClose: () => void;
  onAddMessage: (msg: string) => void;
}

export default function ResourceDetail({ resource, onClose, onAddMessage }: Props) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [email, setEmail] = useState<{ subject: string; body: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");
    try {
      const res = await askAboutResource(resource.id, question);
      setAnswer(res.answer);
    } catch {
      setAnswer("Sorry, I couldn't process that question right now.");
    }
    setLoading(false);
  }

  async function handleDraftEmail() {
    setLoading(true);
    setEmail(null);
    try {
      const res = await draftEmail(resource.id);
      setEmail(res);
    } catch {
      setEmail({ subject: "Error", body: "Could not generate email draft." });
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-lg h-full bg-white shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="font-serif text-xl text-primary truncate pr-4">
            {resource.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Category badge */}
          <span className="inline-block text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
            {categoryLabels[resource.category] || resource.category}
          </span>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed">{resource.fullDescription}</p>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {resource.department && (
              <div>
                <span className="text-gray-400 block text-xs">Department</span>
                <span className="text-gray-700">{resource.department}</span>
              </div>
            )}
            {resource.building && (
              <div>
                <span className="text-gray-400 block text-xs">Building</span>
                <span className="text-gray-700">{resource.building}</span>
              </div>
            )}
            {resource.officeLocation && (
              <div>
                <span className="text-gray-400 block text-xs">Location</span>
                <span className="text-gray-700">{resource.officeLocation}</span>
              </div>
            )}
            {resource.audience && (
              <div>
                <span className="text-gray-400 block text-xs">Audience</span>
                <span className="text-gray-700">{resource.audience}</span>
              </div>
            )}
            {resource.contactEmail && (
              <div>
                <span className="text-gray-400 block text-xs">Contact</span>
                <a
                  href={`mailto:${resource.contactEmail}`}
                  className="text-primary hover:underline"
                >
                  {resource.contactEmail}
                </a>
              </div>
            )}
            {resource.website && (
              <div>
                <span className="text-gray-400 block text-xs">Website</span>
                <a
                  href={resource.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline truncate block"
                >
                  Visit website
                </a>
              </div>
            )}
          </div>

          {/* Topics */}
          {resource.topics.length > 0 && (
            <div>
              <span className="text-gray-400 text-xs block mb-2">Topics</span>
              <div className="flex flex-wrap gap-1.5">
                {resource.topics.map((t) => (
                  <span
                    key={t}
                    className="text-xs bg-accent text-primary px-2.5 py-1 rounded-full"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Ask a question */}
          <div className="border-t border-gray-100 pt-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Ask a question about this resource
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                placeholder="e.g., Is this open to freshmen?"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
              <button
                onClick={handleAsk}
                disabled={loading || !question.trim()}
                className="bg-primary text-white text-sm px-4 py-2 rounded-lg hover:bg-primary-light disabled:opacity-50 transition-colors"
              >
                Ask
              </button>
            </div>
            {answer && (
              <div className="mt-3 bg-accent rounded-lg p-3 text-sm text-gray-700">
                {answer}
              </div>
            )}
          </div>

          {/* Draft email */}
          {resource.contactEmail && (
            <div className="border-t border-gray-100 pt-5">
              <button
                onClick={handleDraftEmail}
                disabled={loading}
                className="w-full border-2 border-primary text-primary font-medium py-2.5 rounded-lg hover:bg-primary hover:text-white disabled:opacity-50 transition-colors text-sm"
              >
                {loading ? "Generating..." : "Draft Outreach Email"}
              </button>
              {email && (
                <div className="mt-3 bg-gray-50 rounded-lg p-4 text-sm space-y-2">
                  <div>
                    <span className="font-semibold text-gray-600">Subject:</span>{" "}
                    {email.subject}
                  </div>
                  <div className="whitespace-pre-wrap text-gray-700">{email.body}</div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `Subject: ${email.subject}\n\n${email.body}`
                      );
                    }}
                    className="text-xs text-primary hover:underline"
                  >
                    Copy to clipboard
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
