from langgraph.graph import StateGraph
from app.state import AgentState
from app.nodes import planner, executor, critic

builder = StateGraph(AgentState)

builder.add_node("planner", planner)
builder.add_node("executor", executor)
builder.add_node("critic", critic)

builder.set_entry_point("planner")

builder.add_edge("planner", "executor")
builder.add_edge("executor", "critic")

# 🔥 LOOP LOGIC
def route_after_critic(state: AgentState):
    retries = state.get("retries", 0)
    critique = state.get("critique", "GOOD")

    print(f"[Routing] critique={critique}, retries={retries}")

    if critique == "BAD" and retries < 2:
        # Route back to planner so the agent can choose a different tool or modify its search query dynamically
        return "planner"

    return "__end__"

builder.add_conditional_edges(
    "critic",
    route_after_critic
)

graph = builder.compile()