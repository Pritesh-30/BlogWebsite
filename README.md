# Dev-Diaries
<img width="1024" height="490" alt="image" src="https://github.com/user-attachments/assets/b66430a8-b378-4b62-b583-f23b6ee2cd1e" />


A full-stack blog platform built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring rich content creation, user authentication, and admin approval workflows.

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: Register and login functionality with JWT tokens
- **Rich Content Creation**: Create blog posts with multiple content types:
  - Text paragraphs
  - Subtopics with heading levels
  - Images with captions
  - YouTube video embeds
  - Bullet lists
  - Code snippets with syntax highlighting
- **Drag-and-Drop Editor**: Reorder content sections with intuitive drag-and-drop
- **Admin Approval Workflow**: Blog posts require admin approval before publication
- **Comment System**: Readers can comment on blog posts
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Dark theme with animated star background

## Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - Object Data Modeling (ODM) library
- **JWT** - Authentication tokens
- **Bcrypt.js** - Password hashing
- **Cors** - Cross-Origin Resource Sharing

### Frontend
- **React** - Frontend library
- **React Router** - Routing library
- **React Toastify** - Notifications
- **React Syntax Highlighter** - Code snippet highlighting
- **React Star Sky** - Animated background
- **@hello-pangea/dnd** - Drag and drop functionality
- **Lucide React** - Icon library

## Architecture

```
┌─────────────────┐    HTTP Requests    ┌──────────────────┐
│   React Frontend│ ──────────────────→ │  Express Backend │
│   (Port 3000)   │ ←────────────────── │   (Port 5000)    │
└─────────────────┘                     └──────────────────┘
                                                  │
                                                  ▼
                                          ┌───────────────┐
                                          │ MongoDB Atlas │
                                          └───────────────┘
```

The application follows a client-server architecture with a React frontend communicating with a Node.js/Express backend through RESTful APIs. MongoDB serves as the database with Mongoose as the ODM.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- Cloudinary account (for image hosting)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd BLOG_website
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

## Environment Variables

### Backend (.env file in backend directory)
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### Frontend (.env file in frontend directory)
```env
REACT_APP_CLOUDINARY_URL=your_cloudinary_upload_url
REACT_APP_BLOG_UPLOAD_PRESET=your_cloudinary_unsigned_preset
```

## Running the Application

### Backend
```bash
cd backend
npm start
# or for development with auto-reload
npm run dev
```

### Frontend
```bash
cd frontend
npm start
```

The backend will run on http://localhost:5000 and the frontend on http://localhost:3000.

## Project Structure

```
BLOG_website/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   └── server.js        # Entry point
│   ├── .env                 # Environment variables
│   └── package.json         # Backend dependencies
└── frontend/
    ├── public/              # Static assets
    ├── src/
    │   ├── Styles/          # CSS stylesheets
    │   ├── components/      # React components
    │   ├── pages/           # Page components
    │   ├── App.js           # Main app component
    │   └── index.js         # Entry point
    ├── .env                 # Environment variables
    └── package.json         # Frontend dependencies
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login existing user

### Blogs
- `GET /api/blogs` - Get all approved blogs
- `POST /api/blogs` - Create a new blog (protected)
- `GET /api/blogs/myblogs` - Get current user's blogs (protected)
- `GET /api/blogs/admin/pending` - Get pending blogs (admin only)
- `PATCH /api/blogs/admin/:id/verify` - Approve a blog (admin only)
- `PUT /api/blogs/:id` - Edit a blog (protected)
- `GET /api/blogs/:id` - Get a specific blog

### Comments
- `POST /api/comments/:blogId` - Add a comment to a blog
- `GET /api/comments/:blogId` - Get comments for a blog

## Database Schema

### User
```javascript
{
  username: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" }
}
```

### Blog
```javascript
{
  title: { type: String, required: true },
  tags: [String],
  twoLineDescription: { type: String },
  thumbnailUrl: { type: String },
  contentSections: [ContentSectionSchema],
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["PENDING", "APPROVED"], default: "PENDING" },
  createdAt: { type: Date, default: Date.now }
}
```

### Comment
```javascript
{
  blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  username: { type: String, required: true },
  content: { type: String, required: true },
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
  createdAt: { type: Date, default: Date.now }
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

