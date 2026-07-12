from fastapi import FastAPI
from app.routers.governance import router as governance_router
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, base
import app.models.policy
import app.models.governance

# Create tables if they don't exist
base.metadata.create_all(bind=engine)

app = FastAPI(
    title="EcoSphere API",
    version="1.0.0",
    description="Backend API for EcoSphere ESG Management Platform"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(governance_router)


@app.get("/")
def root():
    return {
        "message": "EcoSphere Backend Running "
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }