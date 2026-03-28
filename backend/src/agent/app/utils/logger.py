import time

def log_step(step: str, data=None):
    print(f"[{time.strftime('%H:%M:%S')}] {step}")
    if data:
        print("   →", data)