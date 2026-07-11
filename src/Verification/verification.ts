import { getGroqClient } from "../groq-client.js";
import { z } from "zod";
import pino from "pino";

const logger = pino({ name: "VerificationEngine" });

export const VerificationResultSchema = z.object({
  claim: z.string(),
  verdict: z.enum(["true", "false", "uncertain"]),
  confidence: z.number().min(0).max(1),
  reasoning: z.string()
});

export type VerificationResult = z.infer<typeof VerificationResultSchema>;

export class VerificationEngine {
  public readonly id = "learning:verification";

  async verify(claim: string, context?: string): Promise<VerificationResult> {
    logger.info({ claim }, "Starting fact-checking verification");
    const groq = getGroqClient();

    const contextPart = context ? `Provided Context: "${context}"` : "No auxiliary context provided. Rely on state-of-the-art verifiable world and scientific knowledge.";

    const prompt = `
Fact-check the following claim critically.
Claim: "${claim}"
${contextPart}

Respond with a raw JSON object adhering to this schema:
{
  "claim": string,
  "verdict": "true" | "false" | "uncertain",
  "confidence": number (confidence score between 0.0 and 1.0),
  "reasoning": string (objective, step-by-step logical justification of the verdict, listing any known counterexamples or corroborating facts)
}
No extra text, wrappers, or introduction.
`;

    try {
      const response = await groq.chat.completions.create({
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        response_format: { type: "json_object" }
      });

      const rawJson = response.choices[0]?.message?.content || "{}";
      const parsed = JSON.parse(rawJson);
      const validated = VerificationResultSchema.parse(parsed);

      logger.info({ claim, verdict: validated.verdict }, "Verification complete");
      return validated;
    } catch (error) {
      logger.error({ error, claim }, "Verification failed");
      throw error;
    }
  }
}
