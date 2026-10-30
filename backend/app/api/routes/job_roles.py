from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.job_role import JobRole
from app.schemas.job_role import JobRoleCreate, JobRoleResponse


router = APIRouter(
    prefix="/job-roles",
    tags=["Job Roles"]
)

DEFAULT_ROLES = [
    {
        "title": "Software Engineer",
        "description": "Data structures, algorithms, system design and core CS fundamentals."
    },
    {
        "title": "Frontend Developer",
        "description": "HTML, CSS, JavaScript, React and modern UI engineering."
    },
    {
        "title": "Backend Developer",
        "description": "APIs, databases, server architecture and backend scalability."
    },
    {
        "title": "Data Analyst",
        "description": "SQL, data wrangling, visualization and analytical thinking."
    },
    {
        "title": "Data Scientist",
        "description": "Machine learning, statistics, Python and model evaluation."
    },
    {
        "title": "Machine Learning Engineer",
        "description": "Model deployment, MLOps, deep learning and production systems."
    },
    {
        "title": "Cybersecurity Analyst",
        "description": "Threat analysis, network security and incident response."
    },
    {
        "title": "DevOps Engineer",
        "description": "CI/CD, containers, cloud infrastructure and automation."
    }
]


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def seed_job_roles_if_empty(db: Session):
    count = db.query(JobRole).count()
    if count == 0:
        for r in DEFAULT_ROLES:
            db.add(JobRole(title=r["title"], description=r["description"]))
        db.commit()


@router.get("/", response_model=List[JobRoleResponse])
def get_job_roles(db: Session = Depends(get_db)):
    seed_job_roles_if_empty(db)
    return db.query(JobRole).order_by(JobRole.id).all()


@router.get("/{role_id}", response_model=JobRoleResponse)
def get_job_role(role_id: int, db: Session = Depends(get_db)):
    role = db.query(JobRole).filter(JobRole.id == role_id).first()
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job role not found."
        )
    return role


@router.post("/", response_model=JobRoleResponse, status_code=status.HTTP_201_CREATED)
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
