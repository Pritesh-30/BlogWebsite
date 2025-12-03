# Code Documentation

This document provides detailed documentation for the key components of the blog website application, covering both frontend and backend code.

## Backend Documentation

### Server (backend/src/server.js)

The main entry point of the backend application that initializes the Express server, connects to the database, and sets up middleware and routes.

**Key Features:**
- Initializes Express application
- Connects to MongoDB using the database configuration
- Sets up CORS and JSON parsing middleware
- Registers API routes for blogs, authentication, and comments
- Starts the server on the specified port

### Database Configuration (backend/src/config/db.js)

Handles the MongoDB connection using Mongoose.

**Functions:**
- `connectDB()`: Asynchronous function that connects to MongoDB using the MONGO_URI environment variable and logs connection status

### Models

#### User Model (backend/src/models/User.js)

Defines the user schema and model for MongoDB.

**Schema Fields:**
- `username`: String - User's display name
- `email`: String (unique) - User's email address
- `password`: String - Hashed password
- `role`: String (default: "user") - User role (user or admin)

#### Blog Model (backend/src/models/Blog.js)

Defines the blog schema and model with support for rich content sections.

**Schema Fields:**
- `title`: String (required) - Blog post title
- `tags`: Array of Strings - Blog tags for categorization
- `twoLineDescription`: String - Brief description of the blog
- `thumbnailUrl`: String - URL to the blog's thumbnail image
- `contentSections`: Array of ContentSectionSchema - Rich content sections
- `author`: ObjectId (ref: "User") - Reference to the blog author
- `status`: String (enum: ["PENDING", "APPROVED"], default: "PENDING") - Approval status
- `createdAt`: Date (default: Date.now) - Creation timestamp

**ContentSectionSchema:**
Supports multiple content types:
- `paragraph`: Simple text content
- `subtopic`: Headings with level specification
- `image`: Images with captions and alt text
- `youtubeEmbed`: Embedded YouTube videos
- `bulletList`: Bullet point lists
- `codeSnippet`: Code with syntax highlighting

#### Comment Model (backend/src/models/Comment.js)

Defines the comment schema and model for blog post comments.

**Schema Fields:**
- `blog`: ObjectId (ref: "Blog", required) - Reference to the blog post
- `user`: ObjectId (ref: "User") - Reference to the commenting user
- `username`: String (required) - Username of the commenter
- `content`: String (required) - Comment content
- `parentComment`: ObjectId (ref: "Comment", default: null) - For nested replies
- `createdAt`: Date (default: Date.now) - Creation timestamp

### Controllers

#### Auth Controller (backend/src/controllers/authController.js)

Handles user authentication operations.

**Functions:**
- `registerUser(req, res)`: Registers a new user by hashing their password and saving to the database
- `loginUser(req, res)`: Authenticates a user by comparing passwords and generating a JWT token

#### Blog Controller (backend/src/controllers/blogController.js)

Manages all blog-related operations.

**Functions:**
- `getAllBlogs(req, res)`: Retrieves all approved blogs
- `getBlogById(req, res)`: Retrieves a specific blog by ID with author information
- `createBlog(req, res)`: Creates a new blog post with proper tag formatting
- `getPendingBlogs(req, res)`: Retrieves all pending blogs (admin only)
- `verifyBlog(req, res)`: Approves a pending blog (admin only)
- `editBlog(req, res)`: Updates an existing blog post
- `getUserBlogs(req, res)`: Retrieves blogs created by the authenticated user

#### Comment Controller (backend/src/controllers/commentController.js)

Handles comment operations.

**Functions:**
- `getBlogComments(req, res)`: Adds a new comment to a blog post
- `getCommentsByBlog(req, res)`: Retrieves all comments for a specific blog post

### Middleware

#### Auth Middleware (backend/src/middleware/authMiddleware.js)

Provides authentication and authorization functionality.

**Functions:**
- `protect(req, res, next)`: Verifies JWT token and attaches user information to the request
- `adminOnly(req, res, next)`: Ensures the user has admin role
- `isLoggedIn(req, res, next)`: Checks if user is authenticated

### Routes

#### Auth Routes (backend/src/routes/authRoutes.js)

Defines authentication-related API endpoints.

**Endpoints:**
- `POST /register`: Register a new user
- `POST /login`: Authenticate existing user

#### Blog Routes (backend/src/routes/blogRoutes.js)

Defines blog-related API endpoints.

**Endpoints:**
- `GET /`: Get all approved blogs
- `POST /`: Create a new blog (protected)
- `GET /myblogs`: Get current user's blogs (protected)
- `GET /admin/pending`: Get pending blogs (admin only)
- `PATCH /admin/:id/verify`: Approve a blog (admin only)
- `PUT /:id`: Edit a blog (protected)
- `GET /:id`: Get a specific blog

#### Comment Routes (backend/src/routes/commentRoutes.js)

Defines comment-related API endpoints.

**Endpoints:**
- `POST /:blogId`: Add a comment to a blog
- `GET /:blogId`: Get comments for a blog
- `DELETE /:id`: Delete a comment (admin only)

## Frontend Documentation

### Main Application (frontend/src/App.js)

The main React component that sets up routing and global components.

**Features:**
- Implements React Router for navigation
- Includes global components (Header, Footer)
- Sets up Toast notifications
- Integrates animated star background

### Components

#### Header (frontend/src/components/Header.jsx)

Navigation bar component with authentication status.

