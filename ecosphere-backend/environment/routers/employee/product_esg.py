from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional

from environment.database import get_db
from environment.repositories.esg_repo import EsgScoreRepository
from environment.schemas.esg import EsgScoreResponse, PaginatedResponse

router = APIRouter(prefix="/environment/product-esg", tags=["Employee - Product ESG Profiles"])

@router.get("", response_model=PaginatedResponse[EsgScoreResponse])
def get_profiles(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    repo = EsgScoreRepository(db)
    items, total = repo.get_scores(skip=skip, limit=limit)
    return PaginatedResponse(items=items, total=total, page=skip//limit + 1, size=len(items))

@router.get("/{profile_id}", response_model=EsgScoreResponse)
def get_profile(profile_id: UUID, db: Session = Depends(get_db)):
    repo = EsgScoreRepository(db)
    profile = repo.get_score(profile_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile
