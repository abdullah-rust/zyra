Zyra: Real-time Communication Platform
A high-performance and secure chat application built as a full-stack portfolio project, showcasing modern web development practices and a robust, scalable architecture.

✨ Features
Secure & Encrypted Messaging: End-to-end encrypted conversations for maximum privacy.

Real-time Communication: Instant message delivery and notifications powered by a dedicated real-time backend.

Rich File Sharing: Seamlessly share images, videos, and other files with an efficient handling system.

User Management: Complete user authentication, profile settings, and account management.

Scalable Architecture: Microservices approach designed to handle a large number of concurrent users and data.

🛠️ Tech Stack
Frontend
<br>
<br>

Next.js: Server-side rendering and routing for high performance.

React.js: Core UI library for building dynamic and responsive interfaces.

Expo (Future): Planned for a cross-platform mobile application.

Backend
<br>
<br>

Node.js with Express: For building the main RESTful APIs.

Bun.js: Utilized for high-performance file handling of images and videos.

Rust with Axum: A blazing-fast and secure backend for the real-time chat and notification system.

Databases & Caching
<br>
<br>

PostgreSQL: Primary database for structured user data and settings.

MongoDB: Ideal for storing flexible, unstructured data like chat conversations.

Redis: In-memory data caching to significantly enhance performance.

🚀 Getting Started
Follow these simple steps to get the project up and running locally.

Prerequisites
Make sure you have the following installed on your machine:

Node.js & npm (or yarn)

Rust & Cargo

Bun.js

PostgreSQL

MongoDB

Redis

Installation
Clone the repository:

git clone [https://github.com/abdullah-rust/zyra.git)
cd zyra

Set up the backend:

cd backend
npm install
# Create a .env file with your database connection strings
npm start

Set up the real-time server:

cd realtime-server
cargo run

Set up the frontend:

cd frontend
npm install
npm run dev

📂 Project Structure
├── backend/                  # Node.js & Express API
├── realtime-server/          # Rust & Axum real-time service
├── frontend/                 # Next.js application
├── bun-file-handler/         # Bun.js file handling service
├── README.md                 # This file
└── ...

🔮 Future Plans
Mobile App: Develop a cross-platform mobile app using Expo.

Group Chats: Implement a robust system for multi-user conversations.

Media Previews: Add rich media previews within the chat interface.

Enhanced Security: Integrate advanced authentication methods like two-factor authentication.

📄 License
This project is licensed under the MIT License.
