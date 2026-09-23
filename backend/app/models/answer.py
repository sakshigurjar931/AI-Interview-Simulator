from sqlalchemy import Column, Integer, ForeignKey, Text, Float
from app.database.base import Base


class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)

    question_id = Column(
        Integer,
        ForeignKey("interview_questions.id"),
        nullable=False
    )

    answer_text = Column(
        Text,
        nullable=False
    )

    score = Column(
        Float,
        nullable=True
    )