from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.feedback_report import FeedbackReport
from app.schemas.feedback import (
    FeedbackReportCreate,
    FeedbackReportResponse
)


router = APIRouter(
    prefix="/feedback",
    tags=["Feedback"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=FeedbackReportResponse)
def create_feedback_report(
    feedback: FeedbackReportCreate,
    db: Session = Depends(get_db)
):
    new_feedback = FeedbackReport(
        session_id=feedback.session_id,
        overall_score=feedback.overall_score,
        strengths=feedback.strengths,
        weaknesses=feedback.weaknesses,
        suggestions=feedback.suggestions
    )

    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)

    return new_feedback