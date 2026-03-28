from app.tools.rag_tool import RagTool

TOOLS = {
    "rag_search": RagTool(),
}

TOOL_DESCRIPTIONS = """
Available tools:

1. rag_search:
   - Searches legal knowledge base
   - Use for questions about contracts, law, definitions

If no tool is needed, return: NONE
"""