from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db

from app.schemas.policy import (
    PolicyCreate,
    PolicyUpdate,
    PolicyResponse
)

from app.services import governance_service 

router = APIRouter(
    prefix="/governance",
    tags=["Governance"]
)


# router for creating policies
@router.post(
    "/policies",
    response_model=PolicyResponse
)
def create_policy(
    policy: PolicyCreate,
    db: Session = Depends(get_db)
):
    return governance_service.create_policy(
        db,
        policy
    )


# router for getting all policies
@router.get(
    "/policies",
    response_model=list[PolicyResponse]
)
def get_all_policies(
    db: Session = Depends(get_db)
):
    return governance_service.get_all_policies(db)


# get policy by id
@router.get(
    "/policies/{policy_id}",
    response_model=PolicyResponse
)
def get_policy(
    policy_id: UUID,
    db: Session = Depends(get_db)
):
    return governance_service.get_policy_by_id(
        db,
        policy_id
    )


# update a single policy
@router.patch(
    "/policies/{policy_id}",
    response_model=PolicyResponse
)
def update_policy(
    policy_id: UUID,
    policy: PolicyUpdate,
    db: Session = Depends(get_db)
):
    return governance_service.update_policy(
        db,
        policy_id,
        policy
    )


# delete a single policy
@router.delete(
    "/policies/{policy_id}"
)
def delete_policy(
    policy_id: UUID,
    db: Session = Depends(get_db)
):
    return governance_service.delete_policy(
        db,
        policy_id
    )