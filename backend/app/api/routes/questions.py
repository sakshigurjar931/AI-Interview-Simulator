from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.interview_question import InterviewQuestion
from app.schemas.question import (
    InterviewQuestionCreate,
    InterviewQuestionResponse
)


router = APIRouter(
    prefix="/questions",
    tags=["Interview Questions"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=InterviewQuestionResponse)
def create_question(
    question: InterviewQuestionCreate,
    db: Session = Depends(get_db)
):
    new_question = InterviewQuestion(
        session_id=question.session_id,
        question=question.question,
        question_type=question.question_type,
        difficulty=question.difficulty
    )

    db.add(new_question)
    db.commit()
    db.refresh(new_question)

    return new_question