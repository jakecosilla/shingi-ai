from typing import TypedDict, List, Optional

class AgentState(TypedDict):
    question: str
    context: Optional[str]
    answer: Optional[str]
    sources: List[str]
    tool: Optional[str]
    critique: Optional[str]
    retries: int
    request_id: str 