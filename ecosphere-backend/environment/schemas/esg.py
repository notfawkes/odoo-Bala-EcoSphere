from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import date
from decimal import Decimal

# Shared pagination response schema
from typing import Generic, TypeVar, List
T = TypeVar('T')
class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    size: int

# ESG Goals Schemas
class EsgGoalBase(BaseModel):
    organization_id: UUID
    category: str
    title: str
    target_value: Decimal
    current_value: Decimal
    unit: str
    deadline: date
    status: str

class EsgGoalCreate(EsgGoalBase):
    pass

class EsgGoalUpdate(BaseModel):
    category: Optional[str] = None
    title: Optional[str] = None
    target_value: Optional[Decimal] = None
    current_value: Optional[Decimal] = None
    unit: Optional[str] = None
    deadline: Optional[date] = None
    status: Optional[str] = None

class EsgGoalResponse(EsgGoalBase):
    goal_id: UUID
    class Config:
        from_attributes = True

# ESG Scores Schemas (For Product ESG proxy)
class EsgScoreBase(BaseModel):
    organization_id: UUID
    environmental_score: Decimal
    social_score: Decimal
    governance_score: Decimal
    overall_score: Decimal
    calculated_on: date

class EsgScoreCreate(EsgScoreBase):
    pass

class EsgScoreUpdate(BaseModel):
    environmental_score: Optional[Decimal] = None
    social_score: Optional[Decimal] = None
    governance_score: Optional[Decimal] = None
    overall_score: Optional[Decimal] = None
    calculated_on: Optional[date] = None

class EsgScoreResponse(EsgScoreBase):
    score_id: UUID
    class Config:
        from_attributes = True
