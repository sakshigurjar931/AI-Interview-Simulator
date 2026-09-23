from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.answer import Answer
from app.schemas.answer import AnswerCreate, AnswerResponse


router = APIRouter(
    prefix="/answers",
    tags=["Answers"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=AnswerResponse)
def create_answer(
    answer: AnswerCreate,
    db: Session = Depends(get_db)
):
    new_answer = Answer(
        question_id=answer.question_id,
        answer_text=answer.answer_text
    )

    db.add(new_answer)
    db.commit()
    db.refresh(new_answer)

    return new_answer