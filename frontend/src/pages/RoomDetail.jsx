import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { MapPin, Phone, MessageCircle, User, Users, IndianRupee, Image as ImageIcon } from 'lucide-react';

const RoomDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const { data } = await api.get(`/rooms/${id}`);
        setRoom(data);
      } catch (error) {
        console.error('Failed to fetch room');
      }
      setLoading(false);
    };
    fetchRoom();
  }, [id]);

  if (loading) return <div className="text-center py-20 text-slate-500 font-medium animate-pulse">Loading details...</div>;
  if (!room) return <div className="text-center py-20 text-red-500">Room not found.</div>;

  const isPartner = room.listingType === 'room_partner';

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Title & Badges */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex gap-2 mb-3">
             <span className={`px-3 py-1 text-xs font-bold rounded-full text-white ${isPartner ? 'bg-indigo-500' : 'bg-primary-500'}`}>
               {isPartner ? 'Room Partner Needed' : 'Full Room Available'}
             </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{room.title}</h1>
          <div className="flex items-center gap-2 text-slate-500 mt-2 font-medium">
            <MapPin className="w-5 h-5 text-primary-500" />
            {room.location}
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500 uppercase font-semibold mb-1">
            {isPartner ? 'Rent Split' : 'Total Rent'}
          </p>
          <div className="text-4xl font-extrabold text-primary-600 flex items-center justify-end">
            <IndianRupee className="w-8 h-8 mr-1" />
            {isPartner ? room.rentSplit : room.price}
            <span className="text-lg font-normal text-slate-500 ml-1">/mo</span>
          </div>
        </div>
      </div>

      {/* Image Gallery (Simplified for MVP) */}
      <div className="h-96 bg-slate-200 rounded-2xl overflow-hidden mb-8 shadow-sm border border-slate-100 flex items-center justify-center">
        {room.images && room.images.length > 0 ? (
          <img src={room.images[0]} alt={room.title} className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="w-20 h-20 text-slate-400" />
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="md:col-span-2 space-y-8">
          <div className="card p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Description</h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{room.description}</p>
          </div>

          {isPartner && (
            <div className="card p-6 bg-indigo-50 border-indigo-100">
              <h2 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" /> Partner Preferences
              </h2>
              <ul className="space-y-3 text-indigo-800 font-medium">
                <li className="flex justify-between border-b border-indigo-200 pb-2">
                   <span>Current Occupants:</span>
                   <span>{room.occupants} people</span>
                </li>
                <li className="flex justify-between border-b border-indigo-200 pb-2">
                   <span>Preferred Gender:</span>
                   <span className="capitalize">{room.preferredGender}</span>
                </li>
                {room.lifestyle && (
                  <li className="flex items-start flex-col gap-1 mt-3">
                     <span className="text-indigo-600 text-sm">Lifestyle Notes:</span>
                     <span className="bg-white px-4 py-2 rounded-lg text-indigo-900 border border-indigo-100 w-full">{room.lifestyle}</span>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar / Contact Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="card p-6 sticky top-24">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="w-5 h-5 text-primary-500" /> Listed by
            </h3>
            
            <p className="font-semibold text-lg text-slate-700 mb-6">{room.ownerId?.name || 'Owner'}</p>

            {user ? (
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-sm text-slate-500 mb-1 font-medium">Contact Number</p>
                  <a href={`tel:${room.contactNumber}`} className="text-xl font-bold text-slate-800 flex items-center gap-2 hover:text-primary-600 transition-colors">
                    <Phone className="w-5 h-5" /> {room.contactNumber}
                  </a>
                </div>
                
                {user._id !== room.ownerId._id && (
                   <button 
                     onClick={() => navigate(`/chat/${room.ownerId._id}`)}
                     className="btn-primary w-full flex items-center justify-center gap-2 shadow-primary-500/30 font-bold"
                   >
                     <MessageCircle className="w-5 h-5" /> Live Chat
                   </button>
                )}
              </div>
            ) : (
              <div className="bg-amber-50 rounded-xl p-5 border border-amber-200 text-center">
                <p className="text-amber-800 font-medium text-sm mb-4">
                  Log in to see contact details and chat with the owner.
                </p>
                <Link to="/login" className="btn-primary w-full inline-block">Login to Apply</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
