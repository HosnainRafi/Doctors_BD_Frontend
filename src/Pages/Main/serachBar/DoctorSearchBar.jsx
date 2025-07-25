import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const DoctorSearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://doctors-bd-backend.vercel.app/api/v1/doctors/search?q=${encodeURIComponent(
            query
          )}`
        );
        const data = await res.json();
        setResults(data.data || []);
        setShowDropdown(true);
      } catch {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timeoutRef.current);
  }, [query]);

  const handleDoctorClick = slug => {
    setShowDropdown(false);
    setQuery('');
    navigate(`/doctor/${slug}`);
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-7xl mx-auto mt-[90px] px-4"
    >
      <div className="relative">
        <input
          type="text"
          className="w-full border border-gray-300 rounded-md px-4 py-3 pr-16 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
          placeholder="Search doctors by name, specialty or location..."
          value={query}
          onChange={e => {
            setQuery(e.target.value);
          }}
          onFocus={() => query && setShowDropdown(true)}
        />
        <button
          type="button"
          className="absolute top-0 right-0 h-full bg-purple-600 hover:bg-purple-700 text-white px-6 rounded-r-md flex items-center justify-center transition-all duration-200"
          onClick={() => query && setShowDropdown(true)}
        >
          <FaSearch className="text-lg" />
        </button>
      </div>

      {showDropdown && (
        <div className="absolute z-50 top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-2 shadow-lg max-h-[300px] overflow-y-auto">
          {results.length > 0 ? (
            results.map(doctor => (
              <div
                key={doctor._id}
                onClick={() => handleDoctorClick(doctor.slug)}
                className="flex items-center gap-4 px-4 py-3 hover:bg-purple-50 cursor-pointer transition-all duration-200 border-b last:border-b-0"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleDoctorClick(doctor.slug);
                  }
                }}
              >
                <img
                  src={doctor.photo}
                  alt={doctor.name}
                  className="w-14 h-16 rounded-md object-cover object-top border"
                />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-800 truncate">
                    {doctor.name}
                  </h4>
                  <p className="text-xs text-gray-600 truncate">
                    {doctor.specialty}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500">
              No doctors found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DoctorSearchBar;
