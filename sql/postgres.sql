CREATE DATABASE zyradb;



CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- for gen_random_uuid()

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- unique user id
    name VARCHAR(50) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,          -- username (unique)
    email VARCHAR(100) UNIQUE NOT NULL,            -- email (unique)
    password TEXT NOT NULL,                   -- hashed password (bcrypt/argon2)
    created_at TIMESTAMP DEFAULT NOW(),            -- account banane ka time
    updated_at TIMESTAMP DEFAULT NOW(),             -- last update
    bio VARCHAR(160) DEFAULT 'Available',         -- user bio  
    img_link TEXT DEFAULT '',                       -- user profile image link
);


-- contacts

CREATE TABLE user_contacts (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    reference_id UUID NOT NULL,  -- yahan id us user ki dale gi jis ke contact chahiye 

    CONSTRAINT fk_reference
        FOREIGN KEY (reference_id) REFERENCES users(id)
        FOREIGN KEY (username)  REFERENCES users(username)
        ON DELETE CASCADE
);


INSERT INTO user_contacts (username, reference_id)
VALUES ('ali123', 'c7b3f7f8-9a4c-4c0a-9c77-0c9eab1c25ef');



