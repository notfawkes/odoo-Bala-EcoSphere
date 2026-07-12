from sqlalchemy import Column, String, Date, DateTime, Integer, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import base as Base
import uuid

class PolicyAcknowledgement(Base):
    __tablename__ = "policy_acknowledgements"

    acknowledgement_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    policy_id = Column(UUID(as_uuid=True), ForeignKey("policies.policy_id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), nullable=False) 
    acknowledged_at = Column(DateTime, nullable=True)
    status = Column(String(50), nullable=False, default="Pending")


class Audit(Base):
    __tablename__ = "audits"

    audit_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    audit_name = Column(String(255), nullable=False)
    audit_type = Column(String(100), nullable=False)
    auditor = Column(String(255), nullable=False)
    scheduled_date = Column(Date, nullable=False)
    status = Column(String(50), nullable=False, default="Open")


class AuditFinding(Base):
    __tablename__ = "audit_findings"

    finding_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    audit_id = Column(UUID(as_uuid=True), ForeignKey("audits.audit_id"), nullable=False)
    severity = Column(String(50), nullable=False)
    description = Column(String, nullable=False)
    status = Column(String(50), nullable=False, default="Open")


class ComplianceCheck(Base):
    __tablename__ = "compliance_checks"

    check_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    department = Column(String(100), nullable=False)
    policy_id = Column(UUID(as_uuid=True), ForeignKey("policies.policy_id"), nullable=False)
    compliance_percent = Column(Integer, nullable=False)
    checked_on = Column(Date, nullable=False)
    remarks = Column(String, nullable=True)
