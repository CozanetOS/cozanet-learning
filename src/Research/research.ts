import { getGroqClient } from "../groq-client.js";
import { z } from "zod";
import pino from "pino";

const logger = pino({ name: "ResearchEngine" });

export const ResearchResultSchema = z.object({
  topic: z.string(),
  summary: z.string(),
  keyPoints: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  sources: z.array(z.string()),
  timestamp: z.string()
});

export type ResearchResult = z.infer<typeof ResearchResultSchema>;

export class ResearchEngine {
  public readonly id = "learning:research";

  async research(topic: string, depth: "quick" | "deep" = "quick"): Promise<ResearchResult> {
    logger.info({ topic, depth }, "Starting research task");
    const groq = getGroqClient();

    const depthInstruction = depth === "deep" 
      ? "Provide an exhaustive, highly detailed analysis with deep background information." 
      : "Provide a concise, high-level summary highlighting only key critical findings.";

    const prompt = `
You are an advanced autonomous research assistant. Perform a comprehensive inquiry into the following topic.
Topic: "${topic}"
Depth requirement: ${depthInstruction}

Format your final response strictly as a JSON object matching this schema:
{
  "topic": string,
  "summary": string,
  "keyPoints": string[],
  "confidence": number (between 0 and 1 representing quality of findings),
  "sources": string[] (list synthesized real-world or theoretical domain-expert sources/perspectives),
  "timestamp": string (ISO 8601 current timestamp)
}
Do not return any conversational text, markdown blocks, or commentary outside of the raw JSON object.
`;

    try {
      const response = await groq.chat.completions.create({
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        response_format: { type: "json_object" }
      });

      const rawJson = response.choices[0]?.message?.content || "{}";
      const parsed = JSON.parse(rawJson);
      const validated = ResearchResultSchema.parse({
        ...parsed,
        timestamp: parsed.timestamp || new Date().toISOString()
      });

      logger.info({ topic }, "Research successfully completed and verified");
      return validated;
    } catch (error) {
      logger.error({ error, topic }, "Research task failed");
      throw error;
    }
  }

  async summarize(content: string): Promise<string> {
    logger.info("Summarizing content");
    const groq = getGroqClient();

    try {
      const response = await groq.chat.completions.create({
        model: "llama3-70b-8192",
        messages: [
          { 
            role: "system", 
            content: "You are an expert summarizer. Synthesize the provided text into a clean, concise, punchy narrative." 
          },
          { 
            role: "user", 
            content: content 
          }
        ],
        temperature: 0.2
      });

      const summary = response.choices[0]?.message?.content || "";
      return summary.trim();
    } catch (error) {
      logger.error({ error }, "Summarization failed");
      throw error;
    }
  }
}
