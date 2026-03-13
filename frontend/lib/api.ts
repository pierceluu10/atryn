import { ChatResponse, SearchResponse, AskResponse, EmailDraftResponse, Resource } from "@/types";
import seedData from "../../data/seed-resources.json";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";
const MOCK_MODE = !process.env.NEXT_PUBLIC_API_URL;

// Local search for mock mode
function localSearch(query: string, limit = 6): Resource[] {
  const resources = seedData as Resource[];
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return resources.slice(0, limit);

  const scored = resources.map((r) => {
    let score = 0;
    const searchable = [
      r.name, r.shortDescription, r.fullDescription, r.category,
      r.department || "", r.professorName || "", ...r.topics, ...r.tags,
    ].join(" ").toLowerCase();

    for (const token of tokens) {
      if (r.topics.some((t) => t.toLowerCase().includes(token))) score += 3;
      if (r.tags.some((t) => t.toLowerCase().includes(token))) score += 3;
      if (r.name.toLowerCase().includes(token)) score += 2;
      if (searchable.includes(token)) score += 1;
    }
    return { resource: r, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.resource);
}

export async function sendChat(
  message: string,
  conversationHistory: { role: string; content: string }[]
): Promise<ChatResponse> {
  if (MOCK_MODE) {
    const cards = localSearch(message);
    const reply = cards.length > 0
      ? `Great question! Based on your interest in "${message}", I found ${cards.length} relevant resources on campus. Here are your top matches — click any card to learn more, or ask me to draft an outreach email!`
      : `I appreciate your question about "${message}". I wasn't able to find exact matches in our current database, but try asking about specific topics like "machine learning labs", "career services", or "mental health support".`;
    return { reply, cards: cards.length > 0 ? cards : undefined };
  }

  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, conversationHistory }),
  });
  return res.json();
}

export async function searchResources(
  query: string,
  category?: string
): Promise<SearchResponse> {
  if (MOCK_MODE) {
    const results = localSearch(query);
    return {
      results,
      summary: `Found ${results.length} results matching "${query}".`,
    };
  }

  const res = await fetch(`${API_BASE}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, category }),
  });
  return res.json();
}

export async function getResourceDetail(id: string): Promise<Resource | null> {
  if (MOCK_MODE) {
    const resources = seedData as Resource[];
    return resources.find((r) => r.id === id) || null;
  }

  const res = await fetch(`${API_BASE}/resource/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function askAboutResource(
  resourceId: string,
  question: string
): Promise<AskResponse> {
  if (MOCK_MODE) {
    const resources = seedData as Resource[];
    const resource = resources.find((r) => r.id === resourceId);
    return {
      answer: resource
        ? `Based on the information available, ${resource.name} ${resource.fullDescription.substring(0, 200)}... I'd recommend reaching out directly for the most current details.`
        : "I couldn't find that resource. Please try another one.",
    };
  }

  const res = await fetch(`${API_BASE}/resource/${resourceId}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, resourceId }),
  });
  return res.json();
}

export async function draftEmail(
  resourceId: string,
  studentContext?: string
): Promise<EmailDraftResponse> {
  if (MOCK_MODE) {
    const resources = seedData as Resource[];
    const resource = resources.find((r) => r.id === resourceId);
    const name = resource?.professorName || resource?.name || "the team";
    return {
      subject: `Interest in ${resource?.name || "Your Work"}`,
      body: `Dear ${name},\n\nMy name is [Student Name], and I am a student at the university. I recently learned about ${resource?.name || "your work"} and am very interested in ${resource?.shortDescription?.toLowerCase() || "learning more"}.\n\n${studentContext ? `Specifically, ${studentContext}\n\n` : ""}I would love the opportunity to discuss how I might get involved. Would you have time for a brief meeting or call?\n\nThank you for your time and consideration.\n\nBest regards,\n[Student Name]`,
    };
  }

  const res = await fetch(`${API_BASE}/resource/${resourceId}/draft-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resourceId, studentContext }),
  });
  return res.json();
}
