from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from environment.database import get_db
from environment.repositories.esg_repo import EsgScoreRepository
from environment.schemas.esg import EsgScoreCreate, EsgScoreUpdate, EsgScoreResponse

router = APIRouter(prefix="/environment/product-esg", tags=["Admin - Product ESG Profiles"])

@router.post("", response_model=EsgScoreResponse)
def create_profile(profile: EsgScoreCreate, db: Session = Depends(get_db)):
    repo = EsgScoreRepository(db)
    return repo.create_score(profile)

@router.put("/{profile_id}", response_model=EsgScoreResponse)
def update_profile(profile_id: UUID, profile: EsgScoreUpdate, db: Session = Depends(get_db)):
    repo = EsgScoreRepository(db)
    updated = repo.update_score(profile_id, profile)
    if not updated:
        raise HTTPException(status_code=404, detail="Profile not found")
    return updated

@router.delete("/{profile_id}")
def delete_profile(profile_id: UUID, db: Session = Depends(get_db)):
    repo = EsgScoreRepository(db)
    if not repo.delete_score(profile_id):
        raise HTTPException(status_code=404, detail="Profile not found")
    return {"detail": "Profile deleted successfully"}
