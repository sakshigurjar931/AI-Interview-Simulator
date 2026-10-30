from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
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


@router.post("/", response_model=FeedbackReportResponse, status_code=status.HTTP_201_CREATED)
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


@router.get("/session/{session_id}", response_model=List[FeedbackReportResponse])
def get_session_feedback(session_id: int, db: Session = Depends(get_db)):
    reports = db.query(FeedbackReport).filter(
        FeedbackReport.session_id == session_id
    ).order_by(FeedbackReport.id.desc()).all()
    return reports
