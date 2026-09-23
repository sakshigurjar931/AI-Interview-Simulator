from sqlalchemy import Column, Integer, ForeignKey, Text
from app.database.base import Base


class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id = Column(Integer, primary_key=True, index=True)

    session_id = Column(
        Integer,
        ForeignKey("interview_sessions.id"),
        nullable=False
    )

    question = Column(
        Text,
        nullable=False
    )

    question_type = Column(
        Text,
        nullable=True
    )

    difficulty = Column(
        Text,
        nullable=True
    )