from pydantic import BaseModel


class FeedbackReportCreate(BaseModel):
    session_id: int
    overall_score: float | None = None
    strengths: str | None = None
    weaknesses: str | None = None
    suggestions: str | None = None


class FeedbackReportResponse(BaseModel):
    id: int
    session_id: int
    overall_score: float | None = None
    strengths: str | None = None
    weaknesses: str | None = None
    suggestions: str | None = None

    class Config:
        from_attributes = True
        