import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Expects DATABASE_URL to be set in environment, defaults to a local Postgres for safety
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/ecosphere")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
