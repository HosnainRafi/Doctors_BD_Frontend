import React, { useState } from "react";

const SetAvailabilityForm = () => {
  const [slots, setSlots] = useState([{ date: "", time: "" }]);
  const [message, setMessage] = useState("");
  const doctorToken = localStorage.getItem("doctorToken");
  const doctorId = doctorToken
    ? JSON.parse(atob(doctorToken.split(".")[1])).id
    : null;

  const handleChange = (i, e) => {
    const newSlots = [...slots];
    newSlots[i][e.target.name] = e.target.value;
    setSlots(newSlots);
  };

  const addSlot = () => setSlots([...slots, { date: "", time: "" }]);
  const removeSlot = (i) => setSlots(slots.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch(`/api/v1/registered-doctors/${doctorId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${doctorToken}`,
      },
      body: JSON.stringify({ availableSlots: slots }),
    });
    const data = await res.json();
    if (data.success) setMessage("Availability updated!");
    else setMessage(data.message || "Failed to update.");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded mb-4">
      <h3 className="text-lg font-semibold mb-2">Set Availability</h3>
      {slots.map((slot, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input
            name="date"
            type="date"
            value={slot.date}
            onChange={(e) => handleChange(i, e)}
            className="input"
            required
          />
          <input
            name="time"
            type="time"
            value={slot.time}
            onChange={(e) => handleChange(i, e)}
            className="input"
            required
          />
          <button
            type="button"
            onClick={() => removeSlot(i)}
            className="text-red-500 font-bold"
          >
            X
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addSlot}
        className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
      >
        Add Slot
      </button>
      <button
        type="submit"
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Save
      </button>
      {message && <div className="mt-2 text-sm">{message}</div>}
    </form>
  );
};

export default SetAvailabilityForm;
