import os
from dotenv import load_dotenv
import uuid
import hashlib
import sqlite3
import jwt
from datetime import datetime, timedelta
from typing import Optional
# pyrefly: ignore [missing-import]
from fastapi import FastAPI, HTTPException, Header, status
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from pydantic import BaseModel
# pyrefly: ignore [missing-import]
from app.services.governance_router import router as governance_router      
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

# Helper: Parse local .env file
def load_dotenv():
    # Looks for .env in the parent directory of this file (ecosphere-backend/.env)
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    # Remove surrounding quotes if present
                    val_str = val.strip()
                    if (val_str.startswith('"') and val_str.endswith('"')) or (val_str.startswith("'") and val_str.endswith("'")):
                        val_str = val_str[1:-1]
                    os.environ[key.strip()] = val_str

load_dotenv()


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
app.include_router(governance_router)


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

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT configuration
SECRET_KEY = os.getenv("JWT_SECRET", "ecosphere-secret-key-for-jwt-tokens-2026-very-secure")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 1 week token life

# DB configurations
DATABASE_URL = os.getenv("DATABASE_URL", "")
DB_HOST = os.getenv("DB_HOST", "")
DB_USER = os.getenv("DB_USER", "")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "")
DB_PORT = os.getenv("DB_PORT", "5432")

def get_db_connection():
    if DATABASE_URL.startswith("postgres://") or DATABASE_URL.startswith("postgresql://"):
        import psycopg2
        conn_str = DATABASE_URL
        if "sslmode=" not in conn_str:
            if "?" in conn_str:
                conn_str += "&sslmode=require"
            else:
                conn_str += "?sslmode=require"
        # psycopg2 requires postgresql:// schema
        if conn_str.startswith("postgres://"):
            conn_str = conn_str.replace("postgres://", "postgresql://", 1)
        return psycopg2.connect(conn_str)
    elif DB_HOST and DB_USER:
        import psycopg2
        return psycopg2.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
            port=DB_PORT,
            sslmode="require"
        )
    else:
        # Fallback to local SQLite
        conn = sqlite3.connect("ecosphere.db")
        return conn

def execute_query(conn, query: str, params: tuple = ()):
    cursor = conn.cursor()
    # Check if we are using PostgreSQL (psycopg2 connection type)
    is_postgres = "psycopg2" in str(type(conn))
    if is_postgres:
        # Translate SQLite ? placeholder to PostgreSQL %s
        query = query.replace("?", "%s")
    cursor.execute(query, params)
    return cursor

# Helper: Password Hashing
def hash_password(password: str, salt: Optional[str] = None) -> tuple[str, str]:
    if salt is None:
        salt = os.urandom(16).hex()
    # Use PBKDF2-HMAC-SHA256
    pwd_hash = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        100000
    ).hex()
    return pwd_hash, salt

def verify_password(password: str, hashed_password: str, salt: str) -> bool:
    expected_hash, _ = hash_password(password, salt)
    return expected_hash == hashed_password

# Helper: JWT Operations
def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None

# Helper: Compute initials
def get_initials(name: str) -> str:
    parts = name.strip().split()
    if not parts:
        return "U"
    if len(parts) == 1:
        return parts[0][:2].upper()
    return (parts[0][0] + parts[-1][0]).upper()

# Database Setup
def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if postgres
    is_postgres = "psycopg2" in str(type(conn))
    
    if is_postgres:
        # PostgreSQL schema matching Neon DB structure, adding auth columns if not present
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                organization_id UUID NULL,
                full_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                department VARCHAR(100) NULL,
                designation VARCHAR(100) NULL,
                role VARCHAR(50) NOT NULL,
                status VARCHAR(30) DEFAULT 'active',
                joined_date DATE DEFAULT CURRENT_DATE,
                created_at TIMESTAMP DEFAULT now(),
                hashed_password VARCHAR(255) NULL,
                salt VARCHAR(255) NULL,
                initials VARCHAR(50) NULL
            )
        """)
        
        # Alter table to add hashed_password, salt, initials just in case the table existed but without auth columns
        try:
            cursor.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS hashed_password VARCHAR(255)")
            cursor.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS salt VARCHAR(255)")
            cursor.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS initials VARCHAR(50)")
        except Exception:
            # Table might not exist yet or columns already exist; ignore
            pass
    else:
        # SQLite local fallback
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                user_id TEXT PRIMARY KEY,
                organization_id TEXT NULL,
                full_name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                department TEXT NULL,
                designation TEXT NULL,
                role TEXT NOT NULL,
                status TEXT DEFAULT 'active',
                joined_date TEXT,
                created_at TEXT,
                hashed_password TEXT NOT NULL,
                salt TEXT NOT NULL,
                initials TEXT NOT NULL
            )
        """)
    conn.commit()

    # Seed mock users if empty
    cursor = execute_query(conn, "SELECT COUNT(*) FROM users")
    count = cursor.fetchone()[0]
    if count == 0:
        # Seed default Admin
        admin_email = os.getenv("SEED_ADMIN_EMAIL", "maya@asterco.com")
        admin_pass = os.getenv("SEED_ADMIN_PASSWORD", "password123")
        admin_name = os.getenv("SEED_ADMIN_NAME", "Maya Chen")
        maya_hash, maya_salt = hash_password(admin_pass)
        
        admin_id = str(uuid.uuid4())
        execute_query(conn, """
            INSERT INTO users (user_id, email, hashed_password, salt, full_name, initials, designation, department, role, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
        """, (admin_id, admin_email, maya_hash, maya_salt, admin_name, get_initials(admin_name), "Platform Administrator", "Operations", "admin"))

        # Seed default Employee
        emp_email = os.getenv("SEED_EMPLOYEE_EMAIL", "jordan@asterco.com")
        emp_pass = os.getenv("SEED_EMPLOYEE_PASSWORD", "password123")
        emp_name = os.getenv("SEED_EMPLOYEE_NAME", "Jordan Lee")
        jordan_hash, jordan_salt = hash_password(emp_pass)
        
        emp_id = str(uuid.uuid4())
        execute_query(conn, """
            INSERT INTO users (user_id, email, hashed_password, salt, full_name, initials, designation, department, role, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
        """, (emp_id, emp_email, jordan_hash, jordan_salt, emp_name, get_initials(emp_name), "Product Designer", "Product", "employee"))
        conn.commit()
    conn.close()

