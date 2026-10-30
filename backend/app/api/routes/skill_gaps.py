from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.skill_gap import SkillGap
from app.schemas.skill_gap import (
    SkillGapCreate,
    SkillGapResponse
)


router = APIRouter(
    prefix="/skill-gaps",
    tags=["Skill Gaps"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=SkillGapResponse, status_code=status.HTTP_201_CREATED)
def create_skill_gap(
    skill_gap: SkillGapCreate,
    db: Session = Depends(get_db)
):
    new_skill_gap = SkillGap(
        session_id=skill_gap.session_id,
        missing_skills=skill_gap.missing_skills,
        recommended_skills=skill_gap.recommended_skills,
        learning_resources=skill_gap.learning_resources
    )

    db.add(new_skill_gap)
    db.commit()
    db.refresh(new_skill_gap)

    return new_skill_gap


@router.get("/session/{session_id}", response_model=List[SkillGapResponse])
def get_session_skill_gaps(session_id: int, db: Session = Depends(get_db)):
    gaps = db.query(SkillGap).filter(
        SkillGap.session_id == session_id
    ).order_by(SkillGap.id.desc()).all()
    return gaps
