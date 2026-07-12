from sqlalchemy import Column, String, Date, Numeric, Text
from sqlalchemy.dialects.postgresql import UUID
import uuid
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class CSRProject(Base):
    __tablename__ = "csr_projects"

    project_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), nullable=True)
    title = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    budget = Column(Numeric, nullable=True)
    location = Column(String(255), nullable=True)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    status = Column(String(50), nullable=True)
    image_url = Column(Text, nullable=True)
