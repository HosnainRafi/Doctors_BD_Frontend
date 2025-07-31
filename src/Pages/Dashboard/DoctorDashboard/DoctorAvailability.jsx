import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2, FiWifiOff, FiWifi } from "react-icons/fi";

const DoctorAvailability = () => {
  const [slots, setSlots] = useState([{ date: "", time: "" }]);
  const [blockedSlots, setBlockedSlots] = useState([{ date: "", time: "" }]);
  const [isOnline, setIsOnline] = useState(false);

  const doctorToken = localStorage.getItem("doctorToken");
  const doctorId = localStorage.getItem("doctorId");

  useEffect(() => {
    if (!doctorId) return;
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://doctors-bd-backend.vercel.app/api/v1/registered-doctors/${doctorId}`,
          {
            headers: { Authorization: `Bearer ${doctorToken}` },
          }
        );
        const data = await res.json();
        setSlots(data.data?.availableSlots || [{ date: "", time: "" }]);
        setIsOnline(data.data?.isOnline || false);
        setBlockedSlots(data.data?.blockedSlots || [{ date: "", time: "" }]);
      } catch (error) {
        toast.error(error.message || "Failed to update availability.");
      }
    };
    fetchData();
  }, [doctorId, doctorToken]);

  const handleSlotChange = (i, e) => {
    const newSlots = [...slots];
    newSlots[i][e.target.name] = e.target.value;
    setSlots(newSlots);
  };

  const addSlot = () => setSlots([...slots, { date: "", time: "" }]);
  const removeSlot = (i) => setSlots(slots.filter((_, idx) => idx !== i));

  const handleBlockedSlotChange = (i, e) => {
    const newBlocked = [...blockedSlots];
    newBlocked[i][e.target.name] = e.target.value;
    setBlockedSlots(newBlocked);
  };

  const addBlockedSlot = () =>
    setBlockedSlots([...blockedSlots, { date: "", time: "" }]);
  const removeBlockedSlot = (i) =>
    setBlockedSlots(blockedSlots.filter((_, idx) => idx !== i));

  const handleOnlineToggle = async () => {
    if (!doctorId) {
      toast.error("Doctor ID not found. Please login again.");
      return;
    }
    try {
      await fetch(
        `https://doctors-bd-backend.vercel.app/api/v1/registered-doctors/${doctorId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${doctorToken}`,
          },
          body: JSON.stringify({ isOnline: !isOnline }),
        }
      );
      setIsOnline(!isOnline);
      toast.success(`You're now ${!isOnline ? "Online" : "Offline"}`);
    } catch (error) {
      toast.error(error.message || "Failed to update availability.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!doctorId) {
      toast.error("Doctor ID not found. Please login again.");
      return;
    }
    try {
      const res = await fetch(
        `https://doctors-bd-backend.vercel.app/api/v1/registered-doctors/${doctorId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${doctorToken}`,
          },
          body: JSON.stringify({ availableSlots: slots, blockedSlots }),
        }
      );
      const data = await res.json();
      if (data.success) toast.success("Availability updated!");
      else toast.error(data.message || "Failed to update.");
    } catch (error) {
      toast.error(error.message || "Failed to update availability.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-2xl rounded-2xl p-10 max-w-5xl mx-auto mt-10 space-y-10 border border-gray-100"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-purple-700">
          Doctor Availability
        </h2>
        <button
          type="button"
          onClick={handleOnlineToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-md transition-all duration-200 ${
            isOnline
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {isOnline ? (
            <FiWifi className="text-lg" />
          ) : (
            <FiWifiOff className="text-lg" />
          )}
          {isOnline ? "Online" : "Offline"}
        </button>
      </div>

      {/* Available Slots */}
      <div>
        <h3 className="text-lg font-semibold text-purple-700 mb-4 flex items-center gap-2">
          <FiWifi className="text-purple-700" /> Available Slots
        </h3>
        {slots.map((slot, i) => (
          <div
            key={i}
            className="group flex flex-col sm:flex-row gap-4 items-center mb-4 bg-gray-50 hover:bg-purple-50 p-4 rounded-xl border border-purple-100 transition"
          >
            <input
              name="date"
              type="date"
              value={slot.date}
              onChange={(e) => handleSlotChange(i, e)}
              className="w-full sm:w-1/2 border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
              required
            />
            <input
              name="time"
              type="time"
              value={slot.time}
              onChange={(e) => handleSlotChange(i, e)}
              className="w-full sm:w-1/2 border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
              required
            />
            <button
              type="button"
              onClick={() => removeSlot(i)}
              className="text-red-500 hover:text-red-700 transition"
              title="Remove slot"
            >
              <FiTrash2 size={20} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addSlot}
          className="flex items-center gap-2 bg-purple-700 text-white px-4 py-2 rounded-full hover:bg-purple-800 transition text-sm shadow-md"
        >
          <FiPlus /> Add Slot
        </button>
      </div>

      {/* Blocked Slots */}
      <div>
        <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
          <FiWifiOff className="text-red-700" /> Blocked Slots
        </h3>
        {blockedSlots.map((slot, i) => (
          <div
            key={i}
            className="group flex flex-col sm:flex-row gap-4 items-center mb-4 bg-red-50 hover:bg-red-100 p-4 rounded-xl border border-red-200 transition"
          >
            <input
              name="date"
              type="date"
              value={slot.date}
              onChange={(e) => handleBlockedSlotChange(i, e)}
              className="w-full sm:w-1/2 border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-red-400 focus:outline-none transition"
              required
            />
            <input
              name="time"
              type="time"
              value={slot.time}
              onChange={(e) => handleBlockedSlotChange(i, e)}
              className="w-full sm:w-1/2 border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-red-400 focus:outline-none transition"
              required
            />
            <button
              type="button"
              onClick={() => removeBlockedSlot(i)}
              className="text-red-600 hover:text-red-800 transition"
              title="Remove blocked slot"
            >
              <FiTrash2 size={20} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addBlockedSlot}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition text-sm shadow-md"
        >
          <FiPlus /> Add Blocked Slot
        </button>
      </div>

      {/* Submit Button */}
      <div className="text-right">
        <button
          type="submit"
          className="bg-purple-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-800 transition shadow-lg"
        >
          Save Availability
        </button>
      </div>
    </form>
  );
};

export default DoctorAvailability;
