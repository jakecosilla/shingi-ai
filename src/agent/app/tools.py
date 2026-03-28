import requests

RAG_API = "http://localhost:5076/ai/ask"

def rag_search(question: str):
    response = requests.post(RAG_API, json={
        "question": question
    })

    data = response.json()

    return {
        "context": data["answer"],
        "sources": data.get("sources", [])
    }
