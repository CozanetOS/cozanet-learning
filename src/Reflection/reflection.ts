import { getGroqClient } from "../groq-client.js";
import { z } from "zod";
import pino from "pino";

const logger = pino({ name: "ReflectionEngine" });

export const ReflectionResultSchema = z.object({
  action: z.string(),
  outcome: z.string(),
  success: z.boolean(),
  criticalAnalysis: z.string(),
  learnings: z.array(z.string()),
  recommendedAdjustments: z.array(z.string())
});

export type ReflectionResult = z.infer<typeof ReflectionResultSchema>;

export class ReflectionEngine {
  public readonly id = "learning:reflection";

  async reflect(action: string, outcome: string): Promise<ReflectionResult> {
    logger.info({ action }, "Starting action reflection analysis");
    const groq = getGroqClient();

    const prompt = `
Analyze the action taken and its outcome to extract valuable operational insights, flaws, and future course-corrections.
Action taken: "${action}"
Outcome observed: "${outcome}"

Respond with a raw JSON object adhering to this schema:
{
  "action": string,
  "outcome": string,
  "success": boolean,
  "criticalAnalysis": string (detailed post-mortem review of why things went the way they did),
  "learnings": string[] (core lessons learned from this sequence),
  "recommendedAdjustments": string[] (actionable, tactical changes for next iterations)
}
Do not include any conversational introduction, markdown containers, or extra content.
`;

    try {
      const response = await groq.chat.completions.create({
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        response_format: { type: "json_object" }
      });

      const rawJson = response.choices[0]?.message?.content || "{}";
      const parsed = JSON.parse(rawJson);
      const validated = ReflectionResultSchema.parse(parsed);

      logger.info({ action }, "Reflection complete");
      return validated;
    } catch (error) {
      logger.error({ error, action }, "Reflection analysis failed");
      throw error;
    }
  }

  async generateInsight(experiences: any[]): Promise<string> {
    logger.info({ count: experiences.length }, "Generating collective insight from history");
    const groq = getGroqClient();

    try {
      const response = await groq.chat.completions.create({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: "You are a metacognitive optimization system. Synthesize multiple past execution logs or experiences into an overarching meta-level strategic insight or best practice standard."
          },
          {
            role: "user",
            content: `Analyze these experiences and formulate high-level operating heuristics: ${JSON.stringify(experiences)}`
          }
        ],
        temperature: 0.4
      });

      return (response.choices[0]?.message?.content || "").trim();
    } catch (error) {
      logger.error({ error }, "Collective insight generation failed");
      throw error;
    }
  }
}
