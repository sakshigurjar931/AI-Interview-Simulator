from sqlalchemy import Column, Integer, ForeignKey, Text, Float
from app.database.base import Base


class FeedbackReport(Base):
    __tablename__ = "feedback_reports"

    id = Column(Integer, primary_key=True, index=True)

    session_id = Column(
        Integer,
        ForeignKey("interview_sessions.id"),
        nullable=False
    )

    overall_score = Column(
        Float,
        nullable=True
    )

    strengths = Column(
        Text,
        nullable=True
    )

    weaknesses = Column(
        Text,
        nullable=True
    )

    suggestions = Column(
        Text,
        nullable=True
    )