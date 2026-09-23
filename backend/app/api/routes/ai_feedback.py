from fastapi import APIRouter
from pydantic import BaseModel

from app.services.feedback_generator import generate_feedback


router = APIRouter(
    prefix="/ai",
    tags=["AI Interview"]
)


class FeedbackRequest(BaseModel):
    job_role: str
    evaluations: str


@router.post("/generate-feedback")
def generate_interview_feedback(request: FeedbackRequest):
    feedback = generate_feedback(
        job_role=request.job_role,
        evaluations=request.evaluations
    )

    return {
        "job_role": request.job_role,
        "feedback": feedback
    }