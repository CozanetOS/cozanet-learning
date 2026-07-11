import Groq from "groq-sdk";

const keys = [
  process.env.GROQ_API_KEY_1,
  process.env.GROQ_API_KEY_2,
  process.env.GROQ_API_KEY_3
].filter(Boolean) as string[];

let currentKeyIndex = 0;

export function getGroqClient(): Groq {
  if (keys.length === 0) {
    // Fallback to standard GROQ_API_KEY if none of the specific indexed ones are defined
    const fallbackKey = process.env.GROQ_API_KEY;
    if (!fallbackKey) {
      throw new Error("No Groq API keys found in environment variables (GROQ_API_KEY_1, GROQ_API_KEY_2, GROQ_API_KEY_3, or GROQ_API_KEY).");
    }
    return new Groq({ apiKey: fallbackKey });
  }
  const key = keys[currentKeyIndex % keys.length];
  currentKeyIndex++;
  return new Groq({ apiKey: key });
}
