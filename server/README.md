# MERN Blog Server

A RESTful API backend for a blog application built with Express.js, MongoDB, and Node.js. This server provides comprehensive endpoints for managing blog posts and categories with full CRUD operations.

## Project Overview

The MERN Blog Server is a scalable backend application designed to manage blog content including posts and categories. It implements industry-standard practices including error handling, database connectivity, and RESTful API architecture. The server is built with Express.js and uses MongoDB as its database, with Mongoose as the ODM (Object Document Mapper).

### Technology Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework for building REST APIs
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Joi** - Data validation
- **CORS** - Cross-Origin Resource Sharing
- **Nodemon** - Development server with auto-reload

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas cloud instance)
- npm or yarn package manager

### Installation Steps

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file in the root directory:**
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/mern-blog
   ```
   
   > **Note:** Replace `mongodb://localhost:27017/mern-blog` with your MongoDB connection string. For MongoDB Atlas, use your cloud connection string.

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   Or for production:
   ```bash
   npm start
   ```

5. **Verify the server is running:**
   - You should see the message: `Server running on port 5000`
   - MongoDB connection confirmation: `MongoDB connected`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Posts Endpoints

#### Get All Posts
- **Endpoint:** `GET /api/posts`
- **Description:** Retrieve all blog posts with populated category information
- **Response:**
  ```json
  [
    {
      "_id": "post_id",
      "title": "Post Title",
      "content": "Post content here",
      "category": {
        "_id": "category_id",
        "name": "Category Name"
      },
      "image": "image_url",
      "createdAt": "2025-11-15T00:00:00.000Z"
    }
  ]
  ```

#### Get Single Post
- **Endpoint:** `GET /api/posts/:id`
- **Description:** Retrieve a specific post by ID with populated category
- **Parameters:**
  - `id` (string, required) - The post ID
- **Response:**
  ```json
  {
    "_id": "post_id",
    "title": "Post Title",
    "content": "Post content here",
    "category": {
      "_id": "category_id",
      "name": "Category Name"
    },
    "image": "image_url",
    "createdAt": "2025-11-15T00:00:00.000Z"
  }
  ```

#### Create Post
- **Endpoint:** `POST /api/posts`
- **Description:** Create a new blog post
- **Request Body:**
  ```json
  {
    "title": "New Post Title",
    "content": "Post content",
    "category": "category_id",
    "image": "image_url"
  }
  ```
- **Response:** Returns the created post object with `_id` and `createdAt`

#### Update Post
- **Endpoint:** `PUT /api/posts/:id`
- **Description:** Update an existing post
- **Parameters:**
  - `id` (string, required) - The post ID
- **Request Body:**
  ```json
  {
    "title": "Updated Title",
    "content": "Updated content",
    "category": "category_id",
    "image": "updated_image_url"
  }
  ```
- **Response:** Returns the updated post object

#### Delete Post
- **Endpoint:** `DELETE /api/posts/:id`
- **Description:** Delete a post by ID
- **Parameters:**
  - `id` (string, required) - The post ID
- **Response:**
  ```json
  {
    "message": "Post deleted"
  }
  ```

### Categories Endpoints

#### Get All Categories
- **Endpoint:** `GET /api/categories`
- **Description:** Retrieve all available categories
- **Response:**
  ```json
  [
    {
      "_id": "category_id",
      "name": "Technology"
    },
    {
      "_id": "category_id2",
      "name": "Lifestyle"
    }
  ]
  ```

#### Create Category
- **Endpoint:** `POST /api/categories`
- **Description:** Create a new category
- **Request Body:**
  ```json
  {
    "name": "New Category"
  }
  ```
- **Response:** Returns the created category object with `_id`

## Features Implemented

### ✅ Core Features

1. **Post Management**
   - Create new blog posts with title, content, image, and category
   - Retrieve all posts with category information populated
   - Get individual posts by ID
   - Update existing posts with new information
   - Delete posts from the database

2. **Category Management**
   - Create new categories for organizing posts
   - Retrieve all available categories
   - Categories are linked to posts via MongoDB ObjectId references

3. **Database Integration**
   - MongoDB connection with Mongoose ODM
   - Automatic schema validation
   - Relationship management between Posts and Categories
   - Default timestamps for post creation

4. **API Standards**
   - RESTful API design following HTTP conventions
   - Proper HTTP methods (GET, POST, PUT, DELETE)
   - JSON request/response format
   - CORS support for cross-origin requests

5. **Error Handling**
   - Centralized error handler middleware
   - Proper error propagation through try-catch blocks
   - Error messages passed to the error handler middleware
   - Graceful error responses to clients

6. **Development Features**
   - Nodemon for automatic server restart on code changes
   - Environment variable support via dotenv
   - ES6 module syntax for modern JavaScript
   - Express middleware for JSON parsing and CORS

### 📋 Data Models

**Post Model:**
- `title` (String, required) - Post title
- `content` (String, optional) - Post content
- `category` (ObjectId, ref: Category) - Reference to category
- `image` (String, optional) - Image URL
- `createdAt` (Date, auto) - Timestamp of creation

**Category Model:**
- `name` (String, required) - Category name

## Project Structure

```
server/
├── config/
│   └── db.js              # MongoDB connection configuration
├── controllers/
│   ├── postController.js   # Post CRUD operations
│   └── categoryController.js # Category operations
├── middleware/
│   └── errorHandler.js     # Centralized error handling
├── models/
│   ├── Post.js            # Post schema definition
│   └── Category.js        # Category schema definition
├── routes/
│   ├── postRoutes.js      # Post API routes
│   └── categoryRoutes.js   # Category API routes
├── server.js              # Express app setup and initialization
├── seed.js                # Database seeding script
├── package.json           # Project dependencies
├── .env                   # Environment variables (create locally)
└── README.md              # This file
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern-blog
```

- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string

## Example Usage

### Using cURL

**Get all posts:**
```bash
curl http://localhost:5000/api/posts
```

**Create a category:**
```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Technology"}'
```

**Create a post:**
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "This is my first blog post",
    "category": "category_id_here",
    "image": "https://example.com/image.jpg"
  }'
```

### Using Postman

1. Import the API endpoints listed above
2. Set request type to GET for retrieving data, POST for creating, PUT for updating, DELETE for removing
3. For POST/PUT requests, set `Content-Type: application/json` in headers
4. Include request body as JSON for creating/updating resources

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| `MongoDB connected` doesn't appear | Check MONGO_URI in .env file and ensure MongoDB is running |
| Port 5000 is already in use | Change PORT in .env file to an available port |
| CORS errors | Verify CORS is enabled in server.js and frontend is making requests correctly |
| Cannot find module errors | Run `npm install` to install all dependencies |

## Future Enhancements

- Input validation using Joi schemas
- Authentication and authorization (JWT)
- Post search and filtering capabilities
- Pagination for large datasets
- Image upload handling
- User roles and permissions
- Rate limiting and security headers
- API documentation with Swagger/OpenAPI

## Contributing

This is a learning assignment. For improvements or bug fixes, please follow these steps:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request with detailed description

## License

This project is created for educational purposes as part of the MERN Stack assignment.

## Support

For issues or questions, please refer to:
- MongoDB Documentation: https://docs.mongodb.com/
- Express Documentation: https://expressjs.com/
- Mongoose Documentation: https://mongoosejs.com/
