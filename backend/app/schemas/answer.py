from pydantic import BaseModel


class AnswerCreate(BaseModel):
    question_id: int
    answer_text: str


class AnswerResponse(BaseModel):
    id: int
    question_id: int
    answer_text: str
    score: float | None = None

    class Config:
        from_attributes = True