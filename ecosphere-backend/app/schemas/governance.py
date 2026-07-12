from datetime import date, datetime
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, ConfigDict


# Acknowledgements
class PolicyAcknowledgementBase(BaseModel):
    policy_id: UUID
    user_id: UUID
    acknowledged_at: Optional[datetime] = None
    status: str = "Pending"

class PolicyAcknowledgementCreate(PolicyAcknowledgementBase):
    pass

class PolicyAcknowledgementUpdate(BaseModel):
    acknowledged_at: Optional[datetime] = None
    status: Optional[str] = None

class PolicyAcknowledgementResponse(PolicyAcknowledgementBase):
    acknowledgement_id: UUID
    model_config = ConfigDict(from_attributes=True)


# Audits
class AuditBase(BaseModel):
    audit_name: str
    audit_type: str
    auditor: str
    scheduled_date: date
    status: str = "Open"

class AuditCreate(AuditBase):
    pass

class AuditUpdate(BaseModel):
    audit_name: Optional[str] = None
    audit_type: Optional[str] = None
    auditor: Optional[str] = None
    scheduled_date: Optional[date] = None
    status: Optional[str] = None

class AuditResponse(AuditBase):
    audit_id: UUID
    model_config = ConfigDict(from_attributes=True)


# Audit Findings
class AuditFindingBase(BaseModel):
    audit_id: UUID
    severity: str
    description: str
    status: str = "Open"

class AuditFindingCreate(AuditFindingBase):
    pass

class AuditFindingUpdate(BaseModel):
    severity: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class AuditFindingResponse(AuditFindingBase):
    finding_id: UUID
    model_config = ConfigDict(from_attributes=True)


# Compliance Checks
class ComplianceCheckBase(BaseModel):
    department: str
    policy_id: UUID
    compliance_percent: int
    checked_on: date
    remarks: Optional[str] = None

class ComplianceCheckCreate(ComplianceCheckBase):
    pass

class ComplianceCheckUpdate(BaseModel):
    department: Optional[str] = None
    policy_id: Optional[UUID] = None
    compliance_percent: Optional[int] = None
    checked_on: Optional[date] = None
    remarks: Optional[str] = None

class ComplianceCheckResponse(ComplianceCheckBase):
    check_id: UUID
    model_config = ConfigDict(from_attributes=True)
