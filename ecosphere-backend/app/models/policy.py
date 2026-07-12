from sqlalchemy import Column, String, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import base as Base


class Policy(Base):
    __tablename__ = "policies"

    policy_id = Column(UUID(as_uuid=True), primary_key=True)

    organization_id = Column(
        UUID(as_uuid=True),
        ForeignKey("organizations.organization_id"),
        nullable=False
    )

    policy_name = Column(String(255), nullable=False)

    category = Column(String(100), nullable=False)

    version = Column(String(20), nullable=False)

    effective_date = Column(Date, nullable=False)

    expiry_date = Column(Date)

    owner = Column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id")
    )

    status = Column(String(50), nullable=False)