# Corporate Document Management System (CDMS)

A MERN-stack web application for uploading, serving, and managing corporate documents (PDFs), with user authentication, a blog/posts system, and category management.

## Stack

- **Backend**: Express.js + MongoDB (Mongoose) + Cloudinary (PDF storage)
- **Frontend**: React + Vite (port 5000)

## How to Run

Two workflows must be running:

| Workflow | Command | Port |
|---|---|---|
| **Backend** | `cd server && node server.js` | 3000 |
| **Start application** | `cd client && npm run dev` | 5000 (webview) |

The Vite dev server proxies `/api/*` requests to the backend on port 3000.

## Required Secrets

| Secret | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

## Project Structure

```
├── server/          # Express API
│   ├── config/      # DB + Cloudinary config
│   ├── controllers/ # Route handlers
│   ├── middleware/  # JWT auth middleware
│   ├── models/      # Mongoose models (User, Document, Post, Category)
│   ├── routes/      # API routes
│   └── server.js    # Entry point
└── client/          # React + Vite frontend
    └── src/
```

## API Base URL

Development: `http://localhost:3000/api`

## User Preferences

(none yet)
