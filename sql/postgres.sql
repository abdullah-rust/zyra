CREATE DATABASE zyradb;



CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- for gen_random_uuid()

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    name VARCHAR(50) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,         
    email VARCHAR(100) UNIQUE NOT NULL,            
    password TEXT NOT NULL,                   
    created_at TIMESTAMP DEFAULT NOW(),            
    updated_at TIMESTAMP DEFAULT NOW(),            
    bio VARCHAR(160) DEFAULT 'Available',         
    img_link TEXT DEFAULT ''               
);


