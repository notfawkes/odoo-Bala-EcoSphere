# Ecosphere Environmental Module Backend API

This document details the backend API for the **Environmental Module** built with FastAPI, SQLAlchemy 2.0, and Pydantic v2.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Base URL](#base-url)
3. [Common Response Structures](#common-response-structures)
4. [Environmental Goals](#environmental-goals)
5. [Product ESG Profiles](#product-esg-profiles)
6. [Emission Factors](#emission-factors)
7. [Carbon Transactions](#carbon-transactions)

---

## Project Overview

The Environmental Module uses role-based separation:
- **Employee Routes (`/employee/environment/*`)**: Read-only routes allowing pagination, filtering, and data export (CSV, Excel, PDF).
- **Admin Routes (`/admin/environment/*`)**: Full CRUD (Create, Read, Update, Delete) routes for managing data.

### Tech Stack
- **Framework**: FastAPI
- **Database**: Neon PostgreSQL
- **ORM**: SQLAlchemy 2.0
- **Validation**: Pydantic v2

---

## Base URL
When running locally via `uvicorn`, the base URL is:
```
http://localhost:8000
```
Interactive API documentation (Swagger UI) is available at `http://localhost:8000/docs`.

---

## Common Response Structures

**Paginated Response (Employee GET endpoints):**
```json
{
  "items": [
    { ... }
  ],
  "total": 50,
  "page": 1,
  "size": 10
}
```

---

## Environmental Goals

Manages organizational targets for ESG. Mapped to the `esg_goals` table.

### Admin Routes (CRUD)

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/admin/environment/environmental-goals` | Create a new goal. |
| `PUT` | `/admin/environment/environmental-goals/{id}` | Update an existing goal. |
| `DELETE`| `/admin/environment/environmental-goals/{id}` | Delete a goal. |

**Example Request (`POST`):**
```json
{
  "organization_id": "uuid",
  "category": "Energy",
  "title": "Reduce Electricity",
  "target_value": 500.0,
  "current_value": 200.0,
  "unit": "kWh",
  "deadline": "2026-12-31",
  "status": "In Progress"
}
```

### Employee Routes (Read-Only)

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/employee/environment/environmental-goals` | Get paginated goals. Supports query parameters `category` and `status`. |
| `GET` | `/employee/environment/environmental-goals/{id}` | Get a specific goal by ID. |
| `GET` | `/employee/environment/environmental-goals/export/csv` | Export all goals to CSV. |
| `GET` | `/employee/environment/environmental-goals/export/excel` | Export all goals to Excel. |
| `GET` | `/employee/environment/environmental-goals/export/pdf` | Export all goals to PDF. |

---

## Product ESG Profiles

Manages Environmental, Social, and Governance scores. Mapped to the `esg_scores` table as a proxy.

### Admin Routes (CRUD)

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/admin/environment/product-esg` | Create a new ESG profile/score. |
| `PUT` | `/admin/environment/product-esg/{id}` | Update an existing ESG profile. |
| `DELETE`| `/admin/environment/product-esg/{id}` | Delete an ESG profile. |

**Example Request (`POST`):**
```json
{
  "organization_id": "uuid",
  "environmental_score": 85.5,
  "social_score": 90.0,
  "governance_score": 88.5,
  "overall_score": 88.0,
  "calculated_on": "2026-07-01"
}
```

### Employee Routes (Read-Only)

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/employee/environment/product-esg` | Get paginated ESG profiles. |
| `GET` | `/employee/environment/product-esg/{id}` | Get a specific ESG profile by ID. |

---

## Emission Factors

Manages factors and quantities for carbon emissions. Mapped to the `carbon_emissions` table.

### Admin Routes (CRUD)

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/admin/environment/emission-factors` | Record a new emission factor/record. |
| `PUT` | `/admin/environment/emission-factors/{id}` | Update an existing record. |
| `DELETE`| `/admin/environment/emission-factors/{id}` | Delete a record. |

**Example Request (`POST`):**
```json
{
  "organization_id": "uuid",
  "facility": "Plant A",
  "department": "Production",
  "emission_source": "Generators",
  "emission_type": "Scope 1",
  "quantity": 150.5,
  "unit": "tCO2e",
  "reporting_month": "2026-06-01",
  "verified": true
}
```

### Employee Routes (Read-Only)

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/employee/environment/emission-factors` | Get paginated emission factors. Supports query parameters `department` and `emission_type`. |
| `GET` | `/employee/environment/emission-factors/{id}`| Get a specific emission factor by ID. |

---

## Carbon Transactions

Manages emission reduction events. Mapped to the `emission_reductions` table.

### Admin Routes (CRUD)

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/admin/environment/carbon-transactions` | Record a new reduction transaction. |
| `PUT` | `/admin/environment/carbon-transactions/{id}` | Update an existing transaction. |
| `DELETE`| `/admin/environment/carbon-transactions/{id}` | Delete a transaction. |

**Example Request (`POST`):**
```json
{
  "emission_id": "uuid",
  "reduction_amount": 25.0,
  "description": "Upgraded HVAC system",
  "completed_on": "2026-07-10",
  "verified": true
}
```

### Employee Routes (Read-Only)

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/employee/environment/carbon-transactions` | Get paginated transactions. Supports query parameter `verified`. |
| `GET` | `/employee/environment/carbon-transactions/{id}` | Get a specific transaction by ID. |
| `GET` | `/employee/environment/carbon-transactions/export/csv` | Export transactions to CSV. |
| `GET` | `/employee/environment/carbon-transactions/export/excel` | Export transactions to Excel. |
| `GET` | `/employee/environment/carbon-transactions/export/pdf` | Export transactions to PDF. |
