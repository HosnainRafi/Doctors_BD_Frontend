import React, { useState } from "react";

const PrescriptionForm = ({ appointment, onClose, onCreated }) => {
  const [medicines, setMedicines] = useState([
    { name: "", dose: "", instructions: "" },
  ]);
  const [advice, setAdvice] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [message, setMessage] = useState("");

  const handleMedChange = (i, e) => {
    const newMeds = [...medicines];
    newMeds[i][e.target.name] = e.target.value;
    setMedicines(newMeds);
  };

  const addMedicine = () =>
    setMedicines([...medicines, { name: "", dose: "", instructions: "" }]);
  const removeMedicine = (i) =>
    setMedicines(medicines.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const doctorToken = localStorage.getItem("doctorToken");
    const res = await fetch("http://localhost:5000/api/v1/prescriptions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${doctorToken}`,
      },
      body: JSON.stringify({
        appointment_id: appointment._id,
        patient_id: appointment.patient_id._id,
        registered_doctor_id: appointment.registered_doctor_id?._id,
        date: new Date().toISOString().slice(0, 10),
        medicines,
        advice,
        follow_up_date: followUpDate,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage("Prescription created and sent!");
      onCreated && onCreated();
      onClose();
    } else setMessage(data.message || "Failed to create prescription.");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow max-w-lg w-full"
      >
        <h3 className="text-lg font-bold mb-4">Create Prescription</h3>
        {medicines.map((med, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              name="name"
              placeholder="Medicine"
              value={med.name}
              onChange={(e) => handleMedChange(i, e)}
              required
              className="input"
            />
            <input
              name="dose"
              placeholder="Dose"
              value={med.dose}
              onChange={(e) => handleMedChange(i, e)}
              required
              className="input"
            />
            <input
              name="instructions"
              placeholder="Instructions"
              value={med.instructions}
              onChange={(e) => handleMedChange(i, e)}
              className="input"
            />
            <button
              type="button"
              onClick={() => removeMedicine(i)}
              className="text-red-500 font-bold"
            >
              X
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addMedicine}
          className="bg-blue-500 text-white px-2 py-1 rounded mb-2"
        >
          Add Medicine
        </button>
        <textarea
          placeholder="Advice"
          value={advice}
          onChange={(e) => setAdvice(e.target.value)}
          className="input w-full mb-2"
        />
        <input
          type="date"
          placeholder="Follow-up Date"
          value={followUpDate}
          onChange={(e) => setFollowUpDate(e.target.value)}
          className="input w-full mb-2"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-purple-700 text-white px-4 py-2 rounded"
          >
            Save & Send
          </button>
        </div>
        {message && <div className="mt-2 text-sm">{message}</div>}
      </form>
    </div>
  );
};

export default PrescriptionForm;
