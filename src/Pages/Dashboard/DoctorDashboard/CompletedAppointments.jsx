import React, { useEffect, useState } from "react";

const CompletedAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [selected, setSelected] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const doctorToken = localStorage.getItem("doctorToken");
  let doctorEmail = null;
  try {
    doctorEmail = doctorToken
      ? JSON.parse(atob(doctorToken.split(".")[1])).email
      : null;
  } catch (err) {
    doctorEmail = null;
    console.log(err);
  }

  // 1. Fetch doctor by email to get ID
  useEffect(() => {
    if (!doctorEmail) {
      setError("Doctor email not found in token.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/registered-doctors/by-email?email=${doctorEmail}`,
      {
        headers: { Authorization: `Bearer ${doctorToken}` },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?._id) {
          setDoctorId(data.data._id);
        } else {
          setError("Doctor not found.");
          setLoading(false);
        }
      })
      .catch(() => {
        setError("Failed to fetch doctor info.");
        setLoading(false);
      });
  }, [doctorEmail, doctorToken]);

  // 2. Fetch completed appointments by doctorId
  useEffect(() => {
    if (!doctorId) return;
    setLoading(true);
    setError(null);
    fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/appointments/registered-doctor/${doctorId}`,
      {
        headers: { Authorization: `Bearer ${doctorToken}` },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const completed = (data.data || []).filter(
          (a) => a.status === "completed"
        );
        setAppointments(completed);
        setFiltered(completed);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch appointments.");
        setLoading(false);
      });
  }, [doctorId, doctorToken]);

  // Filter by patient name and date
  useEffect(() => {
    let result = appointments;
    if (search) {
      result = result.filter((a) =>
        a.patient_id?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (date) {
      result = result.filter((a) => a.date === date);
    }
    setFiltered(result);
  }, [search, date, appointments]);

  // Example: Send reminder (demo)
  const handleSendReminder = (patient) => {
    alert(`Reminder sent to ${patient?.name} (${patient?.phone})`);
  };

  // Example: Schedule follow-up (demo)
  const handleScheduleFollowUp = (appointment) => {
    alert(`Schedule follow-up for ${appointment.patient_id?.name}`);
    // Open a modal or redirect to follow-up form
  };

  // Example: Add/Edit notes (demo)
  const handleAddNote = (appointment) => {
    const note = prompt(
      "Enter note for this appointment:",
      appointment.note || ""
    );
    if (note !== null) {
      setAppointments((prev) =>
        prev.map((a) => (a._id === appointment._id ? { ...a, note } : a))
      );
    }
  };

  if (loading) {
    return (
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-purple-700 mb-4">
          Completed Appointments
        </h3>
        <div className="text-center text-gray-400 py-8 text-lg font-semibold">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-purple-700 mb-4">
          Completed Appointments
        </h3>
        <div className="text-center text-red-500 py-8 text-lg font-semibold">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-2xl font-bold text-purple-700 mb-4">
        Completed Appointments
      </h3>
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by patient name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded w-full md:w-1/3"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3 py-2 border rounded w-full md:w-1/4"
        />
        <button
          onClick={() => {
            setSearch("");
            setDate("");
          }}
          className="bg-gray-300 text-gray-700 px-3 py-2 rounded"
        >
          Clear
        </button>
      </div>
      <ul className="divide-y">
        {filtered.length === 0 && (
          <li className="text-gray-400 py-2">No completed appointments.</li>
        )}
        {filtered.map((a) => (
          <li
            key={a._id}
            className="py-2 flex flex-col md:flex-row md:items-center md:gap-4"
          >
            <div className="flex-1">
              <span className="font-medium">
                {a.date} {a.time}
              </span>
              <span className="ml-2 text-gray-500 text-sm">
                {a.patient_id?.name}
              </span>
              <span className="ml-2 text-gray-400 text-xs">
                Status: {a.status}
              </span>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              {/* View Details */}
              <button
                onClick={() => setSelected(a)}
                className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
              >
                View Details
              </button>
              {/* Download Prescription */}
              {a.prescription_id && (
                <a
                  href={`https://doctors-bd-backend.vercel.app/api/v1/prescriptions/${a.prescription_id}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-purple-700 text-white px-2 py-1 rounded text-xs hover:bg-purple-800"
                >
                  Download Prescription
                </a>
              )}
              {/* Write/Update Prescription */}
              {!a.prescription_id && (
                <button
                  onClick={() => alert("Open prescription form")}
                  className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                >
                  Write Prescription
                </button>
              )}
              {/* Schedule Follow-Up */}
              <button
                onClick={() => handleScheduleFollowUp(a)}
                className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600"
              >
                Schedule Follow-Up
              </button>
              {/* Send Reminder */}
              <button
                onClick={() => handleSendReminder(a.patient_id)}
                className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-400"
              >
                Send Reminder
              </button>
              {/* Add/Edit Notes */}
              <button
                onClick={() => handleAddNote(a)}
                className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-300"
              >
                {a.note ? "Edit Note" : "Add Note"}
              </button>
            </div>
          </li>
        ))}
      </ul>
      {/* Details Modal (optional) */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded shadow max-w-lg w-full relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-2 text-gray-500 text-xl"
            >
              &times;
            </button>
            <h4 className="text-lg font-bold mb-2">Appointment Details</h4>
            <div className="mb-2">
              <span className="font-medium">Patient:</span>{" "}
              {selected.patient_id?.name}
            </div>
            <div className="mb-2">
              <span className="font-medium">Date:</span> {selected.date}{" "}
              {selected.time}
            </div>
            <div className="mb-2">
              <span className="font-medium">Status:</span> {selected.status}
            </div>
            <div className="mb-2">
              <span className="font-medium">Note:</span>{" "}
              {selected.note || <span className="text-gray-400">None</span>}
            </div>
            {/* Add more details as needed */}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletedAppointments;
