from sqlalchemy.orm import Session
from fastapi import HTTPException
import uuid
from uuid import UUID

from app.models.policy import Policy
from app.schemas.policy import PolicyCreate, PolicyUpdate

from app.models.governance import PolicyAcknowledgement, Audit, AuditFinding, ComplianceCheck
from app.schemas.governance import (
    PolicyAcknowledgementCreate, PolicyAcknowledgementUpdate,
    AuditCreate, AuditUpdate,
    AuditFindingCreate, AuditFindingUpdate,
    ComplianceCheckCreate, ComplianceCheckUpdate
)

# Function which will create a new policy
def create_policy(db: Session, policy: PolicyCreate):

    new_policy = Policy(
        policy_id=uuid.uuid4(),
        organization_id=policy.organization_id,
        policy_name=policy.policy_name,
        category=policy.category,
        version=policy.version,
        effective_date=policy.effective_date,
        expiry_date=policy.expiry_date,
        owner=policy.owner,
        status=policy.status
    )

    db.add(new_policy)
    db.commit()
    db.refresh(new_policy)

    return new_policy


# This function lists all the policies from the database
def get_all_policies(db: Session):
    return db.query(Policy).all()


# Each policy will have a id which will be used to get the policy by this function
def get_policy_by_id(
    db: Session,
    policy_id: UUID
):

    policy = (
        db.query(Policy)
        .filter(Policy.policy_id == policy_id)
        .first()
    )

    if not policy:
        raise HTTPException(
            status_code=404,
            detail="Policy not found"
        )

    return policy


# Each policy will have a id which will be used to update the policy by this function
def update_policy(
    db: Session,
    policy_id: UUID,
    updated_policy: PolicyUpdate
):

    policy = (
        db.query(Policy)
        .filter(Policy.policy_id == policy_id)
        .first()
    )

    if not policy:
        raise HTTPException(
            status_code=404,
            detail="Policy not found"
        )

    update_data = updated_policy.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(policy, key, value)

    db.commit()
    db.refresh(policy)

    return policy

# This function is used to delete a policy by id 
def delete_policy(
    db: Session,
    policy_id: UUID
):

    policy = (
        db.query(Policy)
        .filter(Policy.policy_id == policy_id)
        .first()
    )

    if not policy:
        raise HTTPException(
            status_code=404,
            detail="Policy not found"
        )

    db.delete(policy)
    db.commit()

    return {
        "message": "Policy deleted successfully"
    }

# --- Acknowledgements ---

def create_acknowledgement(db: Session, ack: PolicyAcknowledgementCreate):
    new_ack = PolicyAcknowledgement(
        acknowledgement_id=uuid.uuid4(),
        policy_id=ack.policy_id,
        user_id=ack.user_id,
        acknowledged_at=ack.acknowledged_at,
        status=ack.status
    )
    db.add(new_ack)
    db.commit()
    db.refresh(new_ack)
    return new_ack

def get_acknowledgements(db: Session, policy_id: UUID = None):
    query = db.query(PolicyAcknowledgement)
    if policy_id:
        query = query.filter(PolicyAcknowledgement.policy_id == policy_id)
    return query.all()

def update_acknowledgement(db: Session, policy_id: UUID, user_id: UUID, updated_ack: PolicyAcknowledgementUpdate):
    ack = db.query(PolicyAcknowledgement).filter(PolicyAcknowledgement.policy_id == policy_id, PolicyAcknowledgement.user_id == user_id).first()
    if not ack:
        raise HTTPException(status_code=404, detail="Acknowledgement not found")
    
    update_data = updated_ack.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(ack, key, value)
    
    db.commit()
    db.refresh(ack)
    return ack

# --- Audits ---

def create_audit(db: Session, audit: AuditCreate):
    new_audit = Audit(
        audit_id=uuid.uuid4(),
        audit_name=audit.audit_name,
        audit_type=audit.audit_type,
        auditor=audit.auditor,
        scheduled_date=audit.scheduled_date,
        status=audit.status
    )
    db.add(new_audit)
    db.commit()
    db.refresh(new_audit)
    return new_audit

def get_all_audits(db: Session):
    return db.query(Audit).all()

def get_audit_by_id(db: Session, audit_id: UUID):
    audit = db.query(Audit).filter(Audit.audit_id == audit_id).first()
    if not audit:
        raise HTTPException(status_code=404, detail="Audit not found")
    return audit

def update_audit(db: Session, audit_id: UUID, updated_audit: AuditUpdate):
    audit = get_audit_by_id(db, audit_id)
    update_data = updated_audit.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(audit, key, value)
    db.commit()
    db.refresh(audit)
    return audit

def delete_audit(db: Session, audit_id: UUID):
    audit = get_audit_by_id(db, audit_id)
    db.delete(audit)
    db.commit()
    return {"message": "Audit deleted successfully"}

# --- Audit Findings ---

def create_audit_finding(db: Session, audit_id: UUID, finding: AuditFindingCreate):
    new_finding = AuditFinding(
        finding_id=uuid.uuid4(),
        audit_id=audit_id,
        severity=finding.severity,
        description=finding.description,
        status=finding.status
    )
    db.add(new_finding)
    db.commit()
    db.refresh(new_finding)
    return new_finding

def get_audit_findings(db: Session, audit_id: UUID):
    return db.query(AuditFinding).filter(AuditFinding.audit_id == audit_id).all()

def update_audit_finding(db: Session, finding_id: UUID, updated_finding: AuditFindingUpdate):
    finding = db.query(AuditFinding).filter(AuditFinding.finding_id == finding_id).first()
    if not finding:
        raise HTTPException(status_code=404, detail="Finding not found")
    update_data = updated_finding.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(finding, key, value)
    db.commit()
    db.refresh(finding)
    return finding

def delete_audit_finding(db: Session, finding_id: UUID):
    finding = db.query(AuditFinding).filter(AuditFinding.finding_id == finding_id).first()
    if not finding:
        raise HTTPException(status_code=404, detail="Finding not found")
    db.delete(finding)
    db.commit()
    return {"message": "Finding deleted successfully"}

# --- Compliance Checks ---

def create_compliance_check(db: Session, check: ComplianceCheckCreate):
    new_check = ComplianceCheck(
        check_id=uuid.uuid4(),
        department=check.department,
        policy_id=check.policy_id,
        compliance_percent=check.compliance_percent,
        checked_on=check.checked_on,
        remarks=check.remarks
    )
    db.add(new_check)
    db.commit()
    db.refresh(new_check)
    return new_check

def get_all_compliance_checks(db: Session):
    return db.query(ComplianceCheck).all()

def get_compliance_check_by_id(db: Session, check_id: UUID):
    check = db.query(ComplianceCheck).filter(ComplianceCheck.check_id == check_id).first()
    if not check:
        raise HTTPException(status_code=404, detail="Compliance Check not found")
    return check

def update_compliance_check(db: Session, check_id: UUID, updated_check: ComplianceCheckUpdate):
    check = get_compliance_check_by_id(db, check_id)
    update_data = updated_check.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(check, key, value)
    db.commit()
    db.refresh(check)
    return check

def delete_compliance_check(db: Session, check_id: UUID):
    check = get_compliance_check_by_id(db, check_id)
    db.delete(check)
    db.commit()
    return {"message": "Compliance Check deleted successfully"}