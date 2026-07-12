from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional

from environment.database import get_db
from environment.repositories.esg_repo import EsgGoalRepository
from environment.schemas.esg import EsgGoalResponse, PaginatedResponse
from environment.services.export_service import ExportService

router = APIRouter(prefix="/environment/environmental-goals", tags=["Employee - Environmental Goals"])

@router.get("", response_model=PaginatedResponse[EsgGoalResponse])
def get_goals(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    category: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    repo = EsgGoalRepository(db)
    items, total = repo.get_goals(skip=skip, limit=limit, category=category, status=status)
    return PaginatedResponse(items=items, total=total, page=skip//limit + 1, size=len(items))

@router.get("/export/csv")
def export_csv(db: Session = Depends(get_db)):
    repo = EsgGoalRepository(db)
    items, _ = repo.get_goals(limit=1000)
    return ExportService.export_to_csv(items, "environmental_goals.csv")

@router.get("/export/excel")
def export_excel(db: Session = Depends(get_db)):
    repo = EsgGoalRepository(db)
    items, _ = repo.get_goals(limit=1000)
    return ExportService.export_to_excel(items, "environmental_goals.xlsx")

@router.get("/export/pdf")
def export_pdf(db: Session = Depends(get_db)):
    repo = EsgGoalRepository(db)
    items, _ = repo.get_goals(limit=1000)
    return ExportService.export_to_pdf(items, "environmental_goals.pdf")

@router.get("/{goal_id}", response_model=EsgGoalResponse)
def get_goal(goal_id: UUID, db: Session = Depends(get_db)):
    repo = EsgGoalRepository(db)
    goal = repo.get_goal(goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    return goal
