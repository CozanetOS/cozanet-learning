# Cozanet Learning OS Engine

An advanced autonomous metacognitive & research suite designed for modular, reliable, structured knowledge synthesis, fact verification, real-time reflection, and task-outcome optimization.

## Key Architecture & Features

- **Multi-Key Round-Robin Rotation**: Implements self-healing API rotation using `GROQ_API_KEY_1`, `GROQ_API_KEY_2`, and `GROQ_API_KEY_3` to distribute rate-limits.
- **Structured JSON Completions**: Seamless integration with Zod schemas and `llama3-70b-8192` to guarantee output reliability.
- **Enterprise Logging**: Out-of-the-box structured diagnostics and JSON-ready tracing utilizing Pino logger.
- **Full TypeScript Types**: Shipped with complete module boundaries and modern ESM patterns.

## Engine Ecosystem

1. **Research Engine** (`learning:research`): Gathers key-points, topic summaries, and reliable sources using structured Llama-3 parsing.
2. **Reflection Engine** (`learning:reflection`): Analyzes past system activities and yields insights / strategic optimizations.
3. **Verification Engine** (`learning:verification`): Verifies and fact-checks inputs to provide verdicts, confidence scores, and rationales.
4. **Knowledge Builder** (`learning:knowledge-builder`): Distills raw paragraphs into structured semantic graphs and links technical concepts.
5. **Improvement Tracker** (`learning:improvement`): Metrics-driven progress manager highlighting successful trends and failure modes over time.

## Installation & Environment Setup

```bash
npm install
```

Set up your environment variables:
```bash
export GROQ_API_KEY_1="your-key-1"
export GROQ_API_KEY_2="your-key-2"
export GROQ_API_KEY_3="your-key-3"
```
