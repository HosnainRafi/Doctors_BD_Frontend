import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const DoctorSearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef();

  useEffect(() => {
    if (!query) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      fetch(
        `http://localhost:5000/api/v1/doctors/search?q=${encodeURIComponent(
          query
        )}`
      )
        .then((res) => res.json())
        .then((data) => {
          setResults(data.data || []);
          setShowDropdown(true);
        });
    }, 300);

    return () => clearTimeout(timeoutRef.current);
  }, [query]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        placeholder="Search doctor by name or specialty..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query && setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
      />
      {showDropdown && results.length > 0 && (
        <ul className="absolute z-10 left-0 right-0 bg-white border border-gray-200 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
          {results.map((doctor) => (
            <li key={doctor.slug} className="hover:bg-purple-100">
              <Link
                to={`/doctor/${doctor.slug}`}
                className="block px-4 py-2 text-gray-800"
                onClick={() => setShowDropdown(false)}
              >
                <span className="font-semibold">{doctor.name}</span>
                <span className="text-xs text-gray-500 ml-2">
                  {doctor.specialty}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {showDropdown && query && results.length === 0 && (
        <div className="absolute z-10 left-0 right-0 bg-white border border-gray-200 rounded-md mt-1 px-4 py-2 text-gray-500">
          No doctors found.
        </div>
      )}
    </div>
  );
};

export default DoctorSearchBar;
