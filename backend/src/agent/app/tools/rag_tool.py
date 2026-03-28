class RagTool:
    name = "rag_search"
    description = "Searches legal knowledge base"

    def execute(self, input: str):
        import requests

        response = requests.post(
            "http://localhost:5076/ai/ask",
            json={"question": input}
        )

        data = response.json()

        return {
            "context": data["answer"],
            "sources": data.get("sources", [])
        }