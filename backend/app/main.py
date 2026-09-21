from fastapi import FastAPI

app = FastAPI(title="AI Interview Simulator")


@app.get("/")
def home():
    return {"message": "AI Interview Simulator API is running"}