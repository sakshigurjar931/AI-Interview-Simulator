from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.interview_session import InterviewSession
from app.models.feedback_report import FeedbackReport
from app.models.skill_gap import SkillGap
from app.services.skill_gap_analyzer import analyze_skill_gap

router = APIRouter(
    prefix="/ai",
    tags=["AI Interview"]
)


class SkillGapRequest(BaseModel):
    session_id: int
    job_role: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/analyze-skill-gap")
def analyze_interview_skill_gap(
    request: SkillGapRequest,
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

    # Get latest feedback report for this session
    feedback_report = db.query(FeedbackReport).filter(
        FeedbackReport.session_id == request.session_id
    ).order_by(
        FeedbackReport.id.desc()
    ).first()

    if not feedback_report:
        raise HTTPException(
            status_code=404,
            detail="No feedback report found for this interview session."
        )

    # Build feedback text from saved database fields
    feedback_text = f"""
Overall Score: {feedback_report.overall_score}/10

Strengths:
{feedback_report.strengths}

Weaknesses:
{feedback_report.weaknesses}

Suggestions:
{feedback_report.suggestions}
"""

    # Analyze skill gap using saved feedback
    skill_gap = analyze_skill_gap(
        job_role=request.job_role,
        feedback=feedback_text
    )

    # Extract sections
    import re

    missing_skills = ""
    recommended_skills = ""
    learning_resources = ""

    missing_match = re.search(
        r"Missing Skills:\s*(.*?)(?=\n\s*Recommended Skills:|\Z)",
        skill_gap,
        re.IGNORECASE | re.DOTALL
    )

    recommended_match = re.search(
        r"Recommended Skills:\s*(.*?)(?=\n\s*Learning Resources:|\Z)",
        skill_gap,
        re.IGNORECASE | re.DOTALL
    )

    resources_match = re.search(
        r"Learning Resources:\s*(.*)",
        skill_gap,
        re.IGNORECASE | re.DOTALL
    )

    if missing_match:
        missing_skills = missing_match.group(1).strip()

    if recommended_match:
        recommended_skills = recommended_match.group(1).strip()

    if resources_match:
        learning_resources = resources_match.group(1).strip()

    # Save skill-gap report
    new_skill_gap = SkillGap(
        session_id=request.session_id,
        missing_skills=missing_skills,
        recommended_skills=recommended_skills,
        learning_resources=learning_resources
    )

    db.add(new_skill_gap)
    db.commit()
    db.refresh(new_skill_gap)

    return {
        "message": "Skill gap analyzed from saved feedback and saved successfully",
        "skill_gap_id": new_skill_gap.id,
        "session_id": request.session_id,
        "missing_skills": missing_skills,
        "recommended_skills": recommended_skills,
        "learning_resources": learning_resources,
        "skill_gap": skill_gap
    }