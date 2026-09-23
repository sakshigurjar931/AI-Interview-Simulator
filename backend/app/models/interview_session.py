from sqlalchemy import Column, Integer, ForeignKey, DateTime, String
from sqlalchemy.sql import func
from app.database.base import Base


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    job_role_id = Column(
        Integer,
        ForeignKey("job_roles.id"),
        nullable=False
    )

    started_at = Column(
        DateTime,
        server_default=func.now()
    )

    status = Column(
        String(20),
        default="started"
    )