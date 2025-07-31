import React, { useState, useEffect } from "react";
import axios from "axios";

// Function to extract strength from medicine name
const extractStrength = (medicineName) => {
  // Match patterns like: 1000 mg, 500 mg, 120 mg/5 ml, etc.
  const match = medicineName.match(
    /(\d+(?:\.\d+)?\s*(?:mg|g|mcg|ml|iu|units?)\b(?:\/\d+\s*(?:mg|g|mcg|ml|iu|units?)\b)?)/i
  );
  if (match) {
    return match[0];
  }
  return "";
};

const MedicineSearchForPrescription = ({ onMedicineSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  // Live search with debounce
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://doctors-bd-backend.vercel.app/api/v1/medex/search?query=${query}`
        );
        setResults(res.data.data || []);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    setTypingTimeout(timeout);
  }, [query]);

  const handleSelectMedicine = (medicine) => {
    // Extract strength from the medicine name
    const strength = extractStrength(medicine.name);

    // Format medicine data for prescription using search results
    const medicineData = {
      name: medicine.name,
      strength: strength,
      timing: "",
      duration: "",
      instructions: medicine.description || "",
    };

    onMedicineSelect(medicineData);
    // Clear search after selection
    setQuery("");
    setResults([]);
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-1">
        Search Medicine
      </label>
      <div className="relative">
        <input
          type="text"
          placeholder="Type medicine name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {loading && (
          <div className="absolute right-3 top-2.5">
            <div className="w-4 h-4 border-t-2 border-purple-500 border-solid rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
          {results.map((r, i) => (
            <div
              key={i}
              className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-center"
              onClick={() => handleSelectMedicine(r)}
            >
              <img
                src={r.img}
                alt={r.name}
                className="w-10 h-10 object-contain mr-3"
              />
              <div>
                <h3 className="font-medium text-sm">{r.name}</h3>
                <p className="text-xs text-gray-600 truncate max-w-xs">
                  {r.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicineSearchForPrescription;
