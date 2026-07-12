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

app = FastAPI(
    title="Ecosphere Environmental Module API",
    description="API for managing Environmental Goals, Carbon Transactions, Emission Factors, and Product ESG Profiles.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Admin Routers
app.include_router(admin_goals.router, prefix="/admin")
app.include_router(admin_carbon.router, prefix="/admin")
app.include_router(admin_factors.router, prefix="/admin")
app.include_router(admin_esg.router, prefix="/admin")

# Include Employee Routers
app.include_router(employee_goals.router, prefix="/employee")
app.include_router(employee_carbon.router, prefix="/employee")
app.include_router(employee_factors.router, prefix="/employee")
app.include_router(employee_esg.router, prefix="/employee")

@app.get("/")
def root():
    return {"message": "Welcome to the Ecosphere Environmental Module API"}
