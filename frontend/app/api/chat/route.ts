import { NextRequest, NextResponse } from "next/server";
import { getAllLabs } from "@/lib/dynamodb";

const MOCK_MODE = process.env.MOCK_AI === "true";

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // Get labs from DynamoDB for context
    const labs = await getAllLabs();

    // Search labs by keyword matching
    const tokens = message.toLowerCase().split(/\s+/).filter(Boolean);
    const matchedLabs = labs.filter((lab: Record<string, unknown>) => {
      const searchable = [
        lab.labName as string,
        lab.topics as string,
        lab.description as string,
        lab.department as string,
        lab.professorName as string || "",
      ].join(" ").toLowerCase();
      return tokens.some((t: string) => searchable.includes(t));
    }).slice(0, 4);

    if (MOCK_MODE) {
      const reply = matchedLabs.length > 0
        ? `I found ${matchedLabs.length} research labs that match your interests. Check out the results below and click any lab to learn more!`
        : `I can help you discover research labs, professors, and topics at U of T. Try asking about specific areas like "machine learning", "robotics", "cybersecurity", or "biomedical AI".`;

      return NextResponse.json({
        reply,
        labs: matchedLabs.length > 0 ? matchedLabs : undefined,
      });
    }

    // Call AWS Bedrock Converse API
    const { BedrockRuntimeClient, ConverseCommand } = await import(
      "@aws-sdk/client-bedrock-runtime"
    );

    const labContext = labs.map((l: Record<string, unknown>) =>
      `- ${l.labName} (${l.department}): ${l.description} Topics: ${l.topics}. Professor: ${l.professorName}`
    ).join("\n");

    const systemPrompt = `You are Atryn, a research discovery assistant for students at the University of Toronto. You help students find research labs, professors, and research topics.

RULES:
- Only discuss research labs, professors, and research topics.
- Do NOT recommend campus services, mental health services, career offices, or non-research resources.
- Be concise and helpful.
- Never use em-dashes. Use regular hyphens instead.
- Refer to yourself as "Atryn" (not "ATRYN").

When the student asks about labs or research topics, respond with ONLY valid JSON (no text outside it) in this format:
{"summary":"A brief 1-2 sentence friendly summary.","labs":[{"labName":"Exact Lab Name","description":"A personalized description explaining relevance, key research topics, and why it matches their interest. Use markdown formatting."}]}

IMPORTANT for lab responses:
- Use the EXACT lab name from the list below (case-sensitive).
- Each description should explain relevance, list key topics with "- " bullets, and end with a sentence about fit.
- Only include relevant labs.

When the student asks a conversational question, follow-up, or something that does not need lab results, respond with:
{"summary":"Your conversational response here.","labs":[]}

Available research labs at U of T:
${labContext}`;

    const bedrockMessages = [
      ...(conversationHistory || []).map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: [{ text: m.content }],
      })),
      { role: "user" as const, content: [{ text: message }] },
    ];

    try {
      const region = process.env.AWS_REGION || "us-west-2";
      const modelId = process.env.BEDROCK_MODEL_ID || "us.anthropic.claude-opus-4-6-v1";
      console.log("Bedrock config:", { region, modelId, hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID, hasSessionToken: !!process.env.AWS_SESSION_TOKEN });

      const client = new BedrockRuntimeClient({
        region,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
          sessionToken: process.env.AWS_SESSION_TOKEN,
        },
      });

      const command = new ConverseCommand({
        modelId,
        system: [{ text: systemPrompt }],
        messages: bedrockMessages,
        inferenceConfig: {
          maxTokens: 2048,
          temperature: 0.7,
        },
      });

      const bedrockResponse = await client.send(command);
      const rawReply =
        bedrockResponse.output?.message?.content?.[0]?.text ||
        '{"summary": "I can help you discover research labs at U of T. Try asking about specific research areas!", "labs": []}';

      // Parse the JSON response from the AI
      let reply = "Here are some labs that match your interests.";
      let aiLabs: { labName: string; description: string }[] = [];

      try {
        // Extract JSON from response (handle markdown code blocks)
        const jsonStr = rawReply.replace(/^```json?\n?/g, "").replace(/\n?```$/g, "").trim();
        const parsed = JSON.parse(jsonStr);
        reply = parsed.summary || reply;
        aiLabs = parsed.labs || [];
      } catch {
        // If JSON parsing fails, strip any JSON artifacts and use as plain text
        const cleaned = rawReply
          .replace(/```json?\n?/g, "")
          .replace(/```/g, "")
          .replace(/^\s*\{[\s\S]*\}\s*$/, "")
          .trim();
        reply = cleaned || "I can help you discover research labs at U of T. Try asking about specific areas like machine learning, robotics, or cybersecurity.";
      }

      // Match AI lab descriptions to actual lab records
      const responseLabs = aiLabs
        .map((aiLab: { labName: string; description: string }) => {
          const match = labs.find(
            (l: Record<string, unknown>) =>
              (l.labName as string).toLowerCase() === aiLab.labName.toLowerCase()
          );
          if (!match) return null;
          return { ...match, aiDescription: aiLab.description };
        })
        .filter(Boolean);

      return NextResponse.json({
        reply,
        labs: responseLabs.length > 0 ? responseLabs : matchedLabs.length > 0 ? matchedLabs : undefined,
      });
    } catch (bedrockError) {
      console.error("Bedrock API error:", bedrockError);
      return NextResponse.json({
        reply: "I found some relevant labs for you below! Click on any lab to learn more.",
        labs: matchedLabs.length > 0 ? matchedLabs : undefined,
      });
    }
  } catch (error: unknown) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
