import React, { useState } from 'react';

const PrescriptionForm = ({ appointment, onClose, onCreated }) => {
  console.log(appointment);
  const [medicines, setMedicines] = useState([
    { name: '', dose: '', instructions: '' },
  ]);
  const [advice, setAdvice] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const doctorToken = localStorage.getItem('doctorToken');

  const handleMedChange = (i, e) => {
    const newMeds = [...medicines];
    newMeds[i][e.target.name] = e.target.value;
    setMedicines(newMeds);
  };

  const addMedicine = () =>
    setMedicines([...medicines, { name: '', dose: '', instructions: '' }]);
  const removeMedicine = i =>
    setMedicines(medicines.filter((_, idx) => idx !== i));

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Build the POST body
    const postBody = {
      appointment_id: appointment._id,
      //registered_doctor_id: appointment.registered_doctor_id,
      patient_id: appointment.patient_id._id,
      date: new Date().toISOString().slice(0, 10),
      medicines,
      advice,
      follow_up_date: followUpDate,
    };

    // Always send the correct doctor field
    if (appointment.registered_doctor_id) {
      postBody.registered_doctor_id = appointment.registered_doctor_id;
    } else if (appointment.doctor_id && appointment.doctor_id) {
      postBody.doctor_id = appointment.doctor_id;
    } else {
      setError(
        'No doctor found for this appointment. Cannot create prescription.'
      );
      return;
    }

    // Debug: log the postBody
    // console.log("POST BODY:", postBody);

    const res = await fetch(
      'https://doctors-bd-backend.vercel.app/api/v1/prescriptions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${doctorToken}`,
        },
        body: JSON.stringify(postBody),
      }
    );
    const data = await res.json();
    if (data.success) {
      setMessage('Prescription created and sent!');
      onCreated && onCreated();
      onClose();
    } else setMessage(data.message || 'Failed to create prescription.');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full relative max-h-[90vh] overflow-y-auto"
        style={{ margin: '40px 0' }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 text-2xl hover:text-gray-700"
        >
          &times;
        </button>
        <h3 className="text-2xl font-bold text-purple-700 mb-6 text-center">
          Create Prescription
        </h3>
        {error && (
          <div className="mb-4 text-center text-red-600 font-semibold">
            {error}
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Patient
          </label>
          <div className="px-3 py-2 border border-gray-200 rounded bg-gray-50">
            {appointment.patient_id?.name}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Appointment Date
          </label>
          <div className="px-3 py-2 border border-gray-200 rounded bg-gray-50">
            {appointment.date}
          </div>
        </div>
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
                onChange={e => handleMedChange(i, e)}
                required
                className="w-1/3 px-3 py-2 border border-gray-300 rounded"
              />
              <input
                name="dose"
                placeholder="Dose"
                value={med.dose}
                onChange={e => handleMedChange(i, e)}
                required
                className="w-1/4 px-3 py-2 border border-gray-300 rounded"
              />
              <input
                name="timing"
                placeholder="Timing (e.g. ১+০+১)"
                value={med.timing}
                onChange={e => handleMedChange(i, e)}
                required
                className="w-1/4 px-3 py-2 border border-gray-300 rounded"
              />
              <input
                name="duration"
                placeholder="Duration (e.g. 10 days)"
                value={med.duration}
                onChange={e => handleMedChange(i, e)}
                required
                className="w-1/4 px-3 py-2 border border-gray-300 rounded"
              />
              <input
                name="instructions"
                placeholder="Instructions"
                value={med.instructions}
                onChange={e => handleMedChange(i, e)}
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
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Advice</label>
          <textarea
            placeholder="Advice"
            value={advice}
            onChange={e => setAdvice(e.target.value)}
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
            onChange={e => setFollowUpDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
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
            Save & Send
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
