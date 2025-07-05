# EngineersIQ

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)

## Overview

The Task Management App is a simple yet powerful tool designed to help users efficiently organize their daily activities and responsibilities. It allows users to create tasks with titles, descriptions, due dates, and assign them to specific categories such as Work, Personal, or Shopping. Each task can be prioritized as Low, Medium, or High, making it easier to focus on what matters most. Users can also mark tasks as completed, filter them based on status, priority, or category, and search through them quickly. With its clean interface and easy-to-use features, the app ensures better productivity and task tracking — whether for personal goals or professional projects.

[![Frontend Live](https://img.shields.io/badge/Frontend-Live-brightgreen?style=for-the-badge)](http://51.20.244.181)

## Features

- **Task Management**: Add, edit, and delete tasks & Organize tasks by categories and priorities.
- **User Authentication**: Secure registration and login with JWT-based authentication.
- **Search & Filter**: Advanced search functionality with debouncing for optimal performance.
- **Micro Animations**: Smooth transitions and effects for an engaging user experience.
- **Responsive Design**: Mobile-friendly interface adapting to various screen sizes.

## Technologies Used

- Frontend: Next.js, ShadCN, React Hook Form, Zod,
- Backend: Express, Mongoose, Zod
- Database: MongoDB
- Authentication: JWT (JSON Web Tokens)
- Styling: Tailwind CSS
- API: RESTful API

## Getting Started

1. Clone the repository:

   ```
   git clone https://github.com/naimuddin94/task-management.git
   ```

2. Install dependencies for backend:

   ```
   cd backend
   pnpm install
   ```

3. Install dependencies for frontend:

   ```
   cd frontend
   pnpm install
   ```

4. Set up environment variables:
   Create a `.env` file in the root directory and add the necessary environment variables (database connection string, JWT secret, other credentials, etc.).

5. Start the development server and client:

   ```
   pnpm dev
   ```

6. Open your browser and navigate to `http://localhost:3000` to see the application running.

## Project Structure

```
tech-tips-and-tricks-hub/
├── client/                  # NextJS application
│   ├── components/          # Reusable React components for UI elements
│   ├── app/                 # Next.js application with app router structure
│   ├── styles/              # CSS and styling files for the frontend
│   ├── Hook/                # Custom React hooks for state and logic handling
│   ├── lib/                 # Shared library for utility functions and configurations
│   ├── utils/               # Utility functions and helper methods for frontend operations
├── server/                  # Backend implementation following the MVC pattern
├── src/                     # Source directory for the backend application
│   ├── app/                 # Core application logic
│   │   ├── modules/         # Modularized backend structure
│   │   │   ├── controllers/ # Handles business logic and request processing
│   │   │   ├── models/      # Database models and schemas
│   │   │   ├── services/    # Service layer for data manipulation and business rules
│   │   │   ├── routes/      # API route definitions and endpoints
│   │   └── app.ts           # Main application entry point
├── .env.example             # Example environment variables configuration
├── package.json             # Project metadata and dependencies for both frontend and backend
├── tsconfig.json            # TypeScript configuration settings
└── README.md                # Project documentation with setup, usage, and guidelines

```

## API Endpoints

- `/api/auth`: Authentication routes (register, login, logout)
- `/api/categories`: Category-related routes
- `/api/tasks`: Task-related routes

## **API Documentation**

Detailed API documentation is available through Postman. It includes endpoints, request formats, and response structures.

[![Postman Docs](https://img.shields.io/badge/Postman-API_Docs-orange?style=for-the-badge&logo=postman)](https://documenter.getpostman.com/view/30917082/2sB34cnh9r)
