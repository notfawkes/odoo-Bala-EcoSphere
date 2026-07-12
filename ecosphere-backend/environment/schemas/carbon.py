from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import date
from decimal import Decimal

# Carbon Emissions Schemas (For Emission Factors proxy)
class CarbonEmissionBase(BaseModel):
    organization_id: UUID
    facility: Optional[str] = None
    department: Optional[str] = None
    emission_source: Optional[str] = None
    emission_type: Optional[str] = None
    quantity: Optional[Decimal] = None
    unit: Optional[str] = None
    reporting_month: Optional[date] = None
    verified: Optional[bool] = None
    created_by: Optional[UUID] = None

class CarbonEmissionCreate(CarbonEmissionBase):
    pass

class CarbonEmissionUpdate(BaseModel):
    facility: Optional[str] = None
    department: Optional[str] = None
    emission_source: Optional[str] = None
    emission_type: Optional[str] = None
    quantity: Optional[Decimal] = None
    unit: Optional[str] = None
    reporting_month: Optional[date] = None
    verified: Optional[bool] = None

class CarbonEmissionResponse(CarbonEmissionBase):
    emission_id: UUID
    class Config:
        from_attributes = True

# Emission Reductions Schemas (For Carbon Transactions proxy)
class EmissionReductionBase(BaseModel):
    emission_id: Optional[UUID] = None
    reduction_amount: Optional[Decimal] = None
    description: Optional[str] = None
    completed_on: Optional[date] = None
    verified: Optional[bool] = None

class EmissionReductionCreate(EmissionReductionBase):
    pass

class EmissionReductionUpdate(BaseModel):
    reduction_amount: Optional[Decimal] = None
    description: Optional[str] = None
    completed_on: Optional[date] = None
    verified: Optional[bool] = None

class EmissionReductionResponse(EmissionReductionBase):
    reduction_id: UUID
    class Config:
        from_attributes = True
