# Task Management Dashboard

A complete full-stack task management application built with React.js, Redux Toolkit, Node.js, Express.js, and MongoDB.

## 🚀 Tech Stack

### Frontend
- **React.js** (Functional Components + Hooks)
- **Redux Toolkit** (State Management)
- **Tailwind CSS** (Styling)
- **Axios** (HTTP Client)
- **React Router** (Navigation)

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **CORS** (Cross-Origin Resource Sharing)
- **dotenv** (Environment Variables)

## ✨ Features

- ✅ **Task Management**: Create, read, update, delete tasks
- ✅ **Status Toggle**: Mark tasks as Pending/Completed
- ✅ **Real-time Updates**: Instant UI updates without refresh
- ✅ **Search Functionality**: Search tasks by title
- ✅ **Filter Tasks**: Filter by All, Completed, Pending
- ✅ **Light/Dark Theme**: Toggle between themes with persistence
- ✅ **Responsive Design**: Mobile and desktop optimized
- ✅ **Error Handling**: Comprehensive error management
- ✅ **Loading States**: User feedback during operations

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### 1. Clone and Install Dependencies
```bash
git clone <repository-url>
cd task-management-dashboard
npm run install-deps
```

### 2. Environment Setup
Create `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanagement
NODE_ENV=development
```

### 3. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For local MongoDB
mongod
```

### 4. Run the Application

#### Option A: Using npm (Development)
```bash
# Run both frontend and backend concurrently
npm run dev
```

Or run separately:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

#### Option B: Using Docker (Recommended)

**Development Mode:**
```bash
# Start all services in development mode
docker-compose --profile dev up -d

# View logs
docker-compose logs -f
```

**Production Mode:**
```bash
# Start all services in production mode
docker-compose --profile prod up -d
```

**With Nginx Reverse Proxy:**
```bash
# Start with nginx reverse proxy
docker-compose --profile prod-nginx up -d
```

### 5. Access the Application
- **Frontend**: http://localhost:3000 (development) or http://localhost:80 (production)
- **Backend API**: http://localhost:5000

## 🐳 Docker Commands

```bash
# Development
docker-compose --profile dev up -d          # Start development environment
docker-compose --profile dev down           # Stop development environment

# Production
docker-compose --profile prod up -d         # Start production environment
docker-compose --profile prod down          # Stop production environment

# View logs
docker-compose logs -f [service-name]       # View logs for specific service
docker-compose logs -f                      # View all logs

# Rebuild services
docker-compose build                        # Rebuild all services
docker-compose build [service-name]         # Rebuild specific service
```

## 📁 Project Structure

```
task-management-dashboard/
├── frontend/                 # React.js Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── redux/           # Redux store and slices
│   │   ├── services/        # API service functions
│   │   ├── hooks/           # Custom React hooks
│   │   └── utils/           # Utility functions
│   └── package.json
├── backend/                 # Node.js Backend
│   ├── controllers/         # Route controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── config/             # Configuration files
│   └── server.js           # Entry point
└── README.md
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

## 🧪 Testing (Optional)

```bash
# Run frontend tests
cd frontend
npm test

# Run backend tests
cd backend
npm test
```

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
cd frontend
npm run build
# Deploy the build folder
```

### Backend (Heroku/Railway)
```bash
cd backend
# Follow platform-specific deployment instructions
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Developer Notes

This application demonstrates:
- Modern React patterns with hooks and functional components
- Redux Toolkit for efficient state management
- RESTful API design with Express.js
- MongoDB integration with Mongoose
- Responsive design with Tailwind CSS
- Error handling and loading states
- Theme management with localStorage persistence

Perfect for showcasing full-stack development skills in technical interviews.