import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import MedicineSearchForPrescription from './MedicineSearchForPrescription';
import { FiPlus, FiTrash, FiX } from 'react-icons/fi';

const PrescriptionForm = ({
  appointment,
  prescription,
  onClose,
  onUpdated,
}) => {
  const isEditing = !!prescription;
  const [medicines, setMedicines] = useState([
    { name: '', strength: '', timing: '', duration: '', instructions: '' },
  ]);
  const [advice, setAdvice] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const doctorToken = localStorage.getItem('doctorToken');

  const timingOptions = [
    { value: '', label: 'Select timing' },
    { value: '1+0+0', label: 'Morning' },
    { value: '0+1+0', label: 'Noon' },
    { value: '0+0+1', label: 'Evening' },
    { value: '1+1+0', label: 'Morning + Noon' },
    { value: '1+0+1', label: 'Morning + Evening' },
    { value: '0+1+1', label: 'Noon + Evening' },
    { value: '1+1+1', label: 'Morning + Noon + Evening' },
    { value: '2+0+0', label: '2 times Morning' },
    { value: '0+2+0', label: '2 times Noon' },
    { value: '0+0+2', label: '2 times Evening' },
    { value: 'custom', label: 'Custom timing' },
  ];

  useEffect(() => {
    if (isEditing && prescription) {
      const formattedMedicines = prescription.medicines.map(med => {
        let strength = '';
        let instructions = med.instructions || '';
        const strengthMatch = instructions.match(/Strength:\s*([^,]+)/i);
        if (strengthMatch) {
          strength = strengthMatch[1].trim();
          instructions = instructions
            .replace(/Strength:\s*([^,]+)/i, '')
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
      setAdvice(prescription.advice || '');
      setFollowUpDate(prescription.follow_up_date || '');
    }
  }, [isEditing, prescription]);

  const handleMedChange = (i, e) => {
    const newMeds = [...medicines];
    newMeds[i][e.target.name] = e.target.value;
    setMedicines(newMeds);
  };

  const handleTimingChange = (i, e) => {
    const newMeds = [...medicines];
    newMeds[i].timing = e.target.value === 'custom' ? '' : e.target.value;
    setMedicines(newMeds);
  };

  const addMedicine = () =>
    setMedicines([
      ...medicines,
      { name: '', strength: '', timing: '', duration: '', instructions: '' },
    ]);

  const removeMedicine = i =>
    setMedicines(medicines.filter((_, idx) => idx !== i));

  const handleMedicineSelect = medicineData => {
    const emptyIndex = medicines.findIndex(
      med => !med.name && !med.strength && !med.timing && !med.duration
    );
    if (emptyIndex !== -1) {
      const newMeds = [...medicines];
      newMeds[emptyIndex] = medicineData;
      setMedicines(newMeds);
    } else {
      setMedicines([...medicines, medicineData]);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setError('');

    const extractId = value =>
      typeof value === 'string' ? value : value?._id || null;

    const formattedMedicines = medicines.map(med => {
      let instructions = med.instructions || '';
      if (med.strength)
        instructions = `Strength: ${med.strength}. ${instructions}`.trim();
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

    if (isEditing) {
      if (prescription.doctor_id)
        postBody.doctor_id = extractId(prescription.doctor_id);
      else if (prescription.registered_doctor_id)
        postBody.registered_doctor_id = extractId(
          prescription.registered_doctor_id
        );
    } else {
      if (appointment.registered_doctor_id)
        postBody.registered_doctor_id = appointment.registered_doctor_id;
      else if (appointment.doctor_id)
        postBody.doctor_id = appointment.doctor_id;
      else
        return setError(
          'No doctor found for this appointment. Cannot create prescription.'
        );
    }

    Object.keys(postBody).forEach(
      key =>
        (postBody[key] === undefined || postBody[key] === null) &&
        delete postBody[key]
    );

    const url = isEditing
      ? `https://doctors-bd-backend.vercel.app/api/v1/prescriptions/${prescription._id}`
      : 'https://doctors-bd-backend.vercel.app/api/v1/prescriptions';

    try {
      const res = await fetch(url, {
        method: isEditing ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${doctorToken}`,
        },
        body: JSON.stringify(postBody),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(
          isEditing
            ? 'Prescription updated successfully!'
            : 'Prescription created and sent!'
        );
        onUpdated && onUpdated();
        onClose();
      } else {
        setMessage(
          data.message ||
            `Failed to ${isEditing ? 'update' : 'create'} prescription.`
        );
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const getPatientName = () => {
    if (isEditing && prescription) {
      return (
        prescription.patient_id?.name || prescription.patient?.name || 'Patient'
      );
    }
    return appointment.patient_id?.name || 'Patient';
  };

  const getAppointmentDate = () => {
    if (isEditing && prescription) {
      return (
        prescription.appointment_id?.date ||
        prescription.appointment?.date ||
        prescription.date ||
        'No date'
      );
    }
    return appointment.date || 'No date';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-3xl p-6 rounded-2xl shadow-xl relative overflow-y-auto max-h-[90vh] border border-purple-200"
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-5 text-gray-400 hover:text-red-500 text-2xl"
        >
          <FiX />
        </button>

        <h2 className="text-center text-3xl font-bold text-purple-700 mb-6">
          {isEditing ? 'Edit Prescription' : 'Create Prescription'}
        </h2>

        {error && (
          <p className="text-red-600 text-center mb-4 font-semibold">{error}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Patient
            </label>
            <div className="px-4 py-2 border rounded-md bg-gray-100 font-semibold text-gray-800">
              {getPatientName()}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Appointment Date
            </label>
            <div className="px-4 py-2 border rounded-md bg-gray-100 font-semibold text-gray-800">
              {getAppointmentDate()}
            </div>
          </div>
        </div>

        <MedicineSearchForPrescription
          onMedicineSelect={handleMedicineSelect}
        />

        <div className="mt-6">
          <label className="block text-base font-semibold text-gray-800 mb-2">
            Medicines
          </label>
          {medicines.map((med, i) => (
            <div
              key={i}
              className="flex flex-wrap items-center gap-3 mb-4 bg-purple-50 p-3 rounded-md"
            >
              <input
                name="name"
                value={med.name}
                onChange={e => handleMedChange(i, e)}
                placeholder="Medicine"
                className="flex-1 min-w-[120px] px-3 py-2 border rounded"
                required
              />
              <input
                name="strength"
                value={med.strength}
                onChange={e => handleMedChange(i, e)}
                placeholder="Strength"
                className="w-32 px-3 py-2 border rounded"
              />
              <select
                name="timing"
                value={
                  timingOptions.some(opt => opt.value === med.timing)
                    ? med.timing
                    : 'custom'
                }
                onChange={e => handleTimingChange(i, e)}
                className="w-40 px-3 py-2 border rounded"
              >
                {timingOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {!timingOptions.some(opt => opt.value === med.timing) && (
                <input
                  name="timing"
                  value={med.timing}
                  onChange={e => handleMedChange(i, e)}
                  placeholder="Custom timing"
                  className="w-40 px-3 py-2 border rounded"
                />
              )}
              <input
                name="duration"
                value={med.duration}
                onChange={e => handleMedChange(i, e)}
                placeholder="Duration"
                className="w-32 px-3 py-2 border rounded"
                required
              />
              <input
                name="instructions"
                value={med.instructions}
                onChange={e => handleMedChange(i, e)}
                placeholder="Instructions"
                className="flex-1 min-w-[150px] px-3 py-2 border rounded"
              />
              <button
                type="button"
                onClick={() => removeMedicine(i)}
                className="text-red-600 hover:text-red-800"
              >
                <FiTrash />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addMedicine}
            className="mt-2 inline-flex items-center gap-2 text-sm text-white bg-purple-700 px-4 py-2 rounded hover:bg-purple-800"
          >
            <FiPlus /> Add Medicine
          </button>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">
            Advice
          </label>
          <textarea
            value={advice}
            onChange={e => setAdvice(e.target.value)}
            rows={2}
            className="w-full mt-1 px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500"
          ></textarea>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Follow-up Date
          </label>
          <DatePicker
            selected={followUpDate ? new Date(followUpDate) : null}
            onChange={date =>
              setFollowUpDate(date ? date.toISOString().split('T')[0] : '')
            }
            dateFormat="yyyy-MM-dd"
            placeholderText="Select follow-up date"
            className="w-full mt-1 px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:outline-none"
            popperClassName="z-50"
            wrapperClassName="w-full"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-purple-700 text-white hover:bg-purple-800"
          >
            {isEditing ? 'Update Prescription' : 'Save & Send'}
          </button>
        </div>

        {message && (
          <p className="mt-4 text-green-600 text-center font-semibold">
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default PrescriptionForm;
