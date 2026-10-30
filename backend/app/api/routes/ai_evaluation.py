import re
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

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


@router.post("/evaluate-answer", status_code=status.HTTP_201_CREATED)
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

    ans_text = request.answer.strip() if request.answer else ""
    if not ans_text:
        # Candidate skipped
        new_answer = Answer(
            question_id=request.question_id,
            answer_text="[Skipped]",
            score=0.0
        )
        db.add(new_answer)
        db.commit()
        db.refresh(new_answer)

        return {
            "message": "Answer skipped and recorded",
            "answer_id": new_answer.id,
            "question_id": request.question_id,
            "answer": "[Skipped]",
            "score": 0.0,
            "evaluation": "Score: 0/10\nStrengths: Attempt recorded.\nWeaknesses: Question was skipped.\nSuggestion: Always attempt the question with relevant thoughts."
        }

    # Send question and answer to Gemini
    evaluation = evaluate_answer(
        question=question.question,
        answer=ans_text
    )

    # Extract score from Gemini response (handles **Score:** 8/10, Score: 8/10, etc.)
    score_match = re.search(
        r"Score:?\s*(?:\*\*)?(\d+(?:\.\d+)?)\s*(?:\*\*)?\s*/\s*10",
        evaluation,
        re.IGNORECASE
    )

    score = 5.0
    if score_match:
        try:
            score = float(score_match.group(1))
        except ValueError:
            score = 5.0

    # Save answer and score in database
    new_answer = Answer(
        question_id=request.question_id,
        answer_text=ans_text,
        score=score
    )

    db.add(new_answer)
    db.commit()
    db.refresh(new_answer)

    return {
        "message": "Answer evaluated and saved successfully",
        "answer_id": new_answer.id,
        "question_id": request.question_id,
        "answer": ans_text,
        "score": score,
        "evaluation": evaluation
    }
