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
    pin VARCHAR(4) NOT NULL                        -- user pincode for auth
);


-- contacts

CREATE TABLE user_contacts (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    reference_id UUID NOT NULL,

    CONSTRAINT fk_reference
        FOREIGN KEY (reference_id) REFERENCES users(id)
        ON DELETE CASCADE
);


INSERT INTO user_contacts (username, reference_id)
VALUES ('ali123', 'c7b3f7f8-9a4c-4c0a-9c77-0c9eab1c25ef');




-- messages

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    is_read BOOLEAN DEFAULT false
);


SELECT * FROM messages 
WHERE (sender_id = 'user1' AND receiver_id = 'user2') 
   OR (sender_id = 'user2' AND receiver_id = 'user1')
ORDER BY created_at;


INSERT INTO messages (sender_id, receiver_id, content) 
VALUES (
  'sender-uuid-id-here',
  'receiver-uuid-id-here',
  'Hello jani! Kya haal hai?'
);