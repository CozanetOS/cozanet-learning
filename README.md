# CozanetOS Learning Engine (cozanet-learning)

An integral component of the **CozanetOS** ecosystem—the AI-native operating system.

---

## Overview

The cognitive improvement, research, and synthesis engine of CozanetOS. It processes external web, academic, and news data, filters out hallucinated claims, manages citations, ranks source quality, and refines Cozanet's knowledge base continuously over time.

---

## Core Capabilities

- **Web Search Integration**: Real-time parallel search orchestration across Google, Bing, DuckDuckGo, and other web engines.
- **Documentation Search**: Target crawler designed to index, parse, and search highly complex technical documentation pages.
- **Academic Search**: Direct queries to academic papers, journals, PDFs, and scholarly citations (ArXiv, PubMed, etc.).
- **News Research**: Continuous, low-latency tracking and discovery of current events, breaking news, and market changes.
- **Information Comparison**: Advanced NLP models that cross-reference multiple sources to detect divergence, bias, or factual conflicts.
- **Source Verification**: Automated credibility scoring evaluating authors, domain authority, and historical factual accuracy.
- **Citation Management**: Parses, structures, and manages references (APA, BibTeX, inline links) for every output claim.
- **Research Summaries**: Condenses long-form documents, reports, and PDFs into dense, insight-rich, and contextual summaries.
- **Deep Research Sessions**: Conducts recursive, multi-step deep dives that autonomously explore multiple branch topics.
- **Scheduled Learning**: Runs automated scheduled updates on specified knowledge domains to keep CozanetOS current.
- **Continuous Learning**: Evaluates every user-system interaction and builds incremental updates to optimize future execution paths.
- **Experience Learning**: Logs interaction results and constructs system 'experiences' that prevent repeating past errors.
- **Confidence Estimation**: Employs deep verification steps to assign mathematical certainty ratings to system responses.
- **Hallucination Detection**: Aggressively cross-references AI outputs with confirmed factual sources to catch inaccuracies.
- **Response Verification**: Intercepts generated outputs and verifies factual backing before presenting them to the user.
- **KnowledgeBuilder**: Parses raw search findings and builds structured, relational vector databases and knowledge graphs.
- **SourceRanking**: Sorts, weights, and dynamically prioritizes search results based on domain specialization and historical utility.
- **FactChecking**: Automated, objective validation of user queries or system claims against a network of verified facts.
- **ExperienceBuilder**: Translates system success/failure traces into learnable data points to adapt system reasoning.

---

## Architecture & Components

The internal components of `cozanet-learning` are engineered with high performance, resilience, and strict decoupling:

- **Research Coordinator**: Drives search agent strategies, managing deep-research session hierarchies.
- **Verification Pipeline**: Runs confidence estimations, hallucination checks, and fact-checking algorithms.
- **Citation Engine**: Indexes sources and produces structured bibliographies.
- **Experience Engine**: Analyzes task telemetry to append reinforcement-learning feedback loops to the OS knowledge store.

---

## Interface & API Overview

### Learning Endpoints

*   `POST /v1/research/session/start` - Launches a background multi-step deep research process.
*   `POST /v1/verify/claim` - Checks a list of claims against current knowledge databases and external sources.
*   `GET /v1/knowledge/graph` - Returns a section of the dynamic system knowledge graph built by KnowledgeBuilder.

### Sample Deep Research Invocation

```python
from cozanet_learning import ResearchSession

session = ResearchSession(topic="Quantum Encryption in Space Protocols")
session.start(depth=3, include_academic=True)
report = session.get_summary()
print(f"Confidence score: {report.confidence_rating}")
```

---

## CozanetOS Ecosystem Integration

`cozanet-learning` is fully integrated into the CozanetOS AI-native architecture and exchanges real-time data with other primary engines:

- **cozanet-memory**: Stores synthesized knowledge graphs, custom experiences, and citation assets in long-term vector storage.
- **cozanet-core**: Provides the base reasoning execution and scheduling capabilities.
- **cozanet-agents**: Supplies autonomous agents with real-time lookup, verification, and research tooling.
- **cozanet-browser**: Orchestrates real-time web-scraping, headless page reads, and HTML extraction.

---

## Quick-Start Notes

### Installation
Ensure that the main CozanetOS platform is installed. To add this engine to your installation:

```bash
czn-install install cozanet-learning
```

### Configuration
Update your unified `cozanet.toml` configuration to specify operational thresholds:

```toml
[cozanet_learning]
enabled = true
log_level = "info"
```

### Direct Run
To run the module manually in sandbox developer mode:

```bash
python -m cozanet_learning.main --dev
```

---

*CozanetOS: Empowering next-generation computing with secure, decentralized, AI-native core primitives.*
