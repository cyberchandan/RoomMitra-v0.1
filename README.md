# RoomMitra - Clean & Scalable MERN Stack Platform

RoomMitra is a user-friendly platform focused on rural/local areas where owners can list rooms, and tenants can search freely. It includes a unique **"Room Partner / Flatmate"** finder module and real-time live chat functionality.

## Features
- Public timeline and search module with location and keyword filtering.
- Toggle capabilities between "Full Room Search" and "Room Partner Finder".
- Protected Dashboard for Room Owners to add/manage listings.
- User accounts (Tenant/Owner) with JWT authentication.
- Real-Time Message capabilities powered by Socket.io.
- Beautiful, highly responsive mobile-first UI with Tailwind CSS.

## Tech Stack
- **Frontend**: React.js (Vite), React Router, Tailwind CSS, Axios, Lucide Icons, Context API.
- **Backend**: Node.js, Express.js, MongoDB + Mongoose, JSON Web Tokens, Socket.io, bcryptjs.

## Getting Started

Follow these step-by-step instructions to get the application running on your local machine.

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally on port `27017`

### 2. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd "backend"
   ```
2. Install NodeJS Dependencies:
   ```bash
   npm install
   ```
3. Environment Variables:
   The backend directory already contains a `.env` file configured for local development:
   ```
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/roommitra
   JWT_SECRET=supersecretjwtkeyroommitra
   ```
4. Start the backend server:
   ```bash
   npm start 
   # or node server.js
   ```

### 3. Frontend Setup
1. Open a new, separate terminal and navigate to the frontend directory:
   ```bash
   cd "frontend"
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Open the link provided in your terminal (usually `http://localhost:5173`) in your web browser.

## Enjoy RoomMitra! 🚀
