from uuid import UUID
from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db

from app.schemas.policy import (
    PolicyCreate,
    PolicyUpdate,
    PolicyResponse
)

from app.schemas.governance import (
    PolicyAcknowledgementCreate, PolicyAcknowledgementUpdate, PolicyAcknowledgementResponse,
    AuditCreate, AuditUpdate, AuditResponse,
    AuditFindingCreate, AuditFindingUpdate, AuditFindingResponse,
    ComplianceCheckCreate, ComplianceCheckUpdate, ComplianceCheckResponse
)

from app.services import governance_service 

router = APIRouter(
    prefix="/governance",
    tags=["Governance"]
)

# --- Policies ---

@router.post("/policies", response_model=PolicyResponse)
def create_policy(policy: PolicyCreate, db: Session = Depends(get_db)):
    return governance_service.create_policy(db, policy)

@router.get("/policies", response_model=list[PolicyResponse])
def get_all_policies(db: Session = Depends(get_db)):
    return governance_service.get_all_policies(db)

@router.get("/policies/{policy_id}", response_model=PolicyResponse)
def get_policy(policy_id: UUID, db: Session = Depends(get_db)):
    return governance_service.get_policy_by_id(db, policy_id)

@router.patch("/policies/{policy_id}", response_model=PolicyResponse)
def update_policy(policy_id: UUID, policy: PolicyUpdate, db: Session = Depends(get_db)):
    return governance_service.update_policy(db, policy_id, policy)

@router.delete("/policies/{policy_id}")
def delete_policy(policy_id: UUID, db: Session = Depends(get_db)):
    return governance_service.delete_policy(db, policy_id)


# --- Acknowledgements ---

@router.post("/policies/{policy_id}/acknowledgements", response_model=PolicyAcknowledgementResponse)
def create_acknowledgement(policy_id: UUID, ack: PolicyAcknowledgementCreate, db: Session = Depends(get_db)):
    if ack.policy_id != policy_id:
        ack.policy_id = policy_id
    return governance_service.create_acknowledgement(db, ack)

@router.get("/policies/{policy_id}/acknowledgements", response_model=List[PolicyAcknowledgementResponse])
def get_acknowledgements_for_policy(policy_id: UUID, db: Session = Depends(get_db)):
    return governance_service.get_acknowledgements(db, policy_id)

@router.patch("/policies/{policy_id}/acknowledgements/{user_id}", response_model=PolicyAcknowledgementResponse)
def update_acknowledgement(policy_id: UUID, user_id: UUID, ack: PolicyAcknowledgementUpdate, db: Session = Depends(get_db)):
    return governance_service.update_acknowledgement(db, policy_id, user_id, ack)

@router.get("/acknowledgements", response_model=List[PolicyAcknowledgementResponse])
def get_all_acknowledgements(db: Session = Depends(get_db)):
    return governance_service.get_acknowledgements(db)


# --- Audits ---

@router.post("/audits", response_model=AuditResponse)
def create_audit(audit: AuditCreate, db: Session = Depends(get_db)):
    return governance_service.create_audit(db, audit)

@router.get("/audits", response_model=List[AuditResponse])
def get_all_audits(db: Session = Depends(get_db)):
    return governance_service.get_all_audits(db)

@router.get("/audits/{audit_id}", response_model=AuditResponse)
def get_audit(audit_id: UUID, db: Session = Depends(get_db)):
    return governance_service.get_audit_by_id(db, audit_id)

@router.patch("/audits/{audit_id}", response_model=AuditResponse)
def update_audit(audit_id: UUID, audit: AuditUpdate, db: Session = Depends(get_db)):
    return governance_service.update_audit(db, audit_id, audit)

@router.delete("/audits/{audit_id}")
def delete_audit(audit_id: UUID, db: Session = Depends(get_db)):
    return governance_service.delete_audit(db, audit_id)


# --- Audit Findings ---

@router.post("/audits/{audit_id}/findings", response_model=AuditFindingResponse)
def create_audit_finding(audit_id: UUID, finding: AuditFindingCreate, db: Session = Depends(get_db)):
    if finding.audit_id != audit_id:
        finding.audit_id = audit_id
    return governance_service.create_audit_finding(db, audit_id, finding)

@router.get("/audits/{audit_id}/findings", response_model=List[AuditFindingResponse])
def get_audit_findings(audit_id: UUID, db: Session = Depends(get_db)):
    return governance_service.get_audit_findings(db, audit_id)

@router.patch("/findings/{finding_id}", response_model=AuditFindingResponse)
def update_audit_finding(finding_id: UUID, finding: AuditFindingUpdate, db: Session = Depends(get_db)):
    return governance_service.update_audit_finding(db, finding_id, finding)

@router.delete("/findings/{finding_id}")
def delete_audit_finding(finding_id: UUID, db: Session = Depends(get_db)):
    return governance_service.delete_audit_finding(db, finding_id)


# --- Compliance Issues ---

@router.post("/compliance", response_model=ComplianceCheckResponse)
def create_compliance_check(check: ComplianceCheckCreate, db: Session = Depends(get_db)):
    return governance_service.create_compliance_check(db, check)

@router.get("/compliance", response_model=List[ComplianceCheckResponse])
def get_all_compliance_checks(db: Session = Depends(get_db)):
    return governance_service.get_all_compliance_checks(db)

@router.get("/compliance/{check_id}", response_model=ComplianceCheckResponse)
def get_compliance_check(check_id: UUID, db: Session = Depends(get_db)):
    return governance_service.get_compliance_check_by_id(db, check_id)

@router.patch("/compliance/{check_id}", response_model=ComplianceCheckResponse)
def update_compliance_check(check_id: UUID, check: ComplianceCheckUpdate, db: Session = Depends(get_db)):
    return governance_service.update_compliance_check(db, check_id, check)

@router.delete("/compliance/{check_id}")
def delete_compliance_check(check_id: UUID, db: Session = Depends(get_db)):
    return governance_service.delete_compliance_check(db, check_id)