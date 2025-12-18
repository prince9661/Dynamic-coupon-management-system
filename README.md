# Dynamic Coupon Management System

A complete, production-ready full-stack web application for managing dynamic coupons in an online store. Built with Node.js, Express, React, MongoDB, Socket.IO, and Redux.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Syllabus Coverage](#syllabus-coverage)

## 🎯 Project Overview

This system allows:
- **Admins** to create, update, activate/deactivate coupons
- **Coupons** to belong to campaigns
- **Real-time tracking** of coupon usage
- **Prevention of overuse** based on rules (expiry, max usage)
- **Users** to apply coupons at checkout
- **Real-time updates** when coupons are used
- **Secure session-based authentication**
- **REST API + WebSocket** communication

## ✨ Features

- ✅ Complete CRUD operations for coupons and campaigns
- ✅ Real-time coupon usage tracking via Socket.IO
- ✅ Session-based authentication with role-based access control
- ✅ MongoDB database for all data storage
- ✅ Responsive UI with TailwindCSS
- ✅ Redux state management
- ✅ Form validation and error handling
- ✅ Pagination and filtering
- ✅ Production-ready code structure

## 🛠 Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Document database (Mongoose ODM)
- **Socket.IO** - Real-time communication
- **express-session** - Session management
- **express-validator** - Input validation

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time client
- **TailwindCSS** - Styling framework

## 📁 Project Structure

```
Dynamic-coupon-generator/
├── backend/
│   ├── config/
│   │   └── mongodb.js          # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js             # Authentication middleware
│   │   └── validation.js       # Input validation
│   ├── models/
│   │   ├── Campaign.js         # Campaign schema
│   │   ├── Coupon.js           # Coupon schema
│   │   ├── User.js             # User schema
│   │   ├── Order.js            # Order schema
│   │   └── UsageTracking.js    # Usage tracking schema
│   ├── routes/
│   │   ├── api.js              # Main API router
│   │   ├── auth.js             # Authentication routes
│   │   ├── campaigns.js        # Campaign routes
│   │   ├── coupons.js          # Coupon routes
│   │   ├── orders.js           # Order routes
│   │   └── usage.js            # Usage tracking routes
│   ├── sockets/
│   │   └── socketHandler.js    # Socket.IO handler
│   ├── utils/
│   │   ├── eventEmitter.js     # EventEmitter setup
│   │   ├── eventEmitterInstance.js  # Singleton instance
│   │   ├── fileSystem.js       # File system utilities
│   │   └── streams.js          # Stream utilities
│   ├── data/                   # JSON data storage
│   ├── logs/                   # Application logs
│   ├── server.js               # Main server file
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   └── layout/
│   │   │       └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CouponList.jsx
│   │   │   ├── CouponForm.jsx
│   │   │   ├── CampaignList.jsx
│   │   │   ├── CampaignForm.jsx
│   │   │   ├── Checkout.jsx
│   │   │   └── Orders.jsx
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.js
│   │   │   │   ├── couponSlice.js
│   │   │   │   ├── campaignSlice.js
│   │   │   │   └── orderSlice.js
│   │   │   └── store.js
│   │   ├── utils/
│   │   │   └── socket.js        # Socket.IO client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (v6 or higher) - [Installation Guide](https://docs.mongodb.com/manual/installation/)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Dynamic-coupon-generator
```

### 2. Install Dependencies

Install all dependencies for both backend and frontend:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

Or use the convenience script:

```bash
npm run install:all
```

### 3. Database Setup

#### MongoDB Setup

1. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   # or
   mongod
   ```

2. MongoDB will automatically create the database `coupon_db` on first connection.

3. All collections (users, orders, coupons, campaigns, usage_tracking) will be created automatically when first documents are inserted.

## ⚙️ Configuration

### Backend Configuration

1. Copy the environment example file:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edit `.env` with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   
   MONGODB_URI=mongodb://localhost:27017/coupon_db
   
   SESSION_SECRET=your-secret-key-change-in-production
   FRONTEND_URL=http://localhost:5173
   ```

### Frontend Configuration

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## 🏃 Running the Application

### Development Mode

#### Option 1: Run Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

#### Option 2: Use Root Scripts

```bash
# Terminal 1
npm run dev:backend

# Terminal 2
npm run dev:frontend
```

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Start backend in production
cd backend
npm start
```

## 📡 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Coupon Endpoints

- `GET /api/coupons` - Get all coupons (with pagination)
- `GET /api/coupons/active` - Get active coupons
- `GET /api/coupons/:id` - Get coupon by ID
- `GET /api/coupons/code/:code` - Get coupon by code
- `POST /api/coupons` - Create coupon (Admin only)
- `PUT /api/coupons/:id` - Update coupon (Admin only)
- `PATCH /api/coupons/:id/activate` - Activate coupon (Admin only)
- `PATCH /api/coupons/:id/deactivate` - Deactivate coupon (Admin only)
- `DELETE /api/coupons/:id` - Delete coupon (Admin only)
- `POST /api/coupons/validate` - Validate coupon

### Campaign Endpoints

- `GET /api/campaigns` - Get all campaigns
- `GET /api/campaigns/:id` - Get campaign by ID
- `POST /api/campaigns` - Create campaign (Admin only)
- `PUT /api/campaigns/:id` - Update campaign (Admin only)
- `DELETE /api/campaigns/:id` - Delete campaign (Admin only)

### Usage Endpoints

- `POST /api/usage/apply` - Apply coupon to order
- `GET /api/usage` - Get usage records
- `GET /api/usage/stats/:couponId` - Get coupon statistics

### Order Endpoints

- `GET /api/orders` - Get orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order

## 🧪 Testing

### API Testing with Postman

1. Import the API collection (if available)
2. Set up environment variables:
   - `base_url`: `http://localhost:5000/api`
   - `auth_token`: (set after login)

### Manual Testing

1. **Register/Login**: Create an admin account
2. **Create Campaign**: Create a campaign first
3. **Create Coupon**: Create coupons linked to the campaign
4. **Test Validation**: Use the checkout page to validate coupons
5. **Apply Coupon**: Apply coupon to an order
6. **Real-time Updates**: Open multiple browser tabs to see real-time updates

## 🚢 Deployment

### Environment Variables

Ensure all environment variables are set in your deployment platform:

**Backend:**
- `PORT`
- `MONGODB_URI`
- `SESSION_SECRET`
- `FRONTEND_URL`

**Frontend:**
- `VITE_API_URL`
- `VITE_SOCKET_URL`

### Deployment Platforms

#### Backend (Node.js)
- **Render**: [render.com](https://render.com)
- **Heroku**: [heroku.com](https://heroku.com)
- **Railway**: [railway.app](https://railway.app)

#### Frontend (React)
- **Vercel**: [vercel.com](https://vercel.com)
- **Netlify**: [netlify.com](https://netlify.com)
- **GitHub Pages**: (with proper proxy setup)

### Build Commands

```bash
# Frontend build
cd frontend
npm run build

# Backend (no build needed, just ensure dependencies are installed)
cd backend
npm install --production

## 👥 Default Users

After setting up the database, you can register users through the UI. The first user can be registered as admin by setting the role during registration.

## 📝 Sample Data

Sample data can be created through the UI:
1. Create a campaign
2. Create coupons linked to the campaign
3. Test coupon validation and application

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify MongoDB port (default: 27017)

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify MongoDB service is accessible
- For MongoDB Atlas, check network access and credentials

### Socket.IO Connection Issues
- Check CORS settings
- Verify Socket.IO URL in frontend `.env`
- Ensure backend Socket.IO server is running

### Session Issues
- Clear browser cookies
- Check `SESSION_SECRET` in `.env`
- Verify `withCredentials: true` in Axios requests

## 👨‍💻 Author

Built as a comprehensive full-stack project demonstrating all syllabus units for web development course.

## 🙏 Acknowledgments

- Node.js community
- React team
- MongoDB documentation
- Socket.IO team




