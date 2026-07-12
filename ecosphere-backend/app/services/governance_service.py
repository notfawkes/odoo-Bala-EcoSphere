from sqlalchemy.orm import Session
from fastapi import HTTPException
import uuid
from uuid import UUID

from app.models.policy import Policy
from app.schemas.policy import PolicyCreate, PolicyUpdate


#Function which will create a new policy
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