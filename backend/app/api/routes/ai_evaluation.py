from fastapi import APIRouter
from pydantic import BaseModel

from app.services.answer_evaluator import evaluate_answer


router = APIRouter(
    prefix="/ai",
    tags=["AI Interview"]
)


class AnswerEvaluationRequest(BaseModel):
    question: str
    answer: str


@router.post("/evaluate-answer")
def evaluate_interview_answer(request: AnswerEvaluationRequest):
    evaluation = evaluate_answer(
        question=request.question,
        answer=request.answer
    )

    return {
        "question": request.question,
        "answer": request.answer,
        "evaluation": evaluation
    }