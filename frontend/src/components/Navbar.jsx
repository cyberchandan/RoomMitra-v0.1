import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Home, LogIn, UserPlus, LogOut, LayoutDashboard, MessageCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-primary-600 font-bold text-2xl tracking-tight">
          <Home className="w-8 h-8" />
          <span>RoomMitra</span>
        </Link>
        
        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link to="/login" className="flex items-center gap-1 text-slate-600 hover:text-primary-600 font-medium transition-colors">
                <LogIn className="w-4 h-4" /> Login
              </Link>
              <Link to="/register" className="btn-primary flex items-center gap-1">
                <UserPlus className="w-4 h-4" /> Register
              </Link>
            </>
          ) : (
            <>
              <span className="text-slate-600 hidden sm:inline">Hi, <span className="font-semibold text-slate-800">{user.name}</span></span>
              
              <Link to="/inbox" className="text-slate-600 hover:text-primary-600 font-medium flex items-center gap-1">
                <MessageCircle className="w-4 h-4" /> Inbox
              </Link>
              
              {user.role === 'owner' && (
                <Link to="/dashboard" className="text-slate-600 hover:text-primary-600 font-medium flex items-center gap-1">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
              )}
              
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-500 hover:text-red-600 font-medium transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" /> <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
