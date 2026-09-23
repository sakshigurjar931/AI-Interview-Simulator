from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.interview_session import InterviewSession
from app.schemas.interview import (
    InterviewSessionCreate,
    InterviewSessionResponse
)


router = APIRouter(
    prefix="/interview-sessions",
    tags=["Interview Sessions"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=InterviewSessionResponse)
def create_interview_session(
    session: InterviewSessionCreate,
    db: Session = Depends(get_db)
):
    new_session = InterviewSession(
        user_id=session.user_id,
        job_role_id=session.job_role_id
    )

    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    return new_session