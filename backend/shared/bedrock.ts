// Amazon Bedrock integration with mock mode fallback
// Set MOCK_AI=true to use stub responses during local development

const MOCK_MODE = process.env.MOCK_AI === "true";

interface BedrockMessage {
  role: string;
  content: string;
}

export async function invokeModel(
  systemPrompt: string,
  messages: BedrockMessage[]
): Promise<string> {
  if (MOCK_MODE) {
    return mockResponse(messages);
  }

  // Real Bedrock call via AWS SDK
  const { BedrockRuntimeClient, InvokeModelCommand } = await import(
    "@aws-sdk/client-bedrock-runtime"
  );

  const client = new BedrockRuntimeClient({
    region: process.env.AWS_REGION || "us-east-1",
  });

  const payload = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  };

  const command = new InvokeModelCommand({
    modelId: process.env.BEDROCK_MODEL_ID || "anthropic.claude-3-haiku-20240307-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(payload),
  });

  const response = await client.send(command);
  const body = JSON.parse(new TextDecoder().decode(response.body));
  return body.content?.[0]?.text || "I'm sorry, I couldn't generate a response.";
}

function mockResponse(messages: BedrockMessage[]): string {
  const lastMsg = messages[messages.length - 1]?.content || "";

  if (lastMsg.includes("email") || lastMsg.includes("draft")) {
    return `Subject: Interest in Research Opportunities\n\nDear Professor,\n\nMy name is [Student Name], and I am a student at the university. I came across your work and am very interested in learning more about your research and any opportunities for involvement.\n\nI would love the chance to discuss how I might contribute to your lab. Would you have time for a brief meeting?\n\nThank you for your time.\n\nBest regards,\n[Student Name]`;
  }

  if (lastMsg.includes("question") || lastMsg.includes("about")) {
    return "Based on the available information, this resource is a great fit for students interested in this area. I'd recommend reaching out directly for the most up-to-date details on availability and requirements.";
  }

  return "I found some great matches based on your interests! Take a look at the results below — I've highlighted the most relevant options for you. Feel free to ask me about any specific result for more details, or I can help you draft an outreach email.";
}
