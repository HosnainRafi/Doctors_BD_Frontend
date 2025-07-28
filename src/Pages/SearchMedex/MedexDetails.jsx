import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const MedexDetails = () => {
  const location = useLocation();
  const url = new URLSearchParams(location.search).get("url");
  const descriptionFromState = location.state?.description;
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!url) return;
    axios
      .get("https://doctors-bd-backend.vercel.app/api/v1/medex/details", {
        params: { url },
      })
      .then((res) => setData(res.data.data));
  }, [url]);

  if (!url) return <div>No medicine selected.</div>;

  if (!data)
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <h2>Loading...</h2>
        {descriptionFromState && (
          <div>
            <strong>Description:</strong>
            <div>{descriptionFromState}</div>
          </div>
        )}
      </div>
    );

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold">{data.name}</h2>
      <div>
        <strong>Description:</strong>
        <div>{data.description || descriptionFromState}</div>
      </div>
      <p>
        <strong>Unit Price:</strong> {data.unitPrice}
      </p>
      <p>
        <strong>Strip Price:</strong> {data.stripPrice}
      </p>
      <p>
        <strong>Pack Info:</strong> {data.packInfo}
      </p>

      <div>
        <strong>Composition:</strong>
        <pre className="whitespace-pre-wrap mt-2 bg-white p-3 rounded border">
          {data.composition}
        </pre>
      </div>
      {[
        "indications",
        "pharmacology",
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
        data[section] ? (
          <div key={section}>
            <strong style={{ textTransform: "capitalize" }}>
              {section.replace(/_/g, " ")}:
            </strong>
            <div style={{ whiteSpace: "pre-line" }}>{data[section]}</div>
          </div>
        ) : null
      )}
      {/* <div style={{ marginTop: 16 }}>
        <a href={data.url} target="_blank" rel="noopener noreferrer">
          View on Medex
        </a>
      </div> */}
    </div>
  );
};

export default MedexDetails;
