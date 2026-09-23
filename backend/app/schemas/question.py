from pydantic import BaseModel


class InterviewQuestionCreate(BaseModel):
    session_id: int
    question: str
    question_type: str | None = None
    difficulty: str | None = None


class InterviewQuestionResponse(BaseModel):
    id: int
    session_id: int
    question: str
    question_type: str | None = None
    difficulty: str | None = None

    class Config:
        from_attributes = True