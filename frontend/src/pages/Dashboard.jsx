import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: '',
    description: '',
    contactNumber: '',
    listingType: 'full_room',
    occupants: 0,
    preferredGender: 'any',
    rentSplit: '',
    lifestyle: ''
  });

  const fetchMyRooms = async () => {
    try {
      // Need a way to fetch owner rooms. 
      // MVP hack: fetch all rooms and filter locally, or pass ownerId.
      // Easiest is backend filtering but we didn't add it to backend explicitely, 
      // However we can filter client side.
      const { data } = await api.get('/rooms', { params: { limit: 100 } });
      const myRooms = data.rooms.filter(room => room.ownerId === user._id || room.ownerId._id === user._id);
      setRooms(myRooms);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMyRooms();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/rooms', formData);
      alert('Room Created Successfully!');
      setFormData({
        title: '', price: '', location: '', description: '', contactNumber: '',
        listingType: 'full_room', occupants: 0, preferredGender: 'any', rentSplit: '', lifestyle: ''
      });
      fetchMyRooms();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating room');
    }
    setLoading(false);
  };

  const isPartner = formData.listingType === 'room_partner';

  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 pb-12">
      {/* Create New Room Form */}
      <div className="card p-6 h-fit sticky top-20">
        <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6">List a New Space</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input type="text" name="title" className="input-field" value={formData.title} onChange={handleChange} required />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input type="text" name="location" className="input-field" value={formData.location} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Phone</label>
              <input type="text" name="contactNumber" className="input-field" value={formData.contactNumber} onChange={handleChange} required />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Listing Type</label>
             <select name="listingType" className="input-field bg-white" value={formData.listingType} onChange={handleChange}>
               <option value="full_room">Full Room / Empty Property</option>
               <option value="room_partner">Looking for Flatmate / Room Partner</option>
             </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{isPartner ? 'Total Rent (optional)' : 'Total Rent'}</label>
                <input type="number" name="price" className="input-field" value={formData.price} onChange={handleChange} required={!isPartner} />
             </div>
             {isPartner && (
                <div>
                   <label className="block text-sm font-medium text-indigo-700 mb-1">Rent Split / Person</label>
                   <input type="number" name="rentSplit" className="input-field border-indigo-200 focus:ring-indigo-500" value={formData.rentSplit} onChange={handleChange} required />
                </div>
             )}
          </div>

          {isPartner && (
             <div className="grid grid-cols-2 gap-4 bg-indigo-50 p-4 rounded-xl border border-indigo-100 mt-2">
               <div>
                 <label className="block text-sm font-medium text-indigo-800 mb-1">Current Occupants</label>
                 <input type="number" name="occupants" className="input-field text-sm" value={formData.occupants} onChange={handleChange} />
               </div>
               <div>
                 <label className="block text-sm font-medium text-indigo-800 mb-1">Pref. Gender</label>
                 <select name="preferredGender" className="input-field text-sm bg-white" value={formData.preferredGender} onChange={handleChange}>
                   <option value="any">Any</option>
                   <option value="male">Male</option>
                   <option value="female">Female</option>
                 </select>
               </div>
               <div className="col-span-2 mt-2">
                 <label className="block text-sm font-medium text-indigo-800 mb-1">Lifestyle Notes (Optional)</label>
                 <input type="text" name="lifestyle" placeholder="e.g. Student, Vegetarian, Non-smoking" className="input-field text-sm" value={formData.lifestyle} onChange={handleChange} />
               </div>
             </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea name="description" rows="3" className="input-field" value={formData.description} onChange={handleChange} required></textarea>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-4">
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
        </form>
      </div>

      {/* Existing Listings */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6">Your Listings</h2>
        {rooms.length === 0 ? (
          <div className="bg-slate-50 p-8 rounded-xl text-center border border-slate-200 text-slate-500 font-medium">
             You haven't listed any properties yet.
          </div>
        ) : (
          <div className="space-y-4">
            {rooms.map(room => (
              <div key={room._id} className="card p-4 flex gap-4 items-center border-l-4 border-l-primary-500 hover:shadow-lg transition-transform hover:-translate-y-1">
                 <div className="flex-1">
                    <h3 className="font-bold text-slate-800 truncate">{room.title}</h3>
                    <p className="text-sm text-slate-500">{room.location}</p>
                    <div className="flex gap-2 mt-2">
                       <span className={`text-xs px-2 py-1 rounded bg-slate-100 font-medium ${room.listingType === 'room_partner' ? 'text-indigo-600' : 'text-primary-600'}`}>
                          {room.listingType === 'room_partner' ? 'Flatmate Search' : 'Full Room'}
                       </span>
                    </div>
                 </div>
                 <div className="text-right">
                    <div className="font-bold text-lg text-slate-900 mb-1">₹{room.listingType === 'room_partner' ? room.rentSplit : room.price}</div>
                    <button className="text-sm font-medium text-red-500 hover:text-red-600 hover:underline">Delete</button>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
