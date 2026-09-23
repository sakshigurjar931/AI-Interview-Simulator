from fastapi import FastAPI
from sqlalchemy import text

from app.database.base import Base
from app.database.connection import engine, SessionLocal

# Models
from app.models.user import User
from app.models.job_role import JobRole
from app.models.interview_session import InterviewSession
from app.models.interview_question import InterviewQuestion
from app.models.answer import Answer
from app.models.feedback_report import FeedbackReport
from app.models.skill_gap import SkillGap

# CRUD routers
from app.api.routes.users import router as users_router
from app.api.routes.job_roles import router as job_roles_router
from app.api.routes.interview_sessions import router as interview_sessions_router
from app.api.routes.questions import router as questions_router
from app.api.routes.answers import router as answers_router
from app.api.routes.feedback import router as feedback_router
from app.api.routes.skill_gaps import router as skill_gaps_router

# AI routers
from app.api.routes.ai_questions import router as ai_questions_router
from app.api.routes.ai_evaluation import router as ai_evaluation_router
from app.api.routes.ai_feedback import router as ai_feedback_router
from app.api.routes.ai_skill_gap import router as ai_skill_gap_router


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="AI Interview Simulator",
    description="Backend API for AI-powered interview simulation",
    version="1.0.0"
)


# --------------------------------------------------
# Root endpoint
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "AI Interview Simulator Backend is running"
    }


# --------------------------------------------------
# Database test endpoint
# --------------------------------------------------

@app.get("/db-test")
def database_test():
    db = SessionLocal()

    try:
        result = db.execute(text("SELECT current_database()"))
        database_name = result.scalar()

        return {
            "message": "Database connected successfully",
            "database": database_name,
            "host": "127.0.0.1",
            "port": 5432
        }

    finally:
        db.close()


# --------------------------------------------------
# CRUD Routers
# --------------------------------------------------

app.include_router(users_router)
app.include_router(job_roles_router)
app.include_router(interview_sessions_router)
app.include_router(questions_router)
app.include_router(answers_router)
app.include_router(feedback_router)
app.include_router(skill_gaps_router)


# --------------------------------------------------
# AI Routers
# --------------------------------------------------

app.include_router(ai_questions_router)
app.include_router(ai_evaluation_router)
app.include_router(ai_feedback_router)
app.include_router(ai_skill_gap_router)