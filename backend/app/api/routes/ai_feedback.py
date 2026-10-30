import re
from fastapi import APIRouter, Depends, HTTPException, status
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


@router.post("/generate-feedback", status_code=status.HTTP_201_CREATED)
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
    ).order_by(InterviewQuestion.id).all()

    if not questions:
        raise HTTPException(
            status_code=404,
            detail="No interview questions found for this session."
        )

    # Build evaluations from saved answers
    evaluations = []
    answer_scores = []

    for question in questions:
        answer = db.query(Answer).filter(
            Answer.question_id == question.id
        ).order_by(Answer.id.desc()).first()

        if answer:
            score_val = answer.score if answer.score is not None else 5.0
            answer_scores.append(score_val)
            evaluations.append(
                f"Question: {question.question}\n"
                f"Candidate Answer: {answer.answer_text}\n"
                f"Score: {score_val}/10"
            )
        else:
            evaluations.append(
                f"Question: {question.question}\n"
                f"Candidate Answer: [Not Answered]\n"
                f"Score: 0/10"
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

    # Extract overall score (handles "Overall Score: 8/10", "**Overall Score:** 8", etc.)
    score_match = re.search(
        r"Overall Score\s*:?\s*(?:\*\*)?\s*(\d+(?:\.\d+)?)(?:\s*/\s*10)?",
        feedback,
        re.IGNORECASE
    )

    overall_score = None
    if score_match:
        try:
            overall_score = float(score_match.group(1))
            if overall_score > 10:
                overall_score = round(overall_score / 10, 1)
        except ValueError:
            overall_score = None

    if overall_score is None:
        overall_score = round(sum(answer_scores) / max(len(answer_scores), 1), 1) if answer_scores else 6.0

    # Extract sections
    strengths = ""
    weaknesses = ""
    suggestions = ""

    strengths_match = re.search(
        r"(?:#{1,6}\s*)?(?:\*\*)?Strengths(?:\*\*)?\s*:\s*"
        r"(.*?)(?=\n\s*(?:#{1,6}\s*)?(?:\*\*)?Weaknesses(?:\*\*)?\s*:|\Z)",
        feedback,
        re.IGNORECASE | re.DOTALL
    )

    weaknesses_match = re.search(
        r"(?:#{1,6}\s*)?(?:\*\*)?Weaknesses(?:\*\*)?\s*:\s*"
        r"(.*?)(?=\n\s*(?:#{1,6}\s*)?(?:\*\*)?Suggestions(?:\*\*)?\s*:|\Z)",
        feedback,
        re.IGNORECASE | re.DOTALL
    )

    suggestions_match = re.search(
        r"(?:#{1,6}\s*)?(?:\*\*)?Suggestions(?:\*\*)?\s*:\s*(.*)",
        feedback,
        re.IGNORECASE | re.DOTALL
    )

    if strengths_match:
        strengths = strengths_match.group(1).strip()
    if weaknesses_match:
        weaknesses = weaknesses_match.group(1).strip()
    if suggestions_match:
        suggestions = suggestions_match.group(1).strip()

    strengths = strengths.strip("*# ").strip()
    weaknesses = weaknesses.strip("*# ").strip()
    suggestions = suggestions.strip("*# ").strip()

    # Save feedback report
    new_report = FeedbackReport(
        session_id=request.session_id,
        overall_score=overall_score,
        strengths=strengths,
        weaknesses=weaknesses,
        suggestions=suggestions
    )

    session.status = "completed"

    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    # Helper lists for cleaner frontend rendering
    def parse_bullet_points(text: str) -> list[str]:
        items = []
        for line in text.splitlines():
            line = line.strip().lstrip("*-•123456789.) ").strip()
            if line:
                items.append(line)
        return items

    return {
        "message": "Feedback generated from saved answers and saved successfully",
        "feedback_report_id": new_report.id,
        "session_id": request.session_id,
        "overall_score": overall_score,
        "strengths": strengths,
        "strengths_list": parse_bullet_points(strengths),
        "weaknesses": weaknesses,
        "weaknesses_list": parse_bullet_points(weaknesses),
        "suggestions": suggestions,
        "suggestions_list": parse_bullet_points(suggestions),
        "feedback": feedback
    }
