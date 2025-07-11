# MERN Memories Project

A full-stack social media application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that allows users to create, share, and interact with memories.

## Features

- **User Authentication**: Sign up, sign in, and Google OAuth integration
- **CRUD Operations**: Create, read, update, and delete memories
- **Real-time Interactions**: Like, comment, and share posts
- **Search & Filter**: Search posts by title, tags, or creator
- **Pagination**: Browse through memories with pagination
- **Responsive Design**: Works on desktop and mobile devices
- **File Upload**: Upload images for memories
- **Tag System**: Add tags to categorize memories
- **User Profiles**: View user-specific posts

## Tech Stack

### Frontend
- React.js 16.12.0
- Redux for state management
- Material-UI for components
- React Router for navigation
- Axios for API calls
- JWT for authentication

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project_mern_memories
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the server directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

## Available Scripts

- `npm run dev` - Start both client and server in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend development server
- `npm run build` - Build the React app for production
- `npm run test` - Run server tests

## Project Structure

```
project_mern_memories/
├── client/                 # React frontend
│   ├── public/            # Static files
│   └── src/
│       ├── actions/       # Redux actions
│       ├── components/    # React components
│       ├── reducers/      # Redux reducers
│       └── api/          # API configuration
├── server/                # Node.js backend
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   └── test/            # Test files
└── README.md
```

## API Endpoints

### Authentication
- `POST /user/signin` - User sign in
- `POST /user/signup` - User sign up
- `POST /user/google` - Google OAuth

### Posts
- `GET /posts` - Get all posts
- `POST /posts` - Create a new post
- `PATCH /posts/:id` - Update a post
- `DELETE /posts/:id` - Delete a post
- `PATCH /posts/:id/likePost` - Like/unlike a post
- `POST /posts/:id/commentPost` - Comment on a post

## Deployment

### Frontend (React)
The React app can be deployed to platforms like:
- Netlify
- Vercel
- GitHub Pages

### Backend (Node.js)
The Express server can be deployed to:
- Heroku
- Railway
- Render
- DigitalOcean

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
