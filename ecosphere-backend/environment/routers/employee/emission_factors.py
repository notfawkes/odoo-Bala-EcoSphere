from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional

from environment.database import get_db
from environment.repositories.carbon_repo import CarbonEmissionRepository
from environment.schemas.carbon import CarbonEmissionResponse
from environment.schemas.esg import PaginatedResponse

router = APIRouter(prefix="/environment/emission-factors", tags=["Employee - Emission Factors"])

@router.get("", response_model=PaginatedResponse[CarbonEmissionResponse])
def get_factors(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    department: Optional[str] = None,
    emission_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    repo = CarbonEmissionRepository(db)
    items, total = repo.get_emissions(skip=skip, limit=limit, department=department, emission_type=emission_type)
    return PaginatedResponse(items=items, total=total, page=skip//limit + 1, size=len(items))

@router.get("/{factor_id}", response_model=CarbonEmissionResponse)
def get_factor(factor_id: UUID, db: Session = Depends(get_db)):
    repo = CarbonEmissionRepository(db)
    factor = repo.get_emission(factor_id)
    if not factor:
        raise HTTPException(status_code=404, detail="Emission factor not found")
    return factor
