from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from environment.database import get_db
from environment.repositories.carbon_repo import CarbonEmissionRepository
from environment.schemas.carbon import CarbonEmissionCreate, CarbonEmissionUpdate, CarbonEmissionResponse

router = APIRouter(prefix="/environment/emission-factors", tags=["Admin - Emission Factors"])

@router.post("", response_model=CarbonEmissionResponse)
def create_factor(factor: CarbonEmissionCreate, db: Session = Depends(get_db)):
    repo = CarbonEmissionRepository(db)
    return repo.create_emission(factor)

@router.put("/{factor_id}", response_model=CarbonEmissionResponse)
def update_factor(factor_id: UUID, factor: CarbonEmissionUpdate, db: Session = Depends(get_db)):
    repo = CarbonEmissionRepository(db)
    updated = repo.update_emission(factor_id, factor)
    if not updated:
        raise HTTPException(status_code=404, detail="Emission factor not found")
    return updated

@router.delete("/{factor_id}")
def delete_factor(factor_id: UUID, db: Session = Depends(get_db)):
    repo = CarbonEmissionRepository(db)
    if not repo.delete_emission(factor_id):
        raise HTTPException(status_code=404, detail="Emission factor not found")
    return {"detail": "Emission factor deleted successfully"}
