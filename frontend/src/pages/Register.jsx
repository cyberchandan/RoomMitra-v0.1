import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'tenant'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Default tenant for simple users, owners choose specifically
    const result = await register(
      formData.name, 
      formData.email, 
      formData.password, 
      formData.role
    );
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 card p-8">
      <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Create an Account</h2>
      
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input 
            type="text" 
            name="name"
            className="input-field" 
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input 
            type="email" 
            name="email"
            className="input-field" 
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input 
            type="password" 
            name="password"
            className="input-field" 
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            minLength={6}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">I am a...</label>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="role" 
                value="tenant"
                checked={formData.role === 'tenant'}
                onChange={handleChange}
                className="text-primary-600 focus:ring-primary-500" 
              />
              <span className="text-slate-700">Room Seeker / Partner</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="role" 
                value="owner"
                checked={formData.role === 'owner'}
                onChange={handleChange}
                className="text-primary-600 focus:ring-primary-500" 
              />
              <span className="text-slate-700">Room Owner</span>
            </label>
          </div>
        </div>
        <button 
          type="submit" 
          disabled={isLoading}
          className="btn-primary w-full flex justify-center mt-6"
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
      
      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account? <Link to="/login" className="text-primary-600 hover:underline font-medium">Sign in</Link>
      </p>
    </div>
  );
};

export default Register;
