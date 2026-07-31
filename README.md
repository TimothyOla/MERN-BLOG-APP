# Marginalia — MERN Blog App

A full-stack blog application built with MongoDB, Express, React (Vite), and Node.js.
Users can register, log in, and create/edit/delete their own posts. Auth is handled
with JWTs; only a post's author can edit or delete it.

## Features
- Email + password registration and login (JWT auth)
- Create, view, edit, and delete blog posts
- Only the author can edit/delete their own posts
- Protected routes on both frontend and backend
- Dockerized: frontend, backend, and MongoDB each run in their own container

## Tech stack
- **Frontend:** React + Vite, React Router, Axios
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB
- **Auth:** JSON Web Tokens (JWT), bcrypt password hashing
- **Containerization:** Docker + Docker Compose

## Project structure
```
mern-blog-app/
├── backend/
│   ├── config/db.js
│   ├── controllers/       # authController.js, postController.js
│   ├── middleware/        # auth.js, errorHandler.js
│   ├── models/            # User.js, Post.js
│   ├── routes/            # authRoutes.js, postRoutes.js
│   ├── server.js
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/axios.js
│   │   ├── context/AuthContext.jsx
│   │   ├── components/    # Navbar, PrivateRoute, PostCard
│   │   ├── pages/         # Home, Login, Register, PostDetail, CreatePost, EditPost
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── Dockerfile
└── docker-compose.yml
```

## Running with Docker (recommended)

1. Copy the backend env file and set a real JWT secret:
   ```bash
   cp backend/.env.example backend/.env
   # edit backend/.env and set JWT_SECRET to a long random string
   ```
2. From the project root:
   ```bash
   docker compose up --build
   ```
3. Visit:
   - Frontend: http://localhost:5173
   - Backend health check: http://localhost:5000/api/health

MongoDB data persists in a named Docker volume (`mongo-data`) between restarts.

## Running locally without Docker

**Backend**
```bash
cd backend
cp .env.example .env      # then set MONGO_URI to a local/Atlas connection string
npm install
npm run dev                # requires nodemon (in devDependencies)
```

**Frontend**
```bash
cd frontend
cp .env.example .env       # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```

## API reference

| Method | Route              | Auth required | Description                     |
|--------|--------------------|----------------|----------------------------------|
| POST   | /api/auth/register | No             | Create an account                |
| POST   | /api/auth/login     | No             | Log in, returns a JWT            |
| GET    | /api/auth/me        | Yes            | Get the current user             |
| GET    | /api/posts          | No             | List all posts                   |
| GET    | /api/posts/:id       | No             | Get a single post                |
| POST   | /api/posts           | Yes            | Create a post                    |
| PUT    | /api/posts/:id        | Yes (owner)    | Update your own post             |
| DELETE | /api/posts/:id        | Yes (owner)    | Delete your own post             |

Authenticated requests send `Authorization: Bearer <token>`.

## Notes / next steps
Not included in v1, but natural extensions: comments, likes, tags/search, and
image uploads (e.g. via S3 or Cloudinary + multer).
