# CORPORATE DOCUMENT MANAGEMENT SYSTEM (CDMS)

## Project Overview

CORPORATE DOCUMENT MANAGEMENT SYSTEM (CDMS) is a MERN-stack web application that provides a central place to upload, serve, and manage corporate documents (PDFs) alongside a simple blog/posts and category system. It supports user registration and login, protected document uploads, serving uploaded PDF files, and basic CRUD for posts and documents.

This repository contains two main folders: `server` (Express + MongoDB API) and `client` (React + Vite frontend).

## Setup Instructions

Prerequisites:
- **Node.js** (v14+ recommended)
- **npm** (comes with Node)
- **MongoDB** (a connection URI for a MongoDB instance)

1) Clone the repo (if not already):

```powershell
git clone <repo-url>
cd mern-CDMS
```

2) Server setup

- Change into the `server` folder and install dependencies:

```powershell
cd server
npm install
```

- Create a `.env` file in `server/` with at least the following variables:

```
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
BASE_URL= http://localhost:5000
PORT=5000
```

- Start the server (development):

```powershell
# from server/
node server.js
# or if you have nodemon installed
npx nodemon server.js
```

The server serves the API under ` http://localhost:5000/api` by default and uploaded files under ` http://localhost:5000/uploads`.

3) Client setup

- Change into the `client` folder and install dependencies:

```powershell
cd ../client
npm install
npm run dev
```

- The client is configured to run on `http://localhost:5173` (Vite default). The server CORS is pre-configured for `http://localhost:5173`.

## API Documentation

Base URL (development): ` http://localhost:5000/api`

Authentication
- **POST /api/auth/register** — Register a new user
  - Body (JSON): `{ "email": "user@example.com", "password": "secret", "department": "HR" }`
  - Response: `{ token, user }`

- **POST /api/auth/login** — Log in
  - Body (JSON): `{ "email": "user@example.com", "password": "secret" }`
  - Response: `{ token, user }`

Authorization
- Protected endpoints require an `Authorization` header: `Bearer <token>` (JWT returned from login/register).

Documents
- **GET /api/documents** — List all documents
  - Response: array of document objects populated with uploader info.

- **GET /api/documents/:id** — Get a single document by id

- **POST /api/documents** — Create/upload a document (protected)
  - Content-Type: `multipart/form-data`
  - Form fields:
    - `file` — file upload (PDF or other file)
    - `title` — string (required)
    - `description` — string (optional)
    - `department` — string (required)
  - Response: created document object. Uploaded files are saved to the `uploads/` folder and served from `/uploads/<filename>`.

- **PUT /api/documents/:id** — Update document metadata (protected)
  - Body (JSON): any updatable fields (e.g., `title`, `description`, `department`)

- **DELETE /api/documents/:id** — Delete a document (protected)

Posts (Blog)
- **GET /api/posts** — List posts
- **GET /api/posts/:id** — Get single post
- **POST /api/posts** — Create post
  - Body (JSON): `{ "title": "...", "content": "...", "category": "<categoryId>", "image": "<url>" }`
- **PUT /api/posts/:id** — Update post
- **DELETE /api/posts/:id** — Delete post

Categories
- **GET /api/categories** — List categories

Notes on request/response shapes
- Document model fields: `title` (required), `description`, `department` (required), `fileUrl` (required), `filename`, `uploadedBy` (user ref), `createdAt`.
- User model fields: `email`, `password` (hashed), `department`, `createdAt`.
- Post model fields: `title` (required), `content`, `category` (ref), `image`, `createdAt`.

Error handling
- The server returns standard HTTP status codes and JSON error messages like `{ "message": "..." }`.

## Features Implemented

- **User authentication**: register and login with password hashing and JWT.
- **Protected routes**: middleware `protect` validates JWT for upload and modification actions.
- **Document uploads**: server uses `multer` to accept file uploads to `uploads/` and serves them statically.
- **Document management**: create, read, update, delete documents and metadata (with uploader info).
- **Posts and categories**: basic CRUD for posts and listing categories.
- **Frontend (React + Vite)**: client-side app for upload, browsing, and authentication (in `client/`).

## Development Notes

- Ensure `BASE_URL` is set correctly in `server/.env` so uploaded file URLs are generated properly.
- The server static route `app.use('/uploads', express.static(path.resolve('uploads')))` exposes uploaded PDFs at `http://<BASE_URL>/uploads/<filename>`.
- CORS is currently configured for `http://localhost:5173` (Vite dev). Update server CORS if you serve the client from a different origin.

## Next Steps (optional)

- Add endpoint documentation with examples (Postman collection).
- Add input validation and file type checks for uploads.
- Add role-based access control if needed for document permissions.

---

If you want, I can also:
- Add a short `README` section specific to `client/` explaining the UI pages and environment flags.
- Create a `postman_collection.json` with example requests for the documented endpoints.

If you'd like any changes to the README structure or extra details added, tell me which parts to expand.
