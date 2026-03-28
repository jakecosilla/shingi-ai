# 🚀 Shingi AI – Agentic Legal AI Platform

Shingi AI is a production-ready agentic AI system that combines:

- .NET backend (RAG + business logic)
- Python LangGraph agent orchestration
- Local or cloud LLMs (Ollama / OpenAI)

It demonstrates a multi-agent architecture (Planner → Executor → Critic) with tool orchestration, self-correction, and observability.

---

## 🧠 Architecture

React UI (optional)
      ↓
.NET API (RAG + MCP server)
      ↓
Python LangGraph Agent
      ├── Planner (decides)
      ├── Executor (acts)
      ├── Critic (evaluates)
      └── Retry Loop (self-correcting)
      ↓
Tools (RAG, APIs, logic)
      ↓
LLM (Ollama / OpenAI)

---

## 🔥 Key Features

### ✅ Agentic AI (LangGraph)
- Multi-agent system (Planner, Executor, Critic)
- Dynamic tool selection (MCP-style)
- Conditional branching workflows
- Self-healing retry loop

### ✅ Retrieval-Augmented Generation (RAG)
- Document ingestion pipeline
- Embeddings via Ollama (nomic-embed-text)
- Vector search (pluggable)
- Context-aware responses

### ✅ MCP-style Tool System
- Tool registry pattern
- Decoupled tool execution (.NET)
- Agent-controlled orchestration (Python)

### ✅ Observability & Production Readiness
- Request tracing (request_id)
- Structured logging
- Execution metrics (latency, retries)
- Health endpoint

---

## 🏗️ Project Structure

shingi-ai/
├── src/
│   ├── backend/              # .NET API (RAG + business logic)
│   └── agent/                # Python LangGraph agent

---

## ⚙️ Setup

### 🔹 Backend (.NET)

cd src/backend/ShingiAI.Api
dotnet run

Runs on:
http://localhost:5076

---

### 🔹 Agent (Python)

cd src/agent
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

Runs on:
http://localhost:8000

---

### 🔹 Ollama (Local LLM)

ollama pull llama3
ollama pull nomic-embed-text
ollama run llama3

---

## 🧪 Usage

### Run Agent

curl -X POST http://localhost:8000/agent/run \
  -H "Content-Type: application/json" \
  -d '{"question":"What is RAG?"}'

---

### Health Check

GET http://localhost:8000/health

---

## 🧠 Example Response

{
  "request_id": "...",
  "result": {
    "question": "What is RAG?",
    "answer": "...",
    "sources": [],
    "tool": "rag_search",
    "critique": "GOOD",
    "retries": 1
  },
  "metrics": {
    "duration_seconds": 16.8,
    "retries": 1
  }
}

---

## 🎯 Design Principles

- Separation of Concerns (.NET = tools, Python = orchestration)
- Single Source of Truth (RAG in backend only)
- Agent-first Design (LLM decides)
- Production Safety (structured outputs, retry limits, error handling)

---

## 🚀 Technologies

- Backend: ASP.NET Core (.NET 10+)
- Agent: Python, LangGraph, LangChain
- LLM: Ollama / OpenAI

---

## 💡 Future Improvements

- Vector DB integration
- Multi-tool chaining
- Knowledge graphs
- Evaluation pipelines
- Docker deployment

---

## 🏁 Status

Production-ready agentic AI system.
