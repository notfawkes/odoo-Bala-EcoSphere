from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.csr_project import CSRProject
from ..schemas.csr_project import PaginatedCSRProjects

router = APIRouter(prefix="/social", tags=["Employee Social"])

@router.get("/csr-projects", response_model=PaginatedCSRProjects)
def get_csr_projects(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    offset = (page - 1) * size
    query = db.query(CSRProject)
    total = query.count()
    items = query.offset(offset).limit(size).all()
    
    return {
        "items": items,
        "total": total,
        "page": page,
        "size": size
    }
