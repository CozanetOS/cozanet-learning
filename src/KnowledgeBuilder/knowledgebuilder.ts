import { getGroqClient } from "../groq-client.js";
import { z } from "zod";
import pino from "pino";
import { v4 as uuidv4 } from "uuid";

const logger = pino({ name: "KnowledgeBuilder" });

export const KnowledgeEntrySchema = z.object({
  id: z.string(),
  concept: z.string(),
  definition: z.string(),
  categories: z.array(z.string()),
  relationships: z.array(z.object({
    targetConcept: z.string(),
    type: z.string()
  })),
  confidence: z.number()
});

export type KnowledgeEntry = z.infer<typeof KnowledgeEntrySchema>;

export class KnowledgeBuilder {
  public readonly id = "learning:knowledge-builder";

  async extract(text: string): Promise<KnowledgeEntry[]> {
    logger.info("Extracting structured knowledge from text");
    const groq = getGroqClient();

    const prompt = `
Analyze the text below and extract fundamental concepts, technical components, or core frameworks into a structured knowledge graph schema.
Text to extract from:
"${text}"

Respond with a raw JSON object that contains an 'entries' key holding an array of structures matching this schema:
{
  "entries": [
    {
      "concept": string (name of the concept),
      "definition": string (precise description/role),
      "categories": string[],
      "relationships": [
        {
          "targetConcept": string,
          "type": string (e.g., "extends", "implements", "uses", "depends_on", "part_of")
        }
      ],
      "confidence": number (between 0 and 1)
    }
  ]
}
Make sure to generate realistic, meaningful concepts and relationships. No other text outside the JSON.
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
      
      const rawEntries = Array.isArray(parsed.entries) ? parsed.entries : [];
      const validatedEntries = rawEntries.map((item: any) => {
        return KnowledgeEntrySchema.parse({
          id: uuidv4(),
          concept: item.concept || "Unknown",
          definition: item.definition || "",
          categories: Array.isArray(item.categories) ? item.categories : [],
          relationships: Array.isArray(item.relationships) ? item.relationships : [],
          confidence: typeof item.confidence === "number" ? item.confidence : 0.8
        });
      });

      logger.info({ count: validatedEntries.length }, "Knowledge extraction complete");
      return validatedEntries;
    } catch (error) {
      logger.error({ error }, "Knowledge extraction failed");
      throw error;
    }
  }

  async synthesize(entries: KnowledgeEntry[]): Promise<string> {
    logger.info({ count: entries.length }, "Synthesizing structured knowledge entries");
    const groq = getGroqClient();

    try {
      const response = await groq.chat.completions.create({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: "You are a principal systems architect. Compile and synthesize separate structured technical entities into a unified, clean technical documentation layout or markdown knowledge-base schema."
          },
          {
            role: "user",
            content: `Synthesize these elements into a comprehensive architecture breakdown: ${JSON.stringify(entries)}`
          }
        ],
        temperature: 0.3
      });

      return (response.choices[0]?.message?.content || "").trim();
    } catch (error) {
      logger.error({ error }, "Knowledge synthesis failed");
      throw error;
    }
  }
}
