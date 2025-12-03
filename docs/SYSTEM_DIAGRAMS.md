# System Diagrams

This document contains various diagrams that illustrate the architecture, data flow, and component relationships of the blog website application.

## 1. System Architecture Diagram

```mermaid
graph TD
    A[Web Browser] --> B[React Frontend]
    B --> C[Express Backend]
    C --> D[MongoDB Database]
    C --> E[Cloudinary CDN]
    B --> E
```

## 2. Backend Component Architecture

```mermaid
graph TD
    A[server.js] --> B[Express App]
    A --> C[Database Connection]
    B --> D[Middleware]
    B --> E[Routes]
    D --> F[CORS]
    D --> G[JSON Parser]
    D --> H[Auth Middleware]
    E --> I[Auth Routes]
    E --> J[Blog Routes]
    E --> K[Comment Routes]
    I --> L[Auth Controller]
    J --> M[Blog Controller]
    K --> N[Comment Controller]
    L --> O[User Model]
    M --> P[Blog Model]
    N --> Q[Comment Model]
```

## 3. Frontend Component Architecture

```mermaid
graph TD
    A[App.js] --> B[BrowserRouter]
    A --> C[Header]
    A --> D[Footer]
    B --> E[Routes]
    E --> F[Route /]
    E --> G[Route /create]
    E --> H[Route /login]
    E --> I[Route /blogs/:id]
    E --> J[Route /blogs/edit/:id]
    E --> K[Route /myblogs]
    F --> L[BlogList]
    G --> M[CreateBlog]
    H --> N[AuthCard]
    I --> O[BlogDetails]
    J --> P[EditBlog]
    K --> Q[MyBlogs]
    M --> R[BlogCreator]
    M --> S[SectionPreview]
    R --> T[SectionForm]
    R --> U[DragDropContext]
```

## 4. Database Schema Relationships

```mermaid
erDiagram
    USER ||--o{ BLOG : creates
    USER ||--o{ COMMENT : writes
    BLOG ||--o{ COMMENT : has
    COMMENT }|--|| COMMENT : replies_to

    USER {
        string _id
        string username
        string email
        string password
        string role
    }

    BLOG {
        string _id
        string title
        string[] tags
        string twoLineDescription
        string thumbnailUrl
        ContentSection[] contentSections
        ObjectId author
        string status
        date createdAt
    }

    COMMENT {
        string _id
        ObjectId blog
        ObjectId user
        string username
        string content
        ObjectId parentComment
        date createdAt
    }
```

## 5. User Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant D as Database

    U->>F: Enter credentials
    F->>B: POST /api/auth/login
    B->>D: Query user by email
    D-->>B: Return user data
    B->>B: Compare password with hash
    B->>B: Generate JWT token
    B-->>F: Return token and user data
    F->>F: Store token in localStorage
    F-->>U: Redirect to dashboard
```

## 6. Blog Creation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant D as Database
    participant C as Cloudinary

    U->>F: Create blog content
    F->>F: Preview blog
    U->>F: Click publish
    F->>B: POST /api/blogs with token
    B->>B: Validate token
    B->>C: Upload images to Cloudinary
    C-->>B: Return image URLs
    B->>D: Save blog with image URLs
    D-->>B: Return saved blog
    B-->>F: Return success response
    F-->>U: Show success message and redirect
```

## 7. Blog Display Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant D as Database

    U->>F: Navigate to blog list
    F->>B: GET /api/blogs
    B->>D: Query approved blogs
    D-->>B: Return blog data
    B-->>F: Return blog list
    F->>F: Render blog cards
    U->>F: Click on blog card
    F->>B: GET /api/blogs/:id
    B->>D: Query specific blog
    D-->>B: Return blog data
    B-->>F: Return blog data
    F->>F: Render blog details
    F-->>U: Display blog content
```

## 8. Comment System Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant D as Database

    U->>F: Submit comment
    F->>B: POST /api/comments/:blogId
    B->>D: Save comment
    D-->>B: Return saved comment
    B-->>F: Return comment data
    F->>F: Update comment list
    F-->>U: Display new comment
```

## 9. Data Flow in Blog Creator

```mermaid
graph LR
    A[User Input] --> B[BlogCreator State]
    B --> C[Section Management]
    C --> D[Add Section]
    C --> E[Update Section]
    C --> F[Remove Section]
    C --> G[Reorder Sections]
    D --> H[Content Sections Array]
    E --> H
    F --> H
    G --> H
    H --> I[Preview Generation]
    H --> J[API Submission]
```

## 10. Deployment Architecture

```mermaid
graph TD
    A[Internet Users] --> B[Load Balancer]
    B --> C[Web Server 1]
    B --> D[Web Server 2]
    B --> E[Web Server 3]
    C --> F[MongoDB Cluster]
    D --> F
    E --> F
    C --> G[Cloudinary CDN]
    D --> G
    E --> G
```

## 11. Folder Structure Visualization

```mermaid
graph TD
    A[BLOG_website] --> B[backend]
    A --> C[frontend]
    A --> D[Documentation]
    
    B --> B1[src]
    B --> B2[config]
    B --> B3[controllers]
    B --> B4[middleware]
    B --> B5[models]
    B --> B6[routes]
    B --> B7[server.js]
    
    B1 --> B1A[config]
    B1 --> B1B[controllers]
    B1 --> B1C[middleware]
    B1 --> B1D[models]
    B1 --> B1E[routes]
    B1 --> B1F[server.js]
    
    C --> C1[public]
    C --> C2[src]
    C --> C3[Styles]
    C --> C4[components]
    C --> C5[pages]
    
    C2 --> C2A[Styles]
    C2 --> C2B[components]
    C2 --> C2C[pages]
```

## 12. API Endpoint Structure

```mermaid
graph TD
    A[API Endpoints] --> B[Auth]
    A --> C[Blogs]
    A --> D[Comments]
    
    B --> B1[POST /api/auth/register]
    B --> B2[POST /api/auth/login]
    
    C --> C1[GET /api/blogs]
    C --> C2[POST /api/blogs]
    C --> C3[GET /api/blogs/myblogs]
    C --> C4[GET /api/blogs/admin/pending]
    C --> C5[PATCH /api/blogs/admin/:id/verify]
    C --> C6[PUT /api/blogs/:id]
    C --> C7[GET /api/blogs/:id]
    
    D --> D1[POST /api/comments/:blogId]
    D --> D2[GET /api/comments/:blogId]
```

These diagrams provide a visual representation of the blog website's architecture, data flows, and component relationships, helping to understand how different parts of the system interact with each other.