from fastapi import APIRouter
from pydantic import BaseModel

from app.services.question_generator import generate_questions


router = APIRouter(
    prefix="/ai",
    tags=["AI Interview"]
)


class QuestionRequest(BaseModel):
    job_role: str
    difficulty: str = "Medium"
    count: int = 5


@router.post("/generate-questions")
def generate_interview_questions(request: QuestionRequest):
    questions = generate_questions(
        job_role=request.job_role,
        difficulty=request.difficulty,
        count=request.count
    )

    return {
        "job_role": request.job_role,
        "difficulty": request.difficulty,
        "questions": questions
    }