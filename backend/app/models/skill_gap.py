from sqlalchemy import Column, Integer, ForeignKey, Text
from app.database.base import Base


class SkillGap(Base):
    __tablename__ = "skill_gaps"

    id = Column(Integer, primary_key=True, index=True)

    session_id = Column(
        Integer,
        ForeignKey("interview_sessions.id"),
        nullable=False
    )

    missing_skills = Column(
        Text,
        nullable=True
    )

    recommended_skills = Column(
        Text,
        nullable=True
    )

    learning_resources = Column(
        Text,
        nullable=True
    )