# Initialize DB
init_db()

# Pydantic schemas
class UserSignup(BaseModel):
    email: str
    password: str
    name: str
    title: str
    department: str
    role: str  # 'admin' or 'employee'

class UserLogin(BaseModel):
    email: str
    password: str

# Endpoints
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

@app.post("/api/auth/signup")
def signup(data: UserSignup):
    email_clean = data.email.strip().lower()
    if "@" not in email_clean:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email address format"
        )
        
    conn = get_db_connection()
    
    # Check if user already exists
    cursor = execute_query(conn, "SELECT user_id FROM users WHERE email = ?", (email_clean,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address already registered"
        )
    
    # Compute user initials and generate a secure UUID for user_id
    initials = get_initials(data.name)
    hashed_pwd, salt = hash_password(data.password)
    user_uuid = str(uuid.uuid4())
    
    # Save user
    execute_query(conn, """
        INSERT INTO users (user_id, email, hashed_password, salt, full_name, initials, designation, department, role, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
    """, (user_uuid, email_clean, hashed_pwd, salt, data.name, initials, data.title, data.department, data.role))
    conn.commit()
    
    # Fetch inserted user details
    cursor = execute_query(conn, "SELECT email, full_name, initials, designation, department, role FROM users WHERE email = ?", (email_clean,))
    user_row = cursor.fetchone()
    conn.close()
    
    user_data = {
        "email": user_row[0],
        "name": user_row[1],
        "initials": user_row[2],
        "title": user_row[3],
        "department": user_row[4],
        "role": user_row[5]
    }
    
    # Generate token
    token = create_access_token({"sub": user_data["email"], "role": user_data["role"]})
    
    return {
        "token": token,
        "user": user_data
    }

@app.post("/api/auth/login")
def login(data: UserLogin):
    email_clean = data.email.strip().lower()
    conn = get_db_connection()
    
    cursor = execute_query(conn, "SELECT email, hashed_password, salt, full_name, initials, designation, department, role FROM users WHERE email = ?", (email_clean,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    email, hashed_password, salt, full_name, initials, designation, department, role = row
    if not hashed_password or not salt:
         raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Login credentials not set. Please sign up or contact admin."
        )
         
    if not verify_password(data.password, hashed_password, salt):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
        
    user_data = {
        "email": email,
        "name": full_name,
        "initials": initials,
        "title": designation,
        "department": department,
        "role": role
    }
    
    token = create_access_token({"sub": email, "role": role})
    
    return {
        "token": token,
        "user": user_data
    }

@app.get("/api/auth/me")
def get_me(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authentication token"
        )
    
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
        
    email = payload["sub"]
    
    conn = get_db_connection()
    cursor = execute_query(conn, "SELECT email, full_name, initials, designation, department, role FROM users WHERE email = ?", (email,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    email, full_name, initials, designation, department, role = row
    return {
        "email": email,
        "name": full_name,
        "initials": initials,
        "title": designation,
        "department": department,
        "role": role
    }

class UserUpdate(BaseModel):
    name: str
    title: str
    department: str

class PasswordChange(BaseModel):
    old_password: str
    new_password: str

@app.post("/api/auth/update")
def update_profile(data: UserUpdate, authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authentication token"
        )
    
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
        
    email = payload["sub"]
    initials = get_initials(data.name)
    
    conn = get_db_connection()
    execute_query(conn, """
        UPDATE users 
        SET full_name = ?, initials = ?, designation = ?, department = ?
        WHERE email = ?
    """, (data.name, initials, data.title, data.department, email))
    conn.commit()
    
    cursor = execute_query(conn, "SELECT email, full_name, initials, designation, department, role FROM users WHERE email = ?", (email,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    email, full_name, initials, designation, department, role = row
    return {
        "email": email,
        "name": full_name,
        "initials": initials,
        "title": designation,
        "department": department,
        "role": role
    }

@app.post("/api/auth/change-password")
def change_password(data: PasswordChange, authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authentication token"
        )
    
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
        
    email = payload["sub"]
    
    conn = get_db_connection()
    cursor = execute_query(conn, "SELECT hashed_password, salt FROM users WHERE email = ?", (email,))
    row = cursor.fetchone()
    
    if not row:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    hashed_password, salt = row
    if not verify_password(data.old_password, hashed_password, salt):
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid current password"
        )
        
    new_hash, new_salt = hash_password(data.new_password)
    execute_query(conn, "UPDATE users SET hashed_password = ?, salt = ? WHERE email = ?", (new_hash, new_salt, email))
    conn.commit()
    conn.close()
    
    return {
        "message": "Password changed successfully"
    }