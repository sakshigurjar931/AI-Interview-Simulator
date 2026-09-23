from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.interview_session import InterviewSession
from app.models.interview_question import InterviewQuestion
from app.models.answer import Answer
from app.models.feedback_report import FeedbackReport
from app.services.feedback_generator import generate_feedback

router = APIRouter(
    prefix="/ai",
    tags=["AI Interview"]
)


class FeedbackRequest(BaseModel):
    session_id: int
    job_role: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/generate-feedback")
def generate_interview_feedback(
    request: FeedbackRequest,
    db: Session = Depends(get_db)
):
    # Check interview session
    session = db.query(InterviewSession).filter(
        InterviewSession.id == request.session_id
    ).first()

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Interview session not found."
        )

    # Get all questions for this interview session
    questions = db.query(InterviewQuestion).filter(
        InterviewQuestion.session_id == request.session_id
    ).all()

    if not questions:
        raise HTTPException(
            status_code=404,
            detail="No interview questions found for this session."
        )

    # Build evaluations from saved answers
    evaluations = []

    for question in questions:
        answer = db.query(Answer).filter(
            Answer.question_id == question.id
        ).order_by(Answer.id.desc()).first()

        if answer:
            evaluations.append(
                f"Question: {question.question}\n"
                f"Candidate Answer: {answer.answer_text}\n"
                f"Score: {answer.score}/10"
            )

    if not evaluations:
        raise HTTPException(
            status_code=404,
            detail="No answers found for this interview session."
        )

    evaluations_text = "\n\n".join(evaluations)

    # Generate AI feedback
    feedback = generate_feedback(
        job_role=request.job_role,
        evaluations=evaluations_text
    )

    # Extract overall score
    import re

    score_match = re.search(
    r"(?:Overall Score\s*:?\s*)?(\d+(?:\.\d+)?)\s*/\s*10",
    feedback,
    re.IGNORECASE
    )

    overall_score = None

    if score_match:
        overall_score = float(score_match.group(1))

    # Extract sections
    strengths = ""
    weaknesses = ""
    suggestions = ""

    strengths_match = re.search(
        r"Strengths:\s*(.*?)(?=\n\s*Weaknesses:|\Z)",
        feedback,
        re.IGNORECASE | re.DOTALL
    )

    weaknesses_match = re.search(
        r"Weaknesses:\s*(.*?)(?=\n\s*Suggestions:|\Z)",
        feedback,
        re.IGNORECASE | re.DOTALL
    )

    suggestions_match = re.search(
        r"Suggestions:\s*(.*)",
        feedback,
        re.IGNORECASE | re.DOTALL
    )

    if strengths_match:
        strengths = strengths_match.group(1).strip()

    if weaknesses_match:
        weaknesses = weaknesses_match.group(1).strip()

    if suggestions_match:
        suggestions = suggestions_match.group(1).strip()

    # Save feedback report
    new_report = FeedbackReport(
        session_id=request.session_id,
        overall_score=overall_score,
        strengths=strengths,
        weaknesses=weaknesses,
        suggestions=suggestions
    )

    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    return {
        "message": "Feedback generated from saved answers and saved successfully",
        "feedback_report_id": new_report.id,
        "session_id": request.session_id,
        "overall_score": overall_score,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "suggestions": suggestions,
        "feedback": feedback
    }