**Features:**
- Displays navigation links
- Shows user authentication status
- Provides login/logout functionality
- Responsive design

#### Footer (frontend/src/components/Footer.jsx)

Footer component with copyright information.

**Features:**
- Displays copyright notice
- Shows current year dynamically
- Links to social media (placeholder)

#### AuthCard (frontend/src/components/AuthCard.jsx)

Authentication component for login and registration.

**Features:**
- Toggle between login and registration forms
- Form validation
- API integration for authentication
- Error handling and user feedback

#### BlogCreator (frontend/src/components/BlogCreator.jsx)

Main blog creation component with rich content editing.

**Features:**
- Metadata input fields (title, tags, description)
- Thumbnail management (URL or file upload)
- Dynamic content section management
- Drag-and-drop reordering of sections
- Support for multiple content types:
  - Paragraphs
  - Subtopics
  - Images
  - YouTube videos
  - Bullet lists
  - Code snippets

#### SectionForm (frontend/src/components/SectionForm.jsx)

Form component for editing specific content sections.

**Features:**
- Type-specific input fields
- Dynamic rendering based on section type
- Update and remove functionality
- Validation for required fields

#### SectionPreview (frontend/src/components/SectionPreview.jsx)

Preview component for blog content before publishing.

**Features:**
- Renders content sections as they would appear in the final blog
- Supports all content types
- Responsive design
- Syntax highlighting for code snippets

### Pages

#### BlogList (frontend/src/pages/BlogList.jsx)

Homepage displaying all approved blog posts.

**Features:**
- Fetches and displays blog cards
- Responsive grid layout
- Navigation to blog details
- Tag display
- Thumbnail support

#### BlogDetails (frontend/src/pages/BlogDetails.jsx)

Detailed view of a specific blog post.

**Features:**
- Fetches and displays complete blog content
- Renders all content section types
- Comment system with posting functionality
- Syntax highlighting for code snippets
- Responsive design

#### CreateBlog (frontend/src/pages/CreateBlog.jsx)

Page for creating new blog posts.

**Features:**
- Editor and preview modes
- Blog metadata management
- Content section management
- Draft saving functionality
- Publishing workflow with image upload to Cloudinary

#### EditBlog (frontend/src/pages/EditBlog.jsx)

Page for editing existing blog posts.

**Features:**
- Loads existing blog data
- Same editing capabilities as CreateBlog
- Update functionality
- Image handling for existing content

#### MyBlogs (frontend/src/pages/MyBlogs.jsx)

Page displaying blogs created by the current user.

**Features:**
- Fetches user's blogs from the API
- Displays blogs in a card layout
- Edit and view functionality
- Status indicators (pending/approved)

### Styles

#### AuthCard.css

Styles for the authentication component.

**Features:**
- Card-based layout
- Form styling
- Responsive design
- Animation effects

#### BlogCreator.css

Styles for the blog creation interface.

**Features:**
- Section management UI
- Drag-and-drop styling
- Content type specific styles
- Responsive layout

#### BlogList.css

Styles for the blog listing page.

**Features:**
- Blog card design
- Tag styling
- Responsive grid
- Hover effects

#### CreateBlog.css

Styles for the blog creation page.

**Features:**
- Two-panel layout (editor/preview)
- Control panel styling
- Button styles
- Responsive design

#### Footer.css

Styles for the footer component.

**Features:**
- Simple, clean design
- Copyright styling
- Social media link styling

#### Header.css

Styles for the header component.

**Features:**
- Navigation bar design
- Logo styling
- Authentication status display
- Responsive menu

#### MyBlogs.css

Styles for the user's blogs page.

**Features:**
- Blog card layout
- Status indicators
- Action button styling
- Responsive design

#### SectionForm.css

Styles for the content section forms.

**Features:**
- Type-specific form layouts
- Input field styling
- Remove button styling
- Responsive design

## Environment Variables

### Backend (.env)

- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `PORT`: Server port (default: 5000)

### Frontend (.env)

- `REACT_APP_CLOUDINARY_URL`: Cloudinary upload endpoint
- `REACT_APP_BLOG_UPLOAD_PRESET`: Cloudinary unsigned upload preset

## API Integration

### Authentication

The frontend handles authentication by:
1. Sending credentials to `/api/auth/login`
2. Storing the returned JWT token in localStorage
3. Including the token in the Authorization header for protected requests
4. Handling token expiration and user logout

### Blog Operations

Blog operations include:
1. Fetching blog lists from `/api/blogs`
2. Creating blogs by POSTing to `/api/blogs`
3. Editing blogs by PUTing to `/api/blogs/:id`
4. Managing user blogs through `/api/blogs/myblogs`

### Comment System

Comment operations include:
1. Fetching comments from `/api/comments/:blogId`
2. Posting comments to `/api/comments/:blogId`

## State Management

The application uses React's built-in state management:
- `useState` for component-level state
- `useEffect` for side effects and data fetching
- `useNavigate` for programmatic navigation
- `localStorage` for persisting authentication tokens

## Error Handling

Error handling strategies include:
- Try-catch blocks for API calls
- User-friendly error messages with Toast notifications
- Form validation with appropriate feedback
- Graceful degradation for failed operations

## Performance Considerations

Performance optimizations include:
- Code splitting with React.lazy (potential for future implementation)
- Efficient re-rendering with proper state management
- Image optimization through Cloudinary
- Responsive design for all device sizes

This documentation provides a comprehensive overview of the codebase structure, component functionality, and implementation details for both frontend and backend of the blog website application.