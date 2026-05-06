# Naveen's JB — Job Portal

A full stack job portal built with the MERN stack.

## Features
- Candidate and recruiter roles with JWT auth
- Job posting, browsing and search
- Apply to jobs with application tracking
- Accept/reject applications as a recruiter
- Messaging between recruiter and accepted candidate
- Profile page with photo upload

## Tech Stack
- **Frontend:** React.js, React Router, Axios, Context API
- **Backend:** Node.js, Express.js, REST API
- **Database:** MongoDB Atlas, Mongoose
- **Auth:** JWT, bcryptjs
- **Dev tools:** Nodemon, Postman

## Running locally

### Backend
cd server
npm install
npm run dev

### Frontend
cd client
npm install
npm start

### Environment variables
Create a `.env` file in the `server/` folder:
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret