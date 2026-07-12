import os
import hashlib
import sqlite3
import jwt
from datetime import datetime, timedelta
from typing import Optional
from fastapi import FastAPI, HTTPException, Header, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="EcoSphere API",
    version="1.0.0",
    description="Backend API for EcoSphere ESG Management Platform"
)

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

DB_PATH = "ecosphere.db"

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
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            hashed_password TEXT NOT NULL,
            salt TEXT NOT NULL,
            name TEXT NOT NULL,
            initials TEXT NOT NULL,
            title TEXT NOT NULL,
            department TEXT NOT NULL,
            role TEXT NOT NULL
        )
    """)
    conn.commit()

    # Check if empty, then seed default users
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        # Seed Maya Chen (Admin)
        maya_hash, maya_salt = hash_password("password123")
        cursor.execute("""
            INSERT INTO users (email, hashed_password, salt, name, initials, title, department, role)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, ("maya@asterco.com", maya_hash, maya_salt, "Maya Chen", "MC", "Platform Administrator", "Operations", "admin"))

        # Seed Jordan Lee (Employee)
        jordan_hash, jordan_salt = hash_password("password123")
        cursor.execute("""
            INSERT INTO users (email, hashed_password, salt, name, initials, title, department, role)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, ("jordan@asterco.com", jordan_hash, jordan_salt, "Jordan Lee", "JL", "Product Designer", "Product", "employee"))
        
        conn.commit()
    conn.close()

# Initialize DB on import
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
    # Basic email verification
    email_clean = data.email.strip().lower()
    if "@" not in email_clean:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email address format"
        )
        
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Check if user already exists
    cursor.execute("SELECT id FROM users WHERE email = ?", (email_clean,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address already registered"
        )
    
    # Compute user initials
    initials = get_initials(data.name)
    hashed_pwd, salt = hash_password(data.password)
    
    # Save user
    cursor.execute("""
        INSERT INTO users (email, hashed_password, salt, name, initials, title, department, role)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (email_clean, hashed_pwd, salt, data.name, initials, data.title, data.department, data.role))
    conn.commit()
    
    # Fetch inserted user details
    cursor.execute("SELECT email, name, initials, title, department, role FROM users WHERE email = ?", (email_clean,))
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
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT email, hashed_password, salt, name, initials, title, department, role FROM users WHERE email = ?", (email_clean,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    email, hashed_password, salt, name, initials, title, department, role = row
    if not verify_password(data.password, hashed_password, salt):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
        
    user_data = {
        "email": email,
        "name": name,
        "initials": initials,
        "title": title,
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
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT email, name, initials, title, department, role FROM users WHERE email = ?", (email,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    email, name, initials, title, department, role = row
    return {
        "email": email,
        "name": name,
        "initials": initials,
        "title": title,
        "department": department,
        "role": role
    }