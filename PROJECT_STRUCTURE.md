# Project Structure

## Overview
This is a complete MERN stack application with the following structure:

```
project_mern_memories/
├── client/                     # React Frontend
│   ├── public/                # Static files
│   │   ├── index.html        # Main HTML file
│   │   ├── _redirects        # Netlify redirects
│   │   └── memories.png      # App icon
│   ├── src/
│   │   ├── actions/          # Redux actions
│   │   │   ├── auth.js       # Authentication actions
│   │   │   └── posts.js      # Posts actions
│   │   ├── api/              # API configuration
│   │   │   └── index.js      # Axios setup and API calls
│   │   ├── components/       # React components
│   │   │   ├── Auth/         # Authentication components
│   │   │   ├── CreatorOrTag/ # User/Tag specific posts
│   │   │   ├── Form/         # Post creation/editing form
│   │   │   ├── Home/         # Main home page
│   │   │   ├── Navbar/       # Navigation component
│   │   │   ├── Pagination.jsx # Pagination component
│   │   │   ├── PostDetails/  # Individual post view
│   │   │   └── Posts/        # Posts list components
│   │   ├── constants/        # Redux action types
│   │   │   └── actionTypes.js
│   │   ├── images/           # Static images
│   │   ├── reducers/         # Redux reducers
│   │   │   ├── auth.js       # Authentication reducer
│   │   │   ├── index.js      # Root reducer
│   │   │   └── posts.js      # Posts reducer
│   │   ├── App.js            # Main App component
│   │   ├── index.js          # React entry point
│   │   ├── index.css         # Global styles
│   │   └── styles.js         # Material-UI theme
│   └── package.json          # Frontend dependencies
├── server/                    # Node.js Backend
│   ├── controllers/          # Route controllers
│   │   ├── posts.js          # Posts CRUD operations
│   │   └── user.js           # User authentication
│   ├── middleware/           # Custom middleware
│   │   └── auth.js           # JWT authentication middleware
│   ├── models/               # MongoDB models
│   │   ├── postMessage.js    # Post schema
│   │   └── user.js           # User schema
│   ├── routes/               # API routes
│   │   ├── posts.js          # Posts endpoints
│   │   └── user.js           # User endpoints
│   ├── test/                 # Test files
│   │   ├── posts.test.js     # Posts tests
│   │   ├── user.test.js      # User tests
│   │   └── sum.test.js       # Example tests
│   ├── .babelrc             # Babel configuration
│   ├── .Procfile            # Heroku deployment
│   ├── env.example          # Environment variables example
│   ├── index.js             # Server entry point
│   └── package.json         # Backend dependencies
├── setup.sh                 # Unix/Linux setup script
├── setup.bat               # Windows setup script
├── package.json             # Root package.json
├── README.md               # Project documentation
└── PROJECT_STRUCTURE.md    # This file
```

## Key Features by Directory

### Client Features
- **Authentication**: Google OAuth, JWT-based auth
- **Posts Management**: CRUD operations, likes, comments
- **Search & Filter**: By title, tags, creator
- **Pagination**: Browse through posts
- **Responsive Design**: Material-UI components

### Server Features
- **RESTful API**: Express.js with proper routing
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens, bcrypt password hashing
- **Rate Limiting**: API protection
- **Testing**: Jest test suite
- **Content Filtering**: Bad words filtering

## File Descriptions

### Frontend Key Files
- `App.js`: Main React component with routing
- `api/index.js`: Axios configuration and API calls
- `actions/`: Redux actions for state management
- `reducers/`: Redux reducers for state updates
- `components/`: Reusable React components

### Backend Key Files
- `index.js`: Express server setup and configuration
- `controllers/`: Business logic for API endpoints
- `models/`: MongoDB schemas and models
- `routes/`: API route definitions
- `middleware/`: Custom Express middleware

## Development Workflow

1. **Setup**: Run `./setup.sh` (Unix) or `setup.bat` (Windows)
2. **Environment**: Configure `server/.env` with your MongoDB URI
3. **Development**: Run `npm run dev` to start both servers
4. **Testing**: Run `npm run test` for server tests
5. **Build**: Run `npm run build` for production build

## Deployment

### Frontend
- Build with `npm run build`
- Deploy to Netlify, Vercel, or similar

### Backend
- Configure environment variables
- Deploy to Heroku, Railway, or similar
- Update client proxy URL for production 