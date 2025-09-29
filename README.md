# MERN Stack Demo Application

A simple demonstration of a MERN (MongoDB, Express.js, React, Node.js) stack application with a clean, modern UI built using Tailwind CSS and Headless UI.

## Project Structure

```
Connect/
├── client/                 # React frontend application
│   ├── public/            # Static assets
│   ├── src/               # React source code
│   │   ├── components/    # Reusable React components
│   │   ├── App.js         # Main App component
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Tailwind CSS imports
│   ├── package.json       # Client dependencies
│   ├── tailwind.config.js # Tailwind configuration
│   └── postcss.config.js  # PostCSS configuration
├── server/                # Express backend application
│   ├── src/               # Server source code
│   │   └── index.js       # Express server entry point
│   ├── package.json       # Server dependencies
│   └── .env.example       # Environment variables template
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## Features

- **Backend**: Express.js server with MongoDB connection
- **Frontend**: React application with Tailwind CSS styling
- **API**: RESTful API endpoint at `/api/data`
- **UI**: Modern, responsive design with loading states and error handling
- **Proxy**: Automatic API request proxying from client to server

## Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally on port 27017)
- npm or yarn package manager

## Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd /Users/evanpalmer/Documents/Stripe/Projects/Code/Demo/Connect
   ```

2. **Install server dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies:**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables:**
   ```bash
   cd ../server
   cp .env.example .env
   ```
   
   Edit the `.env` file if needed (default MongoDB URI should work for local development).

## Running the Application

The application requires two separate terminal windows - one for the server and one for the client.

### Terminal 1: Start the Server

```bash
cd server
npm run dev
```

The server will start on `http://localhost:5000` and automatically connect to MongoDB.

### Terminal 2: Start the Client

```bash
cd client
npm start
```

The React application will start on `http://localhost:3000` and automatically open in your browser.

## API Endpoints

- `GET /api/data` - Returns a JSON object with a message, timestamp, and status
- `GET /api/health` - Health check endpoint

## Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Headless UI** - Unstyled, accessible UI components
- **React Scripts** - Build tooling

## Development

- The server uses `nodemon` for automatic restarts during development
- The client uses React's development server with hot reloading
- API requests from the client are automatically proxied to the server
- Tailwind CSS is configured for utility-first styling

## Troubleshooting

1. **MongoDB Connection Issues**: Ensure MongoDB is running locally on port 27017
2. **Port Conflicts**: If port 5000 or 3000 are in use, you can change them in the respective configuration files
3. **Dependencies**: Make sure all dependencies are installed in both client and server directories

## Next Steps

This is a basic MERN stack setup. You can extend it by:
- Adding more API endpoints
- Implementing user authentication
- Adding data models and CRUD operations
- Implementing real-time features with Socket.io
- Adding testing with Jest and React Testing Library

## Todo List

### All
- [ ] Add a default for the database - should auto pull up users table
- [ ] Add a webhook for successful onboarding
- [ ] Add different payment flows
- [ ] Add a CMS
- [ ] Inline Fix styles
