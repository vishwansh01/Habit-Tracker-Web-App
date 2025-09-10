# 🎯 Habit Tracker - Full Stack Web App

A social habit tracking application built with React, Express.js, and MongoDB. Track your daily habits and stay motivated with friends!

## 🚀 Live Demo

- **App:** https://habit-tracker-web-app-pi.vercel.app
- **API:** https://habit-tracker-web-app.onrender.com

<!-- **Test Account:** `demo@habittracker.com` / `demo123` -->

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based login/register
- 📊 **Habit Management** - Create, track, edit habits with streak counting
- 👥 **Social Accountability** - Follow friends, view activity feed
- 📱 **Responsive Design** - Works on all devices
- 🛡️ **Edge Case Handling** - Duplicate prevention, validation, security

## 🛠️ Tech Stack

**Frontend:** React, Vite, Tailwind CSS
**Backend:** Express.js, MongoDB, Mongoose, JWT  
**Deployment:** Vercel + Render + MongoDB Atlas

## 📁 Project Structure

```
├── backend/          # Express API server
│   ├── db/       # MongoDB schemas (User, Habit, CheckIn)
│   ├── routes/       # API endpoints (auth, habits, social)
│   ├── middleware/   # Authentication & validation
│   └── app.js     # Main server
├── frontend/         # React application
   └── src/          # Components and logic
```

## 🏃‍♂️ Quick Start

### Full Development Setup

```bash
# Backend
cd backend
npm install
# Add .env with MongoDB URI and JWT_SECRET
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## 🔧 Environment Variables

```env
# Backend .env
MONGODB_URI=mongodb://localhost:27017/habit-tracker
JWT_SECRET=your-secure-secret-key
PORT=3000

# Frontend .env
VITE_API_URL=http://localhost:3000
```

## 📋 API Endpoints

- `POST /auth/signuo` - User registration
- `POST /auth/signin` - User login
- `GET /dashboard/habits` - Get user habits
- `POST /habits/:id/check` - Check-in for habit
- `GET /social/feed` - Friends activity feed
- `POST /social/users/:id/follow` - Follow user

## 🎨 Key Features Demo

1. **Create Account** - Register with email/password
2. **Add Habits** - Create habits in different categories
3. **Track Progress** - Daily check-ins with streak counting
4. **Social Features** - Search users, follow friends, view feed
5. **Responsive Design** - Test on mobile/desktop

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Rate limiting (100 req/15min)
- Duplicate prevention
- CORS protection

Built with modern web development best practices and deployed on production-ready infrastructure.
