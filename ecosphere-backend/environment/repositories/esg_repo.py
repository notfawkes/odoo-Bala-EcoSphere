from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Optional
from environment.models.db_models import EsgGoals, EsgScores
from environment.schemas.esg import EsgGoalCreate, EsgGoalUpdate, EsgScoreCreate, EsgScoreUpdate

class EsgGoalRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_goals(self, skip: int = 0, limit: int = 10, **filters) -> tuple[List[EsgGoals], int]:
        query = self.db.query(EsgGoals)
        for key, value in filters.items():
            if value is not None:
                query = query.filter(getattr(EsgGoals, key) == value)
        
        total = query.count()
        items = query.offset(skip).limit(limit).all()
        return items, total

    def get_goal(self, goal_id: UUID) -> Optional[EsgGoals]:
        return self.db.query(EsgGoals).filter(EsgGoals.goal_id == goal_id).first()

    def create_goal(self, goal_data: EsgGoalCreate) -> EsgGoals:
        db_goal = EsgGoals(**goal_data.model_dump())
        self.db.add(db_goal)
        self.db.commit()
        self.db.refresh(db_goal)
        return db_goal

    def update_goal(self, goal_id: UUID, goal_data: EsgGoalUpdate) -> Optional[EsgGoals]:
        db_goal = self.get_goal(goal_id)
        if not db_goal:
            return None
        
        update_data = goal_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_goal, key, value)
            
        self.db.commit()
        self.db.refresh(db_goal)
        return db_goal

    def delete_goal(self, goal_id: UUID) -> bool:
        db_goal = self.get_goal(goal_id)
        if not db_goal:
            return False
        self.db.delete(db_goal)
        self.db.commit()
        return True


class EsgScoreRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_scores(self, skip: int = 0, limit: int = 10, **filters) -> tuple[List[EsgScores], int]:
        query = self.db.query(EsgScores)
        for key, value in filters.items():
            if value is not None:
                query = query.filter(getattr(EsgScores, key) == value)
                
        total = query.count()
        items = query.offset(skip).limit(limit).all()
        return items, total

    def get_score(self, score_id: UUID) -> Optional[EsgScores]:
        return self.db.query(EsgScores).filter(EsgScores.score_id == score_id).first()

    def create_score(self, score_data: EsgScoreCreate) -> EsgScores:
        db_score = EsgScores(**score_data.model_dump())
        self.db.add(db_score)
        self.db.commit()
        self.db.refresh(db_score)
        return db_score

    def update_score(self, score_id: UUID, score_data: EsgScoreUpdate) -> Optional[EsgScores]:
        db_score = self.get_score(score_id)
        if not db_score:
            return None
        
        update_data = score_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_score, key, value)
            
        self.db.commit()
        self.db.refresh(db_score)
        return db_score

    def delete_score(self, score_id: UUID) -> bool:
        db_score = self.get_score(score_id)
        if not db_score:
            return False
        self.db.delete(db_score)
        self.db.commit()
        return True
