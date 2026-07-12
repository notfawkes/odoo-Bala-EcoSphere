from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from environment.database import get_db
from environment.repositories.carbon_repo import EmissionReductionRepository
from environment.schemas.carbon import EmissionReductionCreate, EmissionReductionUpdate, EmissionReductionResponse

router = APIRouter(prefix="/environment/carbon-transactions", tags=["Admin - Carbon Transactions"])

@router.post("", response_model=EmissionReductionResponse)
def create_transaction(transaction: EmissionReductionCreate, db: Session = Depends(get_db)):
    repo = EmissionReductionRepository(db)
    return repo.create_reduction(transaction)

@router.put("/{transaction_id}", response_model=EmissionReductionResponse)
def update_transaction(transaction_id: UUID, transaction: EmissionReductionUpdate, db: Session = Depends(get_db)):
    repo = EmissionReductionRepository(db)
    updated = repo.update_reduction(transaction_id, transaction)
    if not updated:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return updated

@router.delete("/{transaction_id}")
def delete_transaction(transaction_id: UUID, db: Session = Depends(get_db)):
    repo = EmissionReductionRepository(db)
    if not repo.delete_reduction(transaction_id):
        raise HTTPException(status_code=404, detail="Transaction not found")
    return {"detail": "Transaction deleted successfully"}
