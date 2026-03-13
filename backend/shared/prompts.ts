export const SYSTEM_PROMPT = `You are Campus Compass, a friendly and knowledgeable university assistant chatbot. You help students discover relevant labs, professors, campus services, and opportunities based on their interests.

Rules:
- Only use information from the provided records. Never fabricate details.
- If information is not available in the records, say so honestly.
- Be concise, warm, and helpful.
- When presenting multiple results, give a brief personalized summary first.
- Use the student's stated interests to explain WHY each result is relevant to them.`;

export function interestSummaryPrompt(userMessage: string, matchedRecords: string): string {
  return `The student said: "${userMessage}"

Here are the matching campus resources from our database:
${matchedRecords}

Respond with:
1. A short personalized greeting acknowledging their interests (1-2 sentences)
2. A brief summary of what you found (1 sentence)
3. Mention the top categories of matches

Keep it concise and friendly. Do not list every record — the cards will be shown separately.`;
}

export function searchResponsePrompt(query: string, matchedRecords: string): string {
  return `The student searched for: "${query}"

Here are the matching results from our campus database:
${matchedRecords}

Provide a brief summary (2-3 sentences) of what was found. Highlight the most relevant matches and explain briefly why they match. Do not repeat all details — the result cards will be displayed separately.`;
}

export function itemQAPrompt(question: string, record: string): string {
  return `The student is asking about a specific campus resource. Here is the full record:
${record}

The student's question: "${question}"

Answer using ONLY the information in the record above plus reasonable inference from it. If the answer is not available in the record, say so clearly. Keep the answer concise and helpful.`;
}

export function emailDraftPrompt(record: string, studentContext?: string): string {
  return `Draft a short, polite outreach email for a student to send to the contact for this campus resource:
${record}

${studentContext ? `The student mentioned: "${studentContext}"` : "The student wants to learn more about this resource."}

Requirements:
- Include a clear subject line
- Use [Student Name] as placeholder for the student's name
- Keep it under 150 words
- Be professional but friendly
- Reference specific details from the record to show genuine interest
- End with a clear ask (e.g., meeting, more info, how to get involved)

Format the response as:
Subject: <subject line>

<email body>`;
}
