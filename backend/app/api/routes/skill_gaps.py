from fastapi import APIRouter, Depends
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


@router.post("/", response_model=SkillGapResponse)
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