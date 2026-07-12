from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Optional
from environment.models.db_models import CarbonEmissions, EmissionReductions
from environment.schemas.carbon import CarbonEmissionCreate, CarbonEmissionUpdate, EmissionReductionCreate, EmissionReductionUpdate

class CarbonEmissionRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_emissions(self, skip: int = 0, limit: int = 10, **filters) -> tuple[List[CarbonEmissions], int]:
        query = self.db.query(CarbonEmissions)
        for key, value in filters.items():
            if value is not None:
                query = query.filter(getattr(CarbonEmissions, key) == value)
                
        total = query.count()
        items = query.offset(skip).limit(limit).all()
        return items, total

    def get_emission(self, emission_id: UUID) -> Optional[CarbonEmissions]:
        return self.db.query(CarbonEmissions).filter(CarbonEmissions.emission_id == emission_id).first()

    def create_emission(self, emission_data: CarbonEmissionCreate) -> CarbonEmissions:
        db_emission = CarbonEmissions(**emission_data.model_dump())
        self.db.add(db_emission)
        self.db.commit()
        self.db.refresh(db_emission)
        return db_emission

    def update_emission(self, emission_id: UUID, emission_data: CarbonEmissionUpdate) -> Optional[CarbonEmissions]:
        db_emission = self.get_emission(emission_id)
        if not db_emission:
            return None
        
        update_data = emission_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_emission, key, value)
            
        self.db.commit()
        self.db.refresh(db_emission)
        return db_emission

    def delete_emission(self, emission_id: UUID) -> bool:
        db_emission = self.get_emission(emission_id)
        if not db_emission:
            return False
        self.db.delete(db_emission)
        self.db.commit()
        return True


class EmissionReductionRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_reductions(self, skip: int = 0, limit: int = 10, **filters) -> tuple[List[EmissionReductions], int]:
        query = self.db.query(EmissionReductions)
        for key, value in filters.items():
            if value is not None:
                query = query.filter(getattr(EmissionReductions, key) == value)
                
        total = query.count()
        items = query.offset(skip).limit(limit).all()
        return items, total

    def get_reduction(self, reduction_id: UUID) -> Optional[EmissionReductions]:
        return self.db.query(EmissionReductions).filter(EmissionReductions.reduction_id == reduction_id).first()

    def create_reduction(self, reduction_data: EmissionReductionCreate) -> EmissionReductions:
        db_reduction = EmissionReductions(**reduction_data.model_dump())
        self.db.add(db_reduction)
        self.db.commit()
        self.db.refresh(db_reduction)
        return db_reduction

    def update_reduction(self, reduction_id: UUID, reduction_data: EmissionReductionUpdate) -> Optional[EmissionReductions]:
        db_reduction = self.get_reduction(reduction_id)
        if not db_reduction:
            return None
        
        update_data = reduction_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_reduction, key, value)
            
        self.db.commit()
        self.db.refresh(db_reduction)
        return db_reduction

    def delete_reduction(self, reduction_id: UUID) -> bool:
        db_reduction = self.get_reduction(reduction_id)
        if not db_reduction:
            return False
        self.db.delete(db_reduction)
        self.db.commit()
        return True
