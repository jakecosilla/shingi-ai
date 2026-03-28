from app.state import AgentState
from app.tools.registry import TOOLS, TOOL_DESCRIPTIONS
from app.utils.logger import log_step
from app.config import MODEL_NAME, OLLAMA_URL
from langchain_community.chat_models import ChatOllama
import json
import re

llm = ChatOllama(
    model=MODEL_NAME,
    base_url=OLLAMA_URL
)

# 🔥 PLANNER (decides tool)
def planner(state: AgentState):
    question = state.get("question")

    log_step("Planner Input", question)

    prompt = f"""
You are a planning agent.

Decide how to answer the question.

Available tools:
{TOOL_DESCRIPTIONS}

Return ONLY JSON:

{{ "tool": "<tool_name or null>" }}

Question:
{question}
"""

    response = llm.invoke(prompt)
    raw = response.content.strip()

    log_step("Planner Output", raw)

    try:
        json_text = re.search(r'\{.*\}', raw).group()
        data = json.loads(json_text)
        tool = data.get("tool")
    except Exception:
        log_step("⚠️ Planner parse failed", raw)
        tool = None

    return {
        "tool": tool
    }


# 🔥 EXECUTOR (does the work)
def executor(state: AgentState):
    question = state.get("question")
    tool_name = state.get("tool")
    retries = state.get("retries", 0)

    log_step("Executor Input", {
        "tool": tool_name,
        "retries": retries
    })

    context = None
    sources = []

    # Use tool if needed
    if tool_name:
        tool = TOOLS.get(tool_name)

        if tool:
            try:
                result = tool.execute(question)
                context = result.get("context")
                sources = result.get("sources", [])
            except Exception as e:
                log_step("❌ Tool failed", str(e))
        else:
            log_step("⚠️ Unknown tool", tool_name)

    # Improve on retry
    improvement = ""
    if retries > 0:
        improvement = "Improve the previous answer. Be more accurate and complete."

    prompt = f"""
You are a legal assistant AI.

{improvement}

Context:
{context}

Question:
{question}
"""

    response = llm.invoke(prompt)

    log_step("Executor Output", "Generated answer")

    return {
        "context": context,
        "sources": sources,
        "answer": response.content,
        "retries": retries + 1
    }


# 🔥 CRITIC (evaluates answer)
def critic(state: AgentState):
    question = state.get("question")
    answer = state.get("answer")

    log_step("Critic Input", {
        "question": question,
        "answer": answer
    })

    prompt = f"""
You are a critic agent.

Evaluate the answer.

Question:
{question}

Answer:
{answer}

Return JSON:

{{
  "verdict": "GOOD" or "BAD",
  "reason": "short explanation"
}}
"""

    response = llm.invoke(prompt)
    raw = response.content.strip()

    log_step("Critic Raw", raw)

    try:
        json_text = re.search(r'\{.*\}', raw).group()
        data = json.loads(json_text)
        verdict = data.get("verdict", "").strip().upper()

        if verdict not in ["GOOD", "BAD"]:
            verdict = "GOOD"
    except Exception:
        log_step("⚠️ Critic parse failed", raw)
        verdict = "GOOD"

    log_step("Critic Verdict", verdict)

    return {
        "critique": verdict
    }