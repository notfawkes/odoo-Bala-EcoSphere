import os
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from environment.routers.admin import (
    environmental_goals as admin_goals,
    carbon_transactions as admin_carbon,
    emission_factors as admin_factors,
    product_esg as admin_esg
)
from environment.routers.employee import (
    environmental_goals as employee_goals,
    carbon_transactions as employee_carbon,
    emission_factors as employee_factors,
    product_esg as employee_esg
)

from social.routers.admin import router as admin_social
from social.routers.employee import router as employee_social

app = FastAPI(
    title="EcoSphere API",
    version="1.0.0",
    description="Backend API for EcoSphere ESG Management Platform"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Environmental Admin
app.include_router(admin_goals.router, prefix="/admin")
app.include_router(admin_carbon.router, prefix="/admin")
app.include_router(admin_factors.router, prefix="/admin")
app.include_router(admin_esg.router, prefix="/admin")

# Environmental Employee
app.include_router(employee_goals.router, prefix="/employee")
app.include_router(employee_carbon.router, prefix="/employee")
app.include_router(employee_factors.router, prefix="/employee")
app.include_router(employee_esg.router, prefix="/employee")

# Social Admin
app.include_router(admin_social, prefix="/admin")

# Social Employee
app.include_router(employee_social, prefix="/employee")

@app.get("/")
def root():
    return {
        "message": "EcoSphere Backend Running"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }