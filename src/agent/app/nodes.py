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
    retries = state.get("retries", 0)
    critic_reason = state.get("critic_reason", "")

    log_step("Planner Input", question)

    retry_context = ""
    if retries > 0 and critic_reason:
        retry_context = f"\nPrevious attempt failed. Critic Feedback: {critic_reason}\nPlease adjust your plan."

    prompt = f"""
You are an advanced enterprise planning AI.
Analyze the user's question and decide what tool to use and what input to provide to that tool.

Available tools:
{TOOL_DESCRIPTIONS}

Return ONLY JSON format:

{{
  "tool": "<tool_name or null>",
  "tool_input": "<specific search query or parameters for the tool>"
}}
{retry_context}

Question:
{question}
"""

    response = llm.invoke(prompt)
    raw = response.content.strip()

    log_step("Planner Output", raw)

    tool = None
    tool_input = None

    try:
        json_text = re.search(r'\{[\s\S]*\}', raw).group()
        data = json.loads(json_text)
        tool = data.get("tool")
        tool_input = data.get("tool_input")
    except Exception:
        log_step("⚠️ Planner parse failed", raw)

    return {
        "tool": tool,
        "tool_input": tool_input
    }


# 🔥 EXECUTOR (does the work)
def executor(state: AgentState):
    question = state.get("question")
    tool_name = state.get("tool")
    tool_input = state.get("tool_input")
    retries = state.get("retries", 0)
    critic_reason = state.get("critic_reason", "")

    log_step("Executor Input", {
        "tool": tool_name,
        "tool_input": tool_input,
        "retries": retries
    })

    context = None
    sources = []

    # Use tool if needed
    if tool_name:
        tool = TOOLS.get(tool_name)
        if tool:
            try:
                # Use tool_input if available, otherwise fallback to full question
                query_to_execute = tool_input if tool_input else question
                result = tool.execute(query_to_execute)
                context = result.get("context")
                sources = result.get("sources", [])
            except Exception as e:
                log_step("❌ Tool failed", str(e))
        else:
            log_step("⚠️ Unknown tool", tool_name)

    # Improve on retry
    improvement = ""
    if retries > 0:
        improvement = f"""
        PREVIOUS ATTEMPT WAS REJECTED.
        Critic Reason for rejection: {critic_reason}
        Improve the answer based on this feedback. Be extremely accurate, complete, and clear.
        """

    prompt = f"""
You are an expert enterprise backend AI assistant.

{improvement}

Use the following Context to answer the Question. If the Context doesn't contain the answer, say so, but do your best to infer from typical enterprise standards if safe. Cite the source if possible.

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
    retries = state.get("retries", 0)

    log_step("Critic Input", {
        "question": question,
        "answer": answer
    })

    # If we already retried too many times, no need to be harsh to avoid infinite loops
    strictness = "Be strict." if retries < 2 else "Since this is a retry, be slightly more forgiving but point out major flaws."

    prompt = f"""
You are a senior critic agent evaluating an AI assistant's answer.
{strictness}

Question:
{question}

Answer:
{answer}

Critique the answer. Does it fully address the question? Is it hallucinated? 
Return ONLY JSON format:

{{
  "verdict": "GOOD" or "BAD",
  "reason": "short explanation of why it is good or bad. If BAD, specify exactly what needs fixing."
}}
"""

    response = llm.invoke(prompt)
    raw = response.content.strip()

    log_step("Critic Raw", raw)

    verdict = "GOOD"
    reason = "Parsed successfully"

    try:
        json_text = re.search(r'\{[\s\S]*\}', raw).group()
        data = json.loads(json_text)
        verdict = data.get("verdict", "").strip().upper()
        reason = data.get("reason", "No reason provided")

        if verdict not in ["GOOD", "BAD"]:
            verdict = "GOOD"
    except Exception:
        log_step("⚠️ Critic parse failed", raw)

    log_step("Critic Verdict", verdict)

    return {
        "critique": verdict,
        "critic_reason": reason    }