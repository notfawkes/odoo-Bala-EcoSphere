from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from uuid import UUID

class CSRProjectBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    budget: Optional[float] = None
    location: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[str] = None

class CSRProjectCreate(CSRProjectBase):
    organization_id: Optional[UUID] = None

class CSRProjectResponse(CSRProjectBase):
    project_id: UUID
    organization_id: Optional[UUID] = None
    image_url: Optional[str] = None

    class Config:
        from_attributes = True

class PaginatedCSRProjects(BaseModel):
    items: List[CSRProjectResponse]
    total: int
    page: int
    size: int
