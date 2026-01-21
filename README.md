# Internship Management & Monitoring System (IMMS)

## Project Structure

This project follows a modular monolith architecture with a React Frontend and Node.js Backend.

### Directory Tree

```
/imms
├── /client                 # Frontend Application (React.js + Vite)
│   ├── /public             # Static assets
│   ├── /src
│   │   ├── /assets         # Images, global styles
│   │   ├── /components     # Reusable UI components (Buttons, Forms)
│   │   ├── /context        # Global State (AuthContext, ThemeContext)
│   │   ├── /pages          # Route components (Dashboard, Login)
│   │   ├── /services       # API Service calls (Axios instances)
│   │   ├── /utils          # Helper functions
│   │   ├── App.jsx         # Main App component
│   │   └── main.jsx        # Entry point
│   └── vite.config.js      # Vite Configuration
│
├── /server                 # Backend Application (Node.js + Express)
│   ├── /config             # Configuration (DB, Env)
│   ├── /controllers        # Request Handlers (Business Logic)
│   ├── /middleware         # Middleware (Auth, Privacy, Validation)
│   ├── /models             # Database Models (PostgreSQL)
│   ├── /routes             # API Route Definitions
│   ├── /utils              # Utilities (Logger, Cron jobs)
│   └── app.js              # App setup
│
└── /docs                   # Documentation & Design assets
    └── schema.sql          # Database Schema
```

## Setup Instructions

1.  **Database**: Run `docs/schema.sql` in your PostgreSQL instance.
2.  **Server**: `cd server` -> `npm install` -> `npm start`
3.  **Client**: `cd client` -> `npm install` -> `npm run dev`
