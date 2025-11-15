# MERN Blog - Client Application

A modern React client for a blogging platform built with Vite. This frontend application provides a user-friendly interface to browse and read blog posts from a backend API.

<!-- App screenshot: place the attached screenshot file at `public/screenshot.png` -->
![App screenshot](public/screenshot.png)

*Screenshot: main page showing the Create Post form and list of posts.*

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Development](#development)
- [Building](#building)
- [Project Architecture](#project-architecture)
- [Key Components](#key-components)
- [API Integration](#api-integration)

## ✨ Features

- **Fast Performance**: Built with Vite for rapid development and optimized production builds
- **React 19**: Latest React version with modern features and hooks
- **Context API**: Global state management for posts data
- **Client-Side Routing**: React Router for seamless page navigation
- **Custom Hooks**: Reusable `useApi` hook for API communication
- **ESLint Integration**: Code quality and best practices enforcement
- **Hot Module Replacement (HMR)**: Instant updates during development
- **Full CRUD Operations**: Create, read, update, and delete blog posts
- **Category Management**: Organize posts by categories with dynamic category selection
- **Form Validation**: Built-in error handling and validation
- **Loading States**: User-friendly loading indicators during data fetching
- **Individual Post View**: Dedicated page for reading full post content
- **Error Handling**: Comprehensive error messages and feedback
- **Post Editing**: Edit existing posts with pre-populated form data

## 🛠 Tech Stack

- **React 19.2.0** - UI library for building components
- **React DOM 19.2.0** - React rendering engine
- **Vite 7.2.2** - Modern build tool and development server
- **React Router DOM** - Client-side routing (inferred from App.jsx)
- **ESLint** - Code quality and style enforcement

## 📁 Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── PostList.jsx        # Displays all blog posts with links and edit functionality
│   │   ├── PostView.jsx        # Displays individual post with full content and category
│   │   └── PostForm.jsx        # Reusable form for creating and editing posts
│   ├── context/
│   │   └── PostContext.jsx     # Global context for managing posts state
│   ├── hooks/
│   │   └── useApi.js           # Custom hook for API calls (GET, POST, PUT, DELETE)
│   ├── assets/                 # Static assets (images, fonts, etc.)
│   ├── App.jsx                 # Main application component with routes
│   ├── App.css                 # Global application styles
│   ├── main.jsx                # React entry point
│   └── index.css               # Global CSS styles
├── public/                     # Static files served as-is
├── package.json                # Project dependencies and scripts
├── vite.config.js              # Vite configuration
├── eslint.config.js            # ESLint rules configuration
├── index.html                  # HTML template
└── README.md                   # This file
```

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Steps

1. **Clone or navigate to the project directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify installation**
   ```bash
   npm list
   ```

## 🚀 Development

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (default Vite port).

**Development Features:**
- Fast refresh on file changes
- Source maps for easy debugging
- Console error reporting

## 🏗 Building

Build the application for production:

```bash
npm run build
```

This creates an optimized production bundle in the `dist/` directory.

### Preview Production Build

Test the production build locally:

```bash
npm run preview
```

## 🎯 Project Architecture

### Component Hierarchy

```
App (Routes & Providers)
└── PostProvider (Context)
    ├── PostList (Route: /)
    └── PostView (Route: /post/:id)
```

### Data Flow

1. **App Component** - Wraps the entire application with `BrowserRouter` and `PostProvider`
2. **PostProvider** - Manages global posts state and fetches data on mount
3. **PostContext** - Provides `posts` array and `fetchPosts` function to components
4. **Components** - Consume context via `useContext` hook to display data

## 🔧 Key Components

### **App.jsx**
Main application component that sets up:
- Client-side routing with React Router
- Global state provider (PostContext)
- Route definitions for post list and individual post views

### **PostContext.jsx**
Context provider component that:
- Creates a global `PostContext` for posts management
- Initializes state with empty posts array
- Fetches posts on component mount
- Exposes `posts` and `fetchPosts` to child components

### **PostList.jsx**
Displays all blog posts:
- Consumes `PostContext` to get posts array
- Renders clickable post titles as links
- Navigates to individual post pages using React Router
- Supports post editing and deletion functionality
- Manages local state for editing mode

### **PostView.jsx**
Displays individual blog post:
- Uses `useParams` to get post ID from URL
- Fetches and displays full post content
- Shows category information if available
- Implements loading state while fetching
- Responsive layout for readability

### **PostForm.jsx**
Reusable form component for post operations:
- **Create Mode**: Add new posts with title, content, and category
- **Edit Mode**: Modify existing posts with pre-populated fields
- **Category Selection**: Dynamic dropdown populated from `/api/categories`
- **Form Validation**: Ensures all required fields are filled
- **Loading State**: Shows "Saving..." button text during submission
- **Error Handling**: Displays error messages when submission fails
- **Auto-clear**: Resets form after successful submission

## 🔌 API Integration

The application communicates with a backend API through the `useApi` hook.

### API Endpoints Used

- **GET `/api/posts`** - Fetch all blog posts
  - Called automatically on app initialization
  - Response: Array of post objects
- **GET `/api/posts/:id`** - Fetch individual post by ID
  - Used in PostView component
  - Response: Single post object with category details
- **GET `/api/categories`** - Fetch all available categories
  - Called on PostForm component mount
  - Response: Array of category objects
- **POST `/api/posts`** - Create a new post
  - Requires: `title`, `content`, `category` (category ID)
  - Used by PostForm in create mode
- **PUT `/api/posts/:id`** - Update existing post
  - Requires: `title`, `content`, `category`
  - Used by PostForm in edit mode
- **DELETE `/api/posts/:id`** - Delete a post
  - Called from PostList when deleting posts

### Expected Post Object Structure

```javascript
{
  _id: "unique-id",
  title: "Post Title",
  content: "Post content/body",
  category: {
    _id: "category-id",
    name: "Category Name"
  },
  createdAt: "2025-11-15T...",
  updatedAt: "2025-11-15T..."
}
```

### Expected Category Object Structure

```javascript
{
  _id: "category-id",
  name: "Category Name"
}
```

### Making API Calls

Example usage in components:

```javascript
const api = useApi();
const data = await api.get("/api/posts");
const newPost = await api.post("/api/posts", { title: "...", content: "...", category: "id" });
const updated = await api.put(`/api/posts/${id}`, { title: "...", content: "...", category: "id" });
await api.del(`/api/posts/${id}`);
```

## 📝 Form Handling & Validation

### PostForm Features
- **Required Fields Validation**: Enforces title, content, and category selection
- **Async Form Submission**: Non-blocking form submission with loading state
- **Category Fetching**: Automatically loads categories on component mount
- **Edit Mode Detection**: Switches between "Create Post" and "Edit Post" modes
- **Error Display**: Shows user-friendly error messages on failed submissions
- **Button States**: Loading button prevents double-submissions
- **Pre-populated Fields**: When editing, form auto-fills with existing post data

### Creating a New Post
```jsx
<PostForm onSuccess={() => {
  // Refresh posts list or show confirmation
}} />
```

### Editing an Existing Post
```jsx
<PostForm 
  postToEdit={selectedPost}
  onSuccess={() => {
    // Refresh posts and close edit mode
  }}
/>
```

## 📝 Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Create optimized production build
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build locally

## 🔍 Code Quality

Linting is enforced using ESLint with React-specific rules:

```bash
npm run lint
```

Configuration includes:
- React Hook rules (`eslint-plugin-react-hooks`)
- React Refresh rules (`eslint-plugin-react-refresh`)
- JavaScript best practices

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vite.dev)
- [React Router](https://reactrouter.com)
- [React Context API](https://react.dev/reference/react/createContext)

## 📌 Notes

- This is the **client-side** application; a backend API is required to function
- The backend should expose all endpoints listed in the [API Integration](#-api-integration) section
- Ensure CORS is properly configured on the backend for client requests
- The application uses React Router v6+
- Categories must be created in the backend before they can be used in the form

## 🐛 Troubleshooting

### Issue: Posts not loading
- **Solution**: Verify the backend API is running and accessible at the configured URL
- Check browser console for fetch errors
- Ensure `/api/posts` endpoint returns proper JSON

### Issue: Categories not appearing in form
- **Solution**: Ensure `/api/categories` endpoint is accessible and returns an array
- Verify category objects have `_id` and `name` properties
- Check network tab in browser DevTools for failed requests

### Issue: Form submission fails
- **Solution**: Check that all required fields (title, content, category) are filled
- Verify category ID is valid (exists in database)
- Look for error messages displayed in the form
- Check backend logs for validation errors

### Issue: "Cannot read properties of undefined" error
- **Solution**: This usually indicates missing data from the API
- Verify API responses match expected object structure
- Check that optional fields like `category` are properly populated
- Ensure backend returns all required fields

## 🚀 Performance Optimization Tips

- Use lazy loading for image assets
- Consider pagination for large post lists
- Implement caching strategies for frequently accessed posts
- Optimize re-renders by memoizing components if needed
- Use React DevTools Profiler to identify bottlenecks

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
