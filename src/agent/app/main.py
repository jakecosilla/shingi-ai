from fastapi import FastAPI
from app.graph import graph
import time
import uuid

app = FastAPI()

@app.post("/agent/run")
async def run_agent(payload: dict):
    request_id = str(uuid.uuid4())

    start = time.time()

    print(f"[{request_id}] Incoming request:", payload)

    result = graph.invoke({
        "question": payload["question"],
        "context": None,
        "answer": None,
        "sources": [],
        "tool": None,
        "critique": None,
        "retries": 0,
        "request_id": request_id
    },
    config={"recursion_limit": 50})

    duration = time.time() - start

    print(f"[{request_id}] Completed in {round(duration, 2)}s")

    return {
        "request_id": request_id,  # 🔥 return it too
        "result": result,
        "metrics": {
            "duration_seconds": round(duration, 2),
            "retries": result.get("retries", 0)
        }
    }

@app.get("/health")
def health():
    return {"status": "ok"}