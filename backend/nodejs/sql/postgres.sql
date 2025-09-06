CREATE DATABASE zyradb;



CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- for gen_random_uuid()

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- unique user id
    username VARCHAR(50) UNIQUE NOT NULL,          -- username (unique)
    email VARCHAR(100) UNIQUE NOT NULL,            -- email (unique)
    password_hash TEXT NOT NULL,                   -- hashed password (bcrypt/argon2)
    created_at TIMESTAMP DEFAULT NOW(),            -- account banane ka time
    updated_at TIMESTAMP DEFAULT NOW()             -- last update
);