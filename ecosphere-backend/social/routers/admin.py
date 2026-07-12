import os
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
import uuid
import cloudinary
import cloudinary.uploader
from ..database import get_db
from ..models.csr_project import CSRProject
from ..schemas.csr_project import CSRProjectResponse
from dotenv import load_dotenv

load_dotenv()

cl_url = os.getenv("CLOUDINARY_URL")
if cl_url:
    cloudinary.config(
        cloud_name=cl_url.split('@')[1] if '@' in cl_url else "dzhvomgq6",
        api_key=os.getenv("CLOUDINARY_API_KEY"),
        api_secret=os.getenv("CLOUDINARY_API_SECRET")
    )
else:
    cloudinary.config(
        cloud_name="dzhvomgq6",
        api_key=os.getenv("CLOUDINARY_API_KEY"),
        api_secret=os.getenv("CLOUDINARY_API_SECRET")
    )

router = APIRouter(prefix="/social", tags=["Admin Social"])

@router.post("/csr-projects", response_model=CSRProjectResponse)
def create_csr_project(
    title: str = Form(None),
    description: str = Form(None),
    budget: float = Form(None),
    location: str = Form(None),
    start_date: date = Form(None),
    end_date: date = Form(None),
    status: str = Form(None),
    organization_id: str = Form(None),
    file: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    image_url = None
    if file:
        try:
            result = cloudinary.uploader.upload(file.file)
            image_url = result.get("secure_url")
        except Exception as e:
            print(f"Error uploading image: {e}")
            raise HTTPException(status_code=500, detail="Failed to upload image")

    org_uuid = None
    if organization_id:
        try:
            org_uuid = uuid.UUID(organization_id)
        except ValueError:
            pass

    db_project = CSRProject(
        project_id=uuid.uuid4(),
        organization_id=org_uuid,
        title=title,
        description=description,
        budget=budget,
        location=location,
        start_date=start_date,
        end_date=end_date,
        status=status,
        image_url=image_url
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project
