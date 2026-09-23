from pydantic import BaseModel


class SkillGapCreate(BaseModel):
    session_id: int
    missing_skills: str | None = None
    recommended_skills: str | None = None
    learning_resources: str | None = None


class SkillGapResponse(BaseModel):
    id: int
    session_id: int
    missing_skills: str | None = None
    recommended_skills: str | None = None
    learning_resources: str | None = None

    class Config:
        from_attributes = True