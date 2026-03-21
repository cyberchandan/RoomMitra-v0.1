import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RoomDetail from './pages/RoomDetail';
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/ChatPage';
import InboxPage from './pages/InboxPage';
import { AuthContext } from './context/AuthContext';

function App() {
  const { user, loading } = React.useContext(AuthContext);

  if (loading) return null; // or a spinner

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/room/:id" element={<RoomDetail />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
            
            {/* Owner protected route */}
            <Route 
              path="/dashboard" 
              element={user && user.role === 'owner' ? <Dashboard /> : <Navigate to="/" />} 
            />

            {/* General protected route for chat */}
            <Route 
              path="/chat/:userId" 
              element={user ? <ChatPage /> : <Navigate to="/login" />} 
            />
            
            {/* General protected route for inbox */}
            <Route 
              path="/inbox" 
              element={user ? <InboxPage /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
