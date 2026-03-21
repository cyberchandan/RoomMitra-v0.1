import React, { useState, useEffect } from 'react';
import api from '../services/api';
import RoomCard from '../components/RoomCard';
import FilterPanel from '../components/FilterPanel';
import { Users, Home as HomeIcon } from 'lucide-react';

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [listingType, setListingType] = useState('full_room'); // Toggle state

  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
  });

  const fetchRooms = async (pageNumber = 1, append = false) => {
    setLoading(true);
    try {
      const { data } = await api.get('/rooms', {
        params: {
          page: pageNumber,
          keyword: filters.keyword,
          location: filters.location,
          listingType
        }
      });
      
      if (append) {
        setRooms(prev => [...prev, ...data.rooms]);
      } else {
        setRooms(data.rooms);
      }
      setPages(data.pages);
      setPage(data.page);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Fetch initial or when listing type toggles
    fetchRooms(1, false);
  }, [listingType]);

  const handleSearch = () => {
    fetchRooms(1, false);
  };

  const loadMore = () => {
    if (page < pages) {
      fetchRooms(page + 1, true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-10 pt-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Find your perfect space in <span className="text-primary-600 text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">RoomMitra</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          The simplest way to discover affordable rooms and fantastic flatmates in your local area. No middleman, no hassle.
        </p>
      </div>

      {/* Toggle Type (Full Room vs Partner) */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-100 p-1 rounded-xl shadow-inner inline-flex">
          <button
            onClick={() => setListingType('full_room')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300 ${
              listingType === 'full_room' 
                ? 'bg-white text-primary-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <HomeIcon className="w-4 h-4" /> Find Full Room
          </button>
          <button
            onClick={() => setListingType('room_partner')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300 ${
              listingType === 'room_partner' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Users className="w-4 h-4" /> Find Room Partner
          </button>
        </div>
      </div>

      <FilterPanel filters={filters} setFilters={setFilters} onSearch={handleSearch} />

      {/* Grid */}
      {loading && page === 1 ? (
        <div className="text-center py-20 text-slate-500 font-medium animate-pulse">Loading amazing places...</div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-600 text-lg">No listings found for your search.</p>
          <button onClick={() => { setFilters({keyword: '', location: ''}); fetchRooms(1, false); }} className="mt-4 text-primary-600 font-medium hover:underline">
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map(room => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
          
          {/* Infinite Scroll / Load More */}
          {page < pages && (
            <div className="mt-12 text-center">
              <button 
                onClick={loadMore} 
                disabled={loading}
                className="bg-slate-100 text-slate-700 px-8 py-3 rounded-full font-medium hover:bg-slate-200 transition-colors"
              >
                {loading ? 'Loading more...' : 'Load More Rooms'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
