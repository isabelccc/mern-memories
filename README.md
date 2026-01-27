# 🎨 MERN Memories - Social Media Platform

> A modern, full-stack social media application built with the MERN stack that enables users to create, share, and interact with memories through a beautiful, responsive interface.

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-green.svg)](https://www.mongodb.com/mern-stack)
[![React](https://img.shields.io/badge/React-17.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.6-brightgreen.svg)](https://www.mongodb.com/)

---

## ✨ What Makes This Project Unique

### 🛡️ Advanced Content Moderation
- **Dual Profanity Filtering System**: Implements both `bad-words` and `mint-filter` libraries for comprehensive content filtering
- **Real-time Content Sanitization**: Automatically cleans titles, messages, and comments before storage
- **Customizable Blacklist**: Easy-to-extend word filtering system for community safety

### 🔐 Robust Authentication & Security
- **Dual Authentication Methods**: JWT-based authentication + Google OAuth integration
- **Password Security**: bcryptjs hashing with salt rounds
- **API Rate Limiting**: Express rate limiting (100 requests per 15 minutes) to prevent abuse
- **Large File Support**: Handles image uploads up to 30MB with optimized processing

### 🎯 Advanced Features
- **Gravatar Integration**: Automatic avatar generation from email addresses
- **Comment Management**: Full CRUD operations on comments with ownership verification
- **Smart Search**: Multi-criteria search by title, tags, or creator name
- **Tag-based Organization**: Categorize and filter memories using custom tags
- **Pagination**: Efficient memory browsing with server-side pagination (8 posts per page)
- **Creator Profiles**: Dedicated user profile pages showcasing their memories

### 🏗️ Modern Architecture
- **Redux State Management**: Centralized state with Redux Thunk for async operations
- **RESTful API Design**: Clean, well-structured Express.js backend
- **Component-based UI**: Modular React components with Material-UI design system
- **ES6+ Modules**: Modern JavaScript with ES modules throughout

---

## 🚀 Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 17.0.2 | UI library for building interactive interfaces |
| **Redux** | 4.2.1 | Predictable state container for JavaScript apps |
| **Redux Thunk** | 2.4.2 | Middleware for async Redux actions |
| **Material-UI** | 4.12.4 | React component library following Material Design |
| **React Router** | 6.20.1 | Declarative routing for React applications |
| **Axios** | 1.6.2 | Promise-based HTTP client for API requests |
| **JWT Decode** | 4.0.0 | Decode JSON Web Tokens in the browser |
| **Gravatar** | 1.8.2 | Generate user avatars from email addresses |
| **Moment.js** | 2.30.1 | Parse, validate, manipulate, and display dates |
| **React Google Login** | 5.2.2 | Google OAuth 2.0 authentication component |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime environment |
| **Express.js** | 4.18.2 | Fast, unopinionated web framework |
| **MongoDB** | 7.6.3 | NoSQL database for flexible data storage |
| **Mongoose** | 7.6.3 | MongoDB object modeling for Node.js |
| **JWT** | 9.0.2 | JSON Web Token for secure authentication |
| **bcryptjs** | 2.4.3 | Password hashing library |
| **Express Rate Limit** | 7.1.5 | Basic rate-limiting middleware |
| **bad-words** | 3.0.4 | Profanity filter library |
| **mint-filter** | 4.0.3 | Advanced text filtering library |
| **CORS** | 2.8.5 | Cross-Origin Resource Sharing middleware |

### Development Tools
- **Concurrently**: Run multiple commands concurrently
- **Nodemon**: Auto-restart server during development
- **Jest**: JavaScript testing framework
- **ESLint**: Code linting and quality assurance

---

## 📋 Features

### User Authentication
- ✅ User registration with email/password
- ✅ Secure login with JWT tokens
- ✅ Google OAuth 2.0 integration
- ✅ Protected routes and API endpoints
- ✅ Session persistence with localStorage

### Memory Management
- ✅ Create, read, update, and delete memories
- ✅ Rich text posts with image uploads
- ✅ Tag-based categorization
- ✅ Image upload support (up to 30MB)
- ✅ Base64 image encoding for storage

### Social Interactions
- ✅ Like/unlike posts (toggle functionality)
- ✅ Comment on posts with real-time updates
- ✅ Edit and delete own comments
- ✅ View user profiles and their memories
- ✅ Search memories by creator

### Discovery & Navigation
- ✅ Advanced search by title, tags, or creator
- ✅ Filter posts by specific tags
- ✅ Pagination (8 posts per page)
- ✅ Sort posts by creation date (newest first)
- ✅ Responsive design for all devices

### Content Safety
- ✅ Automatic profanity filtering (dual system)
- ✅ Content sanitization on create/update
- ✅ Customizable word blacklist
- ✅ API rate limiting protection

---

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** v14 or higher (v18+ recommended)
- **npm** or **yarn** package manager
- **MongoDB** (local installation or MongoDB Atlas account)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd mern-memories
```

### Step 2: Install Dependencies
Install all dependencies for root, server, and client:
```bash
npm run install-all
```

Or install manually:
```bash
npm install                    # Root dependencies
cd server && npm install       # Backend dependencies
cd ../client && npm install    # Frontend dependencies
```

### Step 3: Environment Configuration
Create a `.env` file in the `server` directory:
```env
# MongoDB Connection
# Local: mongodb://localhost:27017/memories
# Atlas: mongodb+srv://username:password@cluster.mongodb.net/memories
MONGODB_URI=mongodb://localhost:27017/memories

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_min_32_characters

# Google OAuth (optional - for Google sign-in)
# Get from: https://console.cloud.google.com/
GOOGLE_CLIENT_ID=your_google_client_id_here

# Server Port (optional - defaults to 5000)
PORT=5000
```

### Step 4: Start Development Servers
Run both frontend and backend concurrently:
```bash
npm run dev
```

This starts:
- **Backend Server**: `http://localhost:5000`
- **Frontend Dev Server**: `http://localhost:3000`

Or run separately:
```bash
npm run server    # Backend only (port 5000)
npm run client    # Frontend only (port 3000)
```

---

## 📜 Available Scripts

### Root Level
| Command | Description |
|---------|-------------|
| `npm run dev` | Start both client and server in development mode |
| `npm run server` | Start only the backend server |
| `npm run client` | Start only the frontend development server |
| `npm run build` | Build the React app for production |
| `npm run test` | Run server-side tests with Jest |
| `npm run install-all` | Install all dependencies (root, server, client) |

### Client Scripts
| Command | Description |
|---------|-------------|
| `npm start` | Start React development server |
| `npm run build` | Create production build |
| `npm test` | Run React component tests |

### Server Scripts
| Command | Description |
|---------|-------------|
| `npm start` | Start Express server with nodemon |
| `npm test` | Run Jest tests in watch mode |

---

## 🌐 API Endpoints

### Authentication Routes (`/user`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/user/signup` | Register a new user | ❌ |
| `POST` | `/user/signin` | Login existing user | ❌ |
| `POST` | `/user/google` | Google OAuth authentication | ❌ |

### Post Routes (`/posts`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/posts` | Get paginated posts | ❌ |
| `GET` | `/posts/search` | Search posts by query/tags | ❌ |
| `GET` | `/posts/creator` | Get posts by creator name | ❌ |
| `GET` | `/posts/:id` | Get single post by ID | ❌ |
| `POST` | `/posts` | Create a new post | ✅ |
| `PATCH` | `/posts/:id` | Update a post | ✅ |
| `DELETE` | `/posts/:id` | Delete a post | ✅ |
| `PATCH` | `/posts/:id/likePost` | Like/unlike a post | ✅ |
| `POST` | `/posts/:id/commentPost` | Add comment to post | ✅ |
| `PATCH` | `/posts/:id/:commentId/editComment` | Edit a comment | ✅ |
| `DELETE` | `/posts/:id/:commentId/deleteComment` | Delete a comment | ✅ |

**Note**: All authenticated routes require a valid JWT token in the `Authorization` header.

---

## 📁 Project Structure

```
mern-memories/
├── client/                      # React Frontend Application
│   ├── public/                  # Static assets
│   │   ├── index.html          # HTML template
│   │   ├── _redirects          # Netlify redirects config
│   │   └── memories.png        # App icon
│   └── src/
│       ├── actions/             # Redux action creators
│       │   ├── auth.js         # Authentication actions
│       │   └── posts.js        # Post-related actions
│       ├── api/                # API configuration
│       │   └── index.js        # Axios setup & interceptors
│       ├── components/         # React components
│       │   ├── Auth/           # Authentication UI
│       │   ├── CreatorOrTag/   # Filtered post views
│       │   ├── Form/           # Post creation/editing
│       │   ├── Home/           # Main feed page
│       │   ├── Navbar/         # Navigation bar
│       │   ├── Pagination.jsx  # Pagination component
│       │   ├── PostDetails/   # Single post view
│       │   ├── Posts/          # Post list components
│       │   └── Profile/       # User profile page
│       ├── constants/          # Application constants
│       │   └── actionTypes.js  # Redux action type definitions
│       ├── images/             # Static images
│       ├── reducers/           # Redux reducers
│       │   ├── auth.js        # Auth state management
│       │   ├── index.js       # Root reducer
│       │   └── posts.js       # Posts state management
│       ├── utils/              # Utility functions
│       │   └── gravatar.js    # Gravatar URL generator
│       ├── App.js             # Main App component
│       ├── index.js           # React entry point
│       └── index.css          # Global styles
│
├── server/                     # Node.js Backend API
│   ├── controllers/            # Route controllers (business logic)
│   │   ├── posts.js           # Post CRUD operations
│   │   └── user.js            # User authentication logic
│   ├── middleware/            # Custom Express middleware
│   │   └── auth.js            # JWT authentication middleware
│   ├── models/                # MongoDB schemas
│   │   ├── postMessage.js     # Post model with comments
│   │   └── user.js            # User model
│   ├── routes/                # API route definitions
│   │   ├── posts.js           # Post endpoints
│   │   └── user.js            # User endpoints
│   ├── test/                  # Test files
│   │   ├── posts.test.js      # Post controller tests
│   │   └── user.test.js       # User controller tests
│   ├── index.js               # Express server entry point
│   ├── env.example            # Environment variables template
│   └── package.json           # Backend dependencies
│
├── package.json                # Root package.json with scripts
├── setup.sh                   # Unix/Linux setup script
├── setup.bat                  # Windows setup script
└── README.md                  # This file
```

---

## 🚢 Deployment

### Frontend Deployment (React)
The React app can be deployed to static hosting platforms:

**Netlify** (Recommended)
1. Build the app: `npm run build`
2. Deploy the `client/build` folder
3. Configure redirects in `client/public/_redirects`

**Vercel**
```bash
cd client
vercel --prod
```

**Other Options**: GitHub Pages, AWS S3, Firebase Hosting

### Backend Deployment (Node.js)
Deploy the Express server to platforms supporting Node.js:

**Render** (Recommended)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

**Railway**
```bash
railway up
```

**Other Options**: Heroku, DigitalOcean, AWS EC2, Google Cloud Run

### Environment Variables for Production
Ensure all environment variables are set in your hosting platform:
- `MONGODB_URI`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID` (if using Google OAuth)
- `PORT` (usually auto-set by platform)

### CORS Configuration
Update the frontend API base URL in `client/src/api/index.js` to point to your production backend URL.

---

## 🧪 Testing

Run the test suite:
```bash
npm run test
```

The server includes Jest tests for:
- User authentication
- Post CRUD operations
- API endpoint validation

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and patterns
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

---

## 📝 License

This project is licensed under the **ISC License**.

---

## 🙏 Acknowledgments

- Material-UI team for the excellent component library
- MongoDB for the flexible database solution
- React team for the powerful UI framework
- All open-source contributors whose packages made this project possible

---

## 📞 Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

---

**Built with ❤️ using the MERN Stack**
