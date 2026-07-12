from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional

from environment.database import get_db
from environment.repositories.carbon_repo import EmissionReductionRepository
from environment.schemas.carbon import EmissionReductionResponse
from environment.schemas.esg import PaginatedResponse
from environment.services.export_service import ExportService

router = APIRouter(prefix="/environment/carbon-transactions", tags=["Employee - Carbon Transactions"])

@router.get("", response_model=PaginatedResponse[EmissionReductionResponse])
def get_transactions(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    verified: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    repo = EmissionReductionRepository(db)
    items, total = repo.get_reductions(skip=skip, limit=limit, verified=verified)
    return PaginatedResponse(items=items, total=total, page=skip//limit + 1, size=len(items))

@router.get("/export/csv")
def export_csv(db: Session = Depends(get_db)):
    repo = EmissionReductionRepository(db)
    items, _ = repo.get_reductions(limit=1000)
    return ExportService.export_to_csv(items, "carbon_transactions.csv")

@router.get("/export/excel")
def export_excel(db: Session = Depends(get_db)):
    repo = EmissionReductionRepository(db)
    items, _ = repo.get_reductions(limit=1000)
    return ExportService.export_to_excel(items, "carbon_transactions.xlsx")

@router.get("/export/pdf")
def export_pdf(db: Session = Depends(get_db)):
    repo = EmissionReductionRepository(db)
    items, _ = repo.get_reductions(limit=1000)
    return ExportService.export_to_pdf(items, "carbon_transactions.pdf")

@router.get("/{transaction_id}", response_model=EmissionReductionResponse)
def get_transaction(transaction_id: UUID, db: Session = Depends(get_db)):
    repo = EmissionReductionRepository(db)
    transaction = repo.get_reduction(transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction
