from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
import re

from app.database.connection import SessionLocal
from app.models.answer import Answer
from app.models.interview_question import InterviewQuestion
from app.services.answer_evaluator import evaluate_answer


router = APIRouter(
    prefix="/ai",
    tags=["AI Interview"]
)


class AnswerEvaluationRequest(BaseModel):
    question_id: int
    answer: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/evaluate-answer")
def evaluate_interview_answer(
    request: AnswerEvaluationRequest,
    db: Session = Depends(get_db)
):
    # Check that the question exists
    question = db.query(InterviewQuestion).filter(
        InterviewQuestion.id == request.question_id
    ).first()

    if not question:
        raise HTTPException(
            status_code=404,
            detail="Interview question not found."
        )

    # Send question and answer to Gemini
    evaluation = evaluate_answer(
        question=question.question,
        answer=request.answer
    )

    # Extract score from Gemini response
    score_match = re.search(
        r"Score:\s*(\d+(?:\.\d+)?)\s*/\s*10",
        evaluation,
        re.IGNORECASE
    )

    score = None

    if score_match:
        score = float(score_match.group(1))

    # Save answer and score in database
    new_answer = Answer(
        question_id=request.question_id,
        answer_text=request.answer,
        score=score
    )

    db.add(new_answer)
    db.commit()
    db.refresh(new_answer)

    return {
        "message": "Answer evaluated and saved successfully",
        "answer_id": new_answer.id,
        "question_id": request.question_id,
        "answer": request.answer,
        "score": score,
        "evaluation": evaluation
    }