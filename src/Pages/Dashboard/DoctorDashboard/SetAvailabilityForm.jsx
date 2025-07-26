import React, { useEffect, useState } from 'react';

const SetAvailabilityForm = () => {
  const [slots, setSlots] = useState([{ date: '', time: '' }]);
  const [blockedSlots, setBlockedSlots] = useState([{ date: '', time: '' }]);
  const [isOnline, setIsOnline] = useState(false);
  const [message, setMessage] = useState('');
  const doctorToken = localStorage.getItem('doctorToken');
  const doctorId = localStorage.getItem('doctorId');

  useEffect(() => {
    if (!doctorId) return;
    fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/registered-doctors/${doctorId}`,
      {
        headers: { Authorization: `Bearer ${doctorToken}` },
      }
    )
      .then(res => res.json())
      .then(data => {
        setSlots(data.data?.availableSlots || [{ date: '', time: '' }]);
        setIsOnline(data.data?.isOnline || false);
        setBlockedSlots(data.data?.blockedSlots || [{ date: '', time: '' }]);
      });
  }, [doctorId, doctorToken]);

  const handleSlotChange = (i, e) => {
    const newSlots = [...slots];
    newSlots[i][e.target.name] = e.target.value;
    setSlots(newSlots);
  };
  const addSlot = () => setSlots([...slots, { date: '', time: '' }]);
  const removeSlot = i => setSlots(slots.filter((_, idx) => idx !== i));

  const handleBlockedSlotChange = (i, e) => {
    const newBlocked = [...blockedSlots];
    newBlocked[i][e.target.name] = e.target.value;
    setBlockedSlots(newBlocked);
  };
  const addBlockedSlot = () =>
    setBlockedSlots([...blockedSlots, { date: '', time: '' }]);
  const removeBlockedSlot = i =>
    setBlockedSlots(blockedSlots.filter((_, idx) => idx !== i));

  const handleOnlineToggle = async () => {
    if (!doctorId) {
      setMessage('Doctor ID not found. Please login again.');
      return;
    }
    setIsOnline(!isOnline);
    await fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/registered-doctors/${doctorId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${doctorToken}`,
        },
        body: JSON.stringify({ isOnline: !isOnline }),
      }
    );
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    if (!doctorId) {
      setMessage('Doctor ID not found. Please login again.');
      return;
    }
    const res = await fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/registered-doctors/${doctorId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${doctorToken}`,
        },
        body: JSON.stringify({ availableSlots: slots, blockedSlots }),
      }
    );
    const data = await res.json();
    if (data.success) setMessage('Availability updated!');
    else setMessage(data.message || 'Failed to update.');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded mb-4">
      <div className="flex items-center mb-4">
        <span className="font-semibold mr-2">Online Status:</span>
        <button
          type="button"
          onClick={handleOnlineToggle}
          className={`px-4 py-1 rounded font-bold ${
            isOnline ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-700'
          }`}
        >
          {isOnline ? 'Online' : 'Offline'}
        </button>
      </div>
      <h3 className="text-lg font-semibold mb-2">Available Slots</h3>
      {slots.map((slot, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input
            name="date"
            type="date"
            value={slot.date}
            onChange={e => handleSlotChange(i, e)}
            className="w-32 px-2 py-1 border rounded"
            required
          />
          <input
            name="time"
            type="time"
            value={slot.time}
            onChange={e => handleSlotChange(i, e)}
            className="w-24 px-2 py-1 border rounded"
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
        className="bg-blue-500 text-white px-2 py-1 rounded mr-2 mb-2"
      >
        Add Slot
      </button>

      <h3 className="text-lg font-semibold mb-2 mt-4">
        Blocked Slots (Vacation/Leave)
      </h3>
      {blockedSlots.map((slot, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input
            name="date"
            type="date"
            value={slot.date}
            onChange={e => handleBlockedSlotChange(i, e)}
            className="w-32 px-2 py-1 border rounded"
            required
          />
          <input
            name="time"
            type="time"
            value={slot.time}
            onChange={e => handleBlockedSlotChange(i, e)}
            className="w-24 px-2 py-1 border rounded"
            required
          />
          <button
            type="button"
            onClick={() => removeBlockedSlot(i)}
            className="text-red-500 font-bold"
          >
            X
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addBlockedSlot}
        className="bg-red-500 text-white px-2 py-1 rounded mr-2 mb-2"
      >
        Add Blocked Slot
      </button>

      <div className="flex justify-end gap-2 mt-4">
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Save
        </button>
      </div>
      {message && <div className="mt-2 text-sm">{message}</div>}
    </form>
  );
};

export default SetAvailabilityForm;
