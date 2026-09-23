from fastapi import APIRouter
from pydantic import BaseModel

from app.services.skill_gap_analyzer import analyze_skill_gap


router = APIRouter(
    prefix="/ai",
    tags=["AI Interview"]
)


class SkillGapRequest(BaseModel):
    job_role: str
    feedback: str


@router.post("/analyze-skill-gap")
def analyze_interview_skill_gap(request: SkillGapRequest):
    skill_gap = analyze_skill_gap(
        job_role=request.job_role,
        feedback=request.feedback
    )

    return {
        "job_role": request.job_role,
        "skill_gap": skill_gap
    }