Zyra - Real-time Communication Platform
A high-performance and secure chat application built as a full-stack portfolio project, featuring real-time messaging, file sharing, and high-quality audio/video calls. This platform is designed to showcase modern web development practices and a robust, scalable architecture.

🌟 Key Features
Secure & Encrypted Messaging: Experience secure, end-to-end encrypted messaging to ensure privacy in every conversation.

Real-time Communication: Enjoy lightning-fast chat with a dedicated real-time backend for instant message delivery and notifications.

Rich File Sharing: Easily share images, videos, and other files with a robust and efficient file handling system.

User Management: Comprehensive user authentication, profile management, and account settings.

Scalable Architecture: Built with a microservices approach to handle a large number of concurrent users and data.

🛠️ Tech Stack
Frontend
React.js: The core UI library for a dynamic and responsive user interface.

Next.js: A powerful React framework for server-side rendering and routing, ensuring optimal performance and SEO.

Expo (Future): Planned for a cross-platform mobile application to extend functionality to iOS and Android devices.

Backend
Node.js with Express: A fast and minimalist web framework for building RESTful APIs.

Bun.js: Utilized for high-performance file handling and management of images and videos.

Rust with Axum: The real-time chat system and notification service are built with Rust's Axum framework for unmatched speed and security.

Databases & Caching
PostgreSQL: Used as the primary relational database for structured data like user profiles and settings.

MongoDB: A NoSQL database specifically for storing unstructured data, like chat conversations, for flexibility and scalability.

Redis: Implemented for in-memory data caching to significantly improve application performance and reduce database load.

🚀 Getting Started
Follow these steps to get your development environment set up locally.

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

git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name

Set up the backend:

# Navigate to the backend directory
cd backend
npm install
# Set up your environment variables (.env file)
# Start the Node.js server
npm run start

Set up the real-time server:

# Navigate to the real-time server directory
cd realtime-server
cargo run

Set up the frontend:

# Navigate to the frontend directory
cd frontend
npm install
npm run dev

📂 Project Structure
├── backend/                  # Node.js Express API
│   ├── routes/
│   ├── controllers/
│   └── ...
├── realtime-server/          # Rust Axum real-time chat service
│   ├── src/
│   └── ...
├── frontend/                 # Next.js application
│   ├── pages/
│   ├── components/
│   └── ...
├── bun-file-handler/         # Bun.js file handling service
├── README.md                 # This file
└── ...
