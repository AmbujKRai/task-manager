# 📋 Task Manager API

A scalable REST API with JWT authentication, role-based access control, and a React frontend.

## Tech Stack
- **Backend:** Node.js, Express.js, Sequelize ORM
- **Database:** PostgreSQL
- **Auth:** JWT + bcrypt
- **Frontend:** React.js (Vite)
- **Docs:** Swagger UI

## Getting Started

### Prerequisites
- Node.js v18+, PostgreSQL, Git

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env       # fill in your DB credentials
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| POST | /api/v1/auth/register | None | – |
| POST | /api/v1/auth/login | None | – |
| GET | /api/v1/auth/me | JWT | Any |
| GET | /api/v1/tasks | JWT | Any |
| POST | /api/v1/tasks | JWT | Any |
| PUT | /api/v1/tasks/:id | JWT | Owner |
| DELETE | /api/v1/tasks/:id | JWT | Owner |
| GET | /api/v1/admin/users | JWT | Admin |

## API Docs
Visit `http://localhost:5000/api/docs` after starting the server.

## Scalability Notes
- **Microservices:** Auth and Task services can be independently deployed
- **Caching:** Redis can cache `/tasks` queries to reduce DB load
- **Load Balancing:** Multiple instances behind NGINX or AWS ALB
- **Database:** pg connection pooling + read replicas for scale
- **Docker:** Containerize with docker-compose for consistent deployments
- **Logging:** Add Winston or Morgan for structured production logging