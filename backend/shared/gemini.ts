// Google Gemini integration with mock mode fallback
// Set MOCK_AI=true to use stub responses during local development

const MOCK_MODE = process.env.MOCK_AI === "true";

interface GeminiMessage {
  role: string;
  content: string;
}

export async function invokeModel(
  systemPrompt: string,
  messages: GeminiMessage[]
): Promise<string> {
  if (MOCK_MODE) {
    return mockResponse(messages);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required");
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const payload = {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents,
    generationConfig: {
      maxOutputTokens: 1024,
      temperature: 0.7,
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Gemini API error:", errText);
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "I'm sorry, I couldn't generate a response."
  );
}

function mockResponse(messages: GeminiMessage[]): string {
  const lastMsg = messages[messages.length - 1]?.content || "";

  if (lastMsg.includes("email") || lastMsg.includes("draft")) {
    return `Subject: Interest in Research Opportunities\n\nDear Professor,\n\nMy name is [Student Name], and I am a student at the university. I came across your work and am very interested in learning more about your research and any opportunities for involvement.\n\nI would love the chance to discuss how I might contribute to your lab. Would you have time for a brief meeting?\n\nThank you for your time.\n\nBest regards,\n[Student Name]`;
  }

  if (lastMsg.includes("question") || lastMsg.includes("about")) {
    return "Based on the available information, this resource is a great fit for students interested in this area. I'd recommend reaching out directly for the most up-to-date details on availability and requirements.";
  }

  return "I found some great matches based on your interests! Take a look at the results below — I've highlighted the most relevant options for you. Feel free to ask me about any specific result for more details, or I can help you draft an outreach email.";
}
