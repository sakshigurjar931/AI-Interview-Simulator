from pydantic import BaseModel
from datetime import datetime


class InterviewSessionCreate(BaseModel):
    user_id: int
    job_role_id: int


class InterviewSessionResponse(BaseModel):
    id: int
    user_id: int
    job_role_id: int
    started_at: datetime | None = None
    status: str

    class Config:
        from_attributes = True