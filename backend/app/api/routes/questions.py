from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
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


@router.post("/", response_model=InterviewQuestionResponse, status_code=status.HTTP_201_CREATED)
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


@router.get("/session/{session_id}", response_model=List[InterviewQuestionResponse])
def get_session_questions(session_id: int, db: Session = Depends(get_db)):
    questions = db.query(InterviewQuestion).filter(
        InterviewQuestion.session_id == session_id
    ).order_by(InterviewQuestion.id).all()
    return questions
