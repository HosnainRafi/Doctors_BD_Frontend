import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MedexSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const navigate = useNavigate();

  // Live search with debounce
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setSelected(null);
      return;
    }

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/medex/search?query=${query}`
        );
        setResults(res.data.data);
        setSelected(null);
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 500);

    setTypingTimeout(timeout);
    // eslint-disable-next-line
  }, [query]);

  // Fetch detailed info
  const fetchDetails = async (link, goToPage = false) => {
    if (goToPage) {
      navigate(`/medicine-details?url=${encodeURIComponent(link)}`);
      return;
    }
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/medex/details`,
        {
          params: { url: link },
        }
      );
      setSelected(res.data.data);
    } catch (err) {
      console.error("Detail fetch error:", err);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <input
        type="text"
        placeholder="Search medicine..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 w-full rounded"
      />

      {results.length > 0 && (
        <div className="mt-4 space-y-3">
          {results.map((r, i) => (
            <div
              key={i}
              className="p-3 border rounded flex items-center space-x-4"
              style={{ cursor: "pointer" }}
            >
              <img
                src={r.img}
                alt={r.name}
                className="w-12 h-12 object-contain"
                onClick={() => fetchDetails(r.link)}
                title="Show details below"
              />
              <div
                style={{ flex: 1 }}
                onClick={() => fetchDetails(r.link)}
                title="Show details below"
              >
                <h3 className="font-semibold text-sm">{r.name}</h3>
                <p className="text-xs text-gray-600">{r.description}</p>
              </div>
              <button
                className="ml-2 px-2 py-1 bg-blue-600 text-white rounded text-xs"
                onClick={() =>
                  navigate(
                    `/medicine-details?url=${encodeURIComponent(r.link)}`,
                    {
                      state: { description: r.description },
                    }
                  )
                }
                title="Go to details page"
              >
                Details Page
              </button>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="mt-6 p-4 border bg-gray-50 rounded">
          <h2 className="text-xl font-bold">{selected.name}</h2>
          <p>
            <strong>Generic:</strong>{" "}
            {selected.genericNameLink ? (
              <a
                href={selected.genericNameLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {selected.genericName}
              </a>
            ) : (
              selected.genericName
            )}
          </p>
          <p>
            <strong>Strength:</strong> {selected.strength}
          </p>
          <p>
            <strong>Manufacturer:</strong>{" "}
            {selected.manufacturerLink ? (
              <a
                href={selected.manufacturerLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {selected.manufacturer}
              </a>
            ) : (
              selected.manufacturer
            )}
          </p>
          <p>
            <strong>Unit Price:</strong> {selected.unitPrice}
          </p>
          <p>
            <strong>Strip Price:</strong> {selected.stripPrice}
          </p>
          <p>
            <strong>Pack Info:</strong> {selected.packInfo}
          </p>
          <div>
            <strong>Description:</strong>
            <div>{selected.description}</div>
          </div>
          <div>
            <strong>Composition:</strong>
            <pre className="whitespace-pre-wrap mt-2 bg-white p-3 rounded border">
              {selected.composition}
            </pre>
          </div>
          {[
            "indications",
            "mode_of_action",
            "dosage",
            "interaction",
            "contraindications",
            "side_effects",
            "pregnancy_cat",
            "precautions",
            "overdose_effects",
            "drug_classes",
            "storage_conditions",
            "commonly_asked_questions",
          ].map((section) =>
            selected[section] ? (
              <div key={section}>
                <strong style={{ textTransform: "capitalize" }}>
                  {section.replace(/_/g, " ")}:
                </strong>
                <div style={{ whiteSpace: "pre-line" }}>
                  {selected[section]}
                </div>
              </div>
            ) : null
          )}
          <div style={{ marginTop: 16 }}>
            <a href={selected.url} target="_blank" rel="noopener noreferrer">
              View on Medex
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedexSearch;
