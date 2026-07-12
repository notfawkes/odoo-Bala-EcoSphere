from fastapi import FastAPI

app = FastAPI(
    title="EcoSphere API",
    version="1.0.0",
    description="Backend API for EcoSphere ESG Management Platform"
)


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