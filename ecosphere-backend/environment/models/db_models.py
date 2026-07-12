from sqlalchemy import Column, String, Numeric, Date, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid
from .base import Base

class Organization(Base):
    __tablename__ = "organizations"
    organization_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    # Only defining necessary fields to satisfy foreign keys if needed

class User(Base):
    __tablename__ = "users"
    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.organization_id"))
    email = Column(String(255), unique=True)
    # Only defining necessary fields

class EsgGoals(Base):
    __tablename__ = "esg_goals"
    goal_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.organization_id"))
    category = Column(String(30))
    title = Column(String(255))
    target_value = Column(Numeric)
    current_value = Column(Numeric)
    unit = Column(String(30))
    deadline = Column(Date)
    status = Column(String(30))

class EsgScores(Base):
    __tablename__ = "esg_scores"
    score_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.organization_id"))
    environmental_score = Column(Numeric(5, 2))
    social_score = Column(Numeric(5, 2))
    governance_score = Column(Numeric(5, 2))
    overall_score = Column(Numeric(5, 2))
    calculated_on = Column(Date)

class CarbonEmissions(Base):
    __tablename__ = "carbon_emissions"
    emission_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.organization_id"))
    facility = Column(String(255))
    department = Column(String(100))
    emission_source = Column(String(150))
    emission_type = Column(String(100))
    quantity = Column(Numeric)
    unit = Column(String(20))
    reporting_month = Column(Date)
    verified = Column(Boolean)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.user_id"))

class EmissionReductions(Base):
    __tablename__ = "emission_reductions"
    reduction_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    emission_id = Column(UUID(as_uuid=True), ForeignKey("carbon_emissions.emission_id"))
    reduction_amount = Column(Numeric)
    description = Column(String)
    completed_on = Column(Date)
    verified = Column(Boolean)
