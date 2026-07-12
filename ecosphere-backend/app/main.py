from fastapi import FastAPI
from app.routers.governance import router as governance_router

app = FastAPI(
    title="EcoSphere API",
    version="1.0.0",
    description="Backend API for EcoSphere ESG Management Platform"
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