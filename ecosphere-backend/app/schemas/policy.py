from datetime import date
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, ConfigDict


class PolicyBase(BaseModel):
    policy_name: str
    category: str
    version: str
    effective_date: date
    expiry_date: Optional[date] = None
    owner: UUID
    status: str


class PolicyCreate(PolicyBase):
    organization_id: UUID


class PolicyUpdate(BaseModel):
    policy_name: Optional[str] = None
    category: Optional[str] = None
    version: Optional[str] = None
    effective_date: Optional[date] = None
    expiry_date: Optional[date] = None
    owner: Optional[UUID] = None
    status: Optional[str] = None


class PolicyResponse(PolicyBase):
    policy_id: UUID
    organization_id: UUID

    model_config = ConfigDict(from_attributes=True)