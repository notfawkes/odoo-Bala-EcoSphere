from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional

from environment.database import get_db
from environment.repositories.esg_repo import EsgGoalRepository
from environment.schemas.esg import EsgGoalCreate, EsgGoalUpdate, EsgGoalResponse

router = APIRouter(prefix="/environment/environmental-goals", tags=["Admin - Environmental Goals"])

@router.post("", response_model=EsgGoalResponse)
def create_goal(goal: EsgGoalCreate, db: Session = Depends(get_db)):
    repo = EsgGoalRepository(db)
    return repo.create_goal(goal)

@router.put("/{goal_id}", response_model=EsgGoalResponse)
def update_goal(goal_id: UUID, goal: EsgGoalUpdate, db: Session = Depends(get_db)):
    repo = EsgGoalRepository(db)
    updated_goal = repo.update_goal(goal_id, goal)
    if not updated_goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    return updated_goal

@router.delete("/{goal_id}")
def delete_goal(goal_id: UUID, db: Session = Depends(get_db)):
    repo = EsgGoalRepository(db)
    if not repo.delete_goal(goal_id):
        raise HTTPException(status_code=404, detail="Goal not found")
    return {"detail": "Goal deleted successfully"}
