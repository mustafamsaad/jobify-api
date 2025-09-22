# Jobify API - Backend

A robust Node.js/Express REST API for job tracking and management with comprehensive authentication and security features.

## 🚀 Key Features

- **JWT Authentication** - Secure user registration/login with token-based auth
- **Job CRUD Operations** - Create, read, update, delete job applications
- **Advanced Security** - Helmet, XSS protection, MongoDB sanitization, CORS
- **User Management** - Profile updates and user-specific data isolation
- **Statistics Dashboard** - Job application analytics and monthly tracking
- **Search & Filter** - Advanced job search with pagination and sorting
- **Error Handling** - Custom error classes with proper HTTP status codes

## 🛠️ Tech Stack

- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database and ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Security Middleware** - Helmet, XSS-Clean, Express-Rate-Limit

## 📊 Data Models

### User Model

- Name, email, password (hashed)
- Location tracking
- JWT token management

### Job Model

- Company, position, job type, status
- Location and timestamps
- User association for data isolation

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- XSS attack prevention
- MongoDB injection protection
- Rate limiting
- CORS configuration
- Request sanitization

## 🚦 API Endpoints

### Authentication

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `PATCH /api/v1/auth/update-user` - Update user profile

### Jobs (Protected Routes)

- `GET /api/v1/jobs` - Get all user jobs (with search/filter)
- `POST /api/v1/jobs` - Create new job
- `GET /api/v1/jobs/stats` - Get job statistics
- `PATCH /api/v1/jobs/:id` - Update job
- `DELETE /api/v1/jobs/:id` - Delete job

## 🔧 Setup & Installation

```bash
npm install
npm run start
```

## 📁 Project Structure

```
api/
├── controllers/     # Route handlers
├── models/         # MongoDB schemas
├── middleware/     # Custom middleware
├── routes/         # API routes
├── errors/         # Custom error classes
├── utils/          # Helper functions
└── db/            # Database connection
```
