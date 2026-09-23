from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.job_role import JobRole
from app.schemas.job_role import JobRoleCreate, JobRoleResponse


router = APIRouter(
    prefix="/job-roles",
    tags=["Job Roles"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=JobRoleResponse)
def create_job_role(
    job_role: JobRoleCreate,
    db: Session = Depends(get_db)
):
    new_job_role = JobRole(
        title=job_role.title,
        description=job_role.description
    )

    db.add(new_job_role)
    db.commit()
    db.refresh(new_job_role)

    return new_job_role