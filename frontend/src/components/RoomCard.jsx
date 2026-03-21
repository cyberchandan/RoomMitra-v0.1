import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, IndianRupee, Image as ImageIcon } from 'lucide-react';

const RoomCard = ({ room }) => {
  const isPartner = room.listingType === 'room_partner';
  
  return (
    <div className="card flex flex-col h-full bg-white relative">
      {/* Badges */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm text-white ${isPartner ? 'bg-indigo-500' : 'bg-primary-500'}`}>
          {isPartner ? 'Room Partner Needed' : 'Full Room Available'}
        </span>
        {isPartner && room.preferredGender !== 'any' && (
          <span className="px-3 py-1 text-xs font-semibold rounded-full shadow-sm bg-white text-slate-700 border border-slate-200">
            Prefers: {room.preferredGender === 'male' ? 'Male' : 'Female'}
          </span>
        )}
      </div>

      {/* Image Fallback */}
      <div className="h-48 bg-slate-200 w-full overflow-hidden flex items-center justify-center">
        {room.images && room.images.length > 0 ? (
          <img src={room.images[0]} alt={room.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
        ) : (
          <ImageIcon className="w-12 h-12 text-slate-400" />
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2">{room.title}</h3>
        
        <div className="flex items-center gap-1 text-slate-500 mb-4 text-sm font-medium">
          <MapPin className="w-4 h-4 text-primary-500" />
          <span className="truncate">{room.location}</span>
        </div>

        <div className="mt-auto space-y-3">
          <div className="flex justify-between items-center text-sm">
            {isPartner ? (
              <div className="flex items-center gap-1 text-slate-600">
                <Users className="w-4 h-4" />
                <span>Current Occupants: <b>{room.occupants}</b></span>
              </div>
            ) : (
             <div className="text-slate-600">Entire Space</div>
            )}
          </div>

          <div className="flex justify-between items-end border-t border-slate-100 pt-3">
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">
                {isPartner ? 'Rent Split' : 'Total Rent'}
              </p>
              <div className="flex items-center text-2xl font-bold text-slate-900">
                <IndianRupee className="w-5 h-5 mr-1 text-primary-600" />
                {isPartner ? room.rentSplit : room.price}
                <span className="text-sm font-normal text-slate-500 ml-1">/mo</span>
              </div>
            </div>
            
            <Link to={`/room/${room._id}`} className="btn-primary text-sm px-4 py-2">
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
