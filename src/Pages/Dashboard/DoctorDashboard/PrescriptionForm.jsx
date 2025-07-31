import React, { useState, useEffect } from "react";
import MedicineSearchForPrescription from "./MedicineSearchForPrescription";

const PrescriptionForm = ({
  appointment,
  prescription,
  onClose,
  onUpdated,
}) => {
  const isEditing = !!prescription;
  const [medicines, setMedicines] = useState([
    { name: "", strength: "", timing: "", duration: "", instructions: "" },
  ]);
  const [advice, setAdvice] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const doctorToken = localStorage.getItem("doctorToken");

  // Common timing patterns for the dropdown
  const timingOptions = [
    { value: "", label: "Select timing" },
    { value: "1+0+0", label: "Morning" },
    { value: "0+1+0", label: "Noon" },
    { value: "0+0+1", label: "Evening" },
    { value: "1+1+0", label: "Morning + Noon" },
    { value: "1+0+1", label: "Morning + Evening" },
    { value: "0+1+1", label: "Noon + Evening" },
    { value: "1+1+1", label: "Morning + Noon + Evening" },
    { value: "2+0+0", label: "2 times Morning" },
    { value: "0+2+0", label: "2 times Noon" },
    { value: "0+0+2", label: "2 times Evening" },
    { value: "custom", label: "Custom timing" },
  ];

  // Initialize form with prescription data when editing
  useEffect(() => {
    if (isEditing && prescription) {
      // Convert existing medicines to include strength field
      const formattedMedicines = prescription.medicines.map((med) => {
        // Extract strength from instructions if it exists
        let strength = "";
        let instructions = med.instructions || "";

        // Check if instructions contain strength information
        const strengthMatch = instructions.match(/Strength:\s*([^,]+)/i);
        if (strengthMatch) {
          strength = strengthMatch[1].trim();
          // Remove strength from instructions
          instructions = instructions
            .replace(/Strength:\s*([^,]+)/i, "")
            .trim();
        }

        return {
          name: med.name,
          strength,
          timing: med.timing,
          duration: med.duration,
          instructions,
        };
      });
      setMedicines(formattedMedicines);
      setAdvice(prescription.advice || "");
      setFollowUpDate(prescription.follow_up_date || "");
    }
  }, [isEditing, prescription]);

  const handleMedChange = (i, e) => {
    const newMeds = [...medicines];
    newMeds[i][e.target.name] = e.target.value;
    setMedicines(newMeds);
  };

  const handleTimingChange = (i, e) => {
    const newMeds = [...medicines];
    const value = e.target.value;

    if (value === "custom") {
      // If custom is selected, clear the timing field for manual input
      newMeds[i].timing = "";
    } else {
      // Otherwise, set the selected timing pattern
      newMeds[i].timing = value;
    }

    setMedicines(newMeds);
  };

  const addMedicine = () =>
    setMedicines([
      ...medicines,
      { name: "", strength: "", timing: "", duration: "", instructions: "" },
    ]);

  const removeMedicine = (i) =>
    setMedicines(medicines.filter((_, idx) => idx !== i));

  const handleMedicineSelect = (medicineData) => {
    // Check if there's an empty medicine row to replace
    const emptyIndex = medicines.findIndex(
      (med) => !med.name && !med.strength && !med.timing && !med.duration
    );

    if (emptyIndex !== -1) {
      // Replace the empty row with the selected medicine
      const newMeds = [...medicines];
      newMeds[emptyIndex] = medicineData;
      setMedicines(newMeds);
    } else {
      // Add as a new medicine
      setMedicines([...medicines, medicineData]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Helper function to extract ID from object or string
    const extractId = (value) => {
      if (!value) return null;
      if (typeof value === "string") return value;
      if (value._id) return value._id;
      return null;
    };

    // Format medicines for submission (combine strength with instructions)
    const formattedMedicines = medicines.map((med) => {
      let instructions = med.instructions || "";
      if (med.strength) {
        instructions = `Strength: ${med.strength}. ${instructions}`.trim();
      }
      return {
        name: med.name,
        timing: med.timing,
        duration: med.duration,
        instructions,
      };
    });

    const postBody = {
      appointment_id: isEditing
        ? extractId(prescription.appointment_id)
        : appointment._id,
      patient_id: isEditing
        ? extractId(prescription.patient_id)
        : appointment.patient_id._id,
      date: isEditing
        ? prescription.date
        : new Date().toISOString().slice(0, 10),
      medicines: formattedMedicines,
      advice,
      follow_up_date: followUpDate,
    };

    // Set doctor ID
    if (isEditing) {
      if (prescription.doctor_id) {
        postBody.doctor_id = extractId(prescription.doctor_id);
      } else if (prescription.registered_doctor_id) {
        postBody.registered_doctor_id = extractId(
          prescription.registered_doctor_id
        );
      }
    } else {
      if (appointment.registered_doctor_id) {
        postBody.registered_doctor_id = appointment.registered_doctor_id;
      } else if (appointment.doctor_id) {
        postBody.doctor_id = appointment.doctor_id;
      } else {
        setError(
          "No doctor found for this appointment. Cannot create prescription."
        );
        return;
      }
    }

    // Remove undefined fields
    Object.keys(postBody).forEach((key) => {
      if (postBody[key] === undefined || postBody[key] === null) {
        delete postBody[key];
      }
    });

    const url = isEditing
      ? `https://doctors-bd-backend.vercel.app/api/v1/prescriptions/${prescription._id}`
      : "https://doctors-bd-backend.vercel.app/api/v1/prescriptions";
    const method = isEditing ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${doctorToken}`,
        },
        body: JSON.stringify(postBody),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(
          isEditing
            ? "Prescription updated successfully!"
            : "Prescription created and sent!"
        );
        onUpdated && onUpdated();
        onClose();
      } else {
        setMessage(
          data.message ||
            `Failed to ${isEditing ? "update" : "create"} prescription.`
        );
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  // Helper functions to safely extract display data
  const getPatientName = () => {
    if (isEditing && prescription) {
      if (
        prescription.patient_id &&
        typeof prescription.patient_id === "object" &&
        prescription.patient_id.name
      ) {
        return prescription.patient_id.name;
      }
      if (prescription.patient && prescription.patient.name) {
        return prescription.patient.name;
      }
      return "Patient";
    }
    return appointment.patient_id?.name || "Patient";
  };

  const getAppointmentDate = () => {
    if (isEditing && prescription) {
      if (
        prescription.appointment_id &&
        typeof prescription.appointment_id === "object" &&
        prescription.appointment_id.date
      ) {
        return prescription.appointment_id.date;
      }
      if (prescription.appointment && prescription.appointment.date) {
        return prescription.appointment.date;
      }
      return prescription.date || "No date";
    }
    return appointment.date || "No date";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full relative max-h-[90vh] overflow-y-auto"
        style={{ margin: "40px 0" }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 text-2xl hover:text-gray-700"
        >
          &times;
        </button>
        <h3 className="text-2xl font-bold text-purple-700 mb-6 text-center">
          {isEditing ? "Edit Prescription" : "Create Prescription"}
        </h3>
        {error && (
          <div className="mb-4 text-center text-red-600 font-semibold">
            {error}
          </div>
        )}

        {/* Patient and appointment info */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Patient
          </label>
          <div className="px-3 py-2 border border-gray-200 rounded bg-gray-50">
            {getPatientName()}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Appointment Date
          </label>
          <div className="px-3 py-2 border border-gray-200 rounded bg-gray-50">
            {getAppointmentDate()}
          </div>
        </div>

        {/* Medicine search */}
        <MedicineSearchForPrescription
          onMedicineSelect={handleMedicineSelect}
        />

        {/* Medicines section */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Medicines
          </label>
          {medicines.map((med, i) => (
            <div key={i} className="flex gap-2 mb-2 flex-wrap">
              <input
                name="name"
                placeholder="Medicine"
                value={med.name}
                onChange={(e) => handleMedChange(i, e)}
                required
                className="w-1/3 px-3 py-2 border border-gray-300 rounded"
              />
              <input
                name="strength"
                placeholder="Strength (e.g. 500mg)"
                value={med.strength}
                onChange={(e) => handleMedChange(i, e)}
                className="w-1/4 px-3 py-2 border border-gray-300 rounded"
              />
              <div className="w-1/4 flex gap-1">
                <select
                  name="timing"
                  value={
                    timingOptions.some((opt) => opt.value === med.timing)
                      ? med.timing
                      : "custom"
                  }
                  onChange={(e) => handleTimingChange(i, e)}
                  required
                  className="flex-1 px-3 py-2 border border-gray-300 rounded"
                >
                  {timingOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {!timingOptions.some((opt) => opt.value === med.timing) && (
                  <input
                    name="timing"
                    placeholder="Custom timing"
                    value={med.timing}
                    onChange={(e) => handleMedChange(i, e)}
                    required
                    className="flex-1 px-3 py-2 border border-gray-300 rounded"
                  />
                )}
              </div>
              <input
                name="duration"
                placeholder="Duration (e.g. 10 days)"
                value={med.duration}
                onChange={(e) => handleMedChange(i, e)}
                required
                className="w-1/4 px-3 py-2 border border-gray-300 rounded"
              />
              <input
                name="instructions"
                placeholder="Instructions"
                value={med.instructions}
                onChange={(e) => handleMedChange(i, e)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
              <button
                type="button"
                onClick={() => removeMedicine(i)}
                className="text-red-500 font-bold px-2"
                title="Remove"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addMedicine}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs"
          >
            + Add Medicine
          </button>
        </div>

        {/* Advice and follow-up */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Advice</label>
          <textarea
            placeholder="Advice"
            value={advice}
            onChange={(e) => setAdvice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={2}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">
            Follow-up Date
          </label>
          <input
            type="date"
            placeholder="Follow-up Date"
            value={followUpDate}
            onChange={(e) => setFollowUpDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
          >
            {isEditing ? "Update Prescription" : "Save & Send"}
          </button>
        </div>
        {message && (
          <div className="mt-4 text-center text-green-700 font-semibold">
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default PrescriptionForm;
