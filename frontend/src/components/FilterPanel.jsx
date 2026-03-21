import React from 'react';
import { Search, MapPin } from 'lucide-react';

const FilterPanel = ({ filters, setFilters, onSearch }) => {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSearch} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8 w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
      {/* Search by Keyword */}
      <div className="flex-1 relative">
        <label className="sr-only">Search rooms</label>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          name="keyword"
          value={filters.keyword}
          onChange={handleChange}
          className="input-field pl-10"
          placeholder="Search by title or features..."
        />
      </div>

      {/* Location Filter */}
      <div className="md:w-64 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          name="location"
          value={filters.location}
          onChange={handleChange}
          className="input-field pl-10"
          placeholder="City, Area, or Landmark"
        />
      </div>

      <button type="submit" className="btn-primary flex items-center justify-center gap-2 px-6">
        <Search className="w-4 h-4" /> Search
      </button>
    </form>
  );
};

export default FilterPanel;
