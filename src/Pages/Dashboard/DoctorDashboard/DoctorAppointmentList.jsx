import React, { useEffect, useState } from "react";
import PrescriptionForm from "./PrescriptionForm";
import {
  FaUser,
  FaVideo,
  FaClipboard,
  FaCheckCircle,
  FaTimesCircle,
  FaNotesMedical,
} from "react-icons/fa";
import toast from "react-hot-toast";

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "completed":
      return "bg-blue-100 text-blue-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const DoctorAppointmentList = () => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorId, setDoctorId] = useState(null);
  const [error, setError] = useState(null);

  const doctorToken = localStorage.getItem("doctorToken");
  let doctorEmail = null;
  try {
    doctorEmail = doctorToken
      ? JSON.parse(atob(doctorToken.split(".")[1])).email
      : null;
  } catch (err) {
    doctorEmail = null;
    console.error(err);
  }

  useEffect(() => {
    const fetchDoctorId = async () => {
      if (!doctorEmail) {
        setError("Doctor email not found in token.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await fetch(
          `https://doctors-bd-backend.vercel.app/api/v1/registered-doctors/by-email?email=${doctorEmail}`,
          {
            headers: { Authorization: `Bearer ${doctorToken}` },
          }
        );
        const data = await res.json();
        if (data?.data?._id) {
          setDoctorId(data.data._id);
        } else {
          setError("Doctor not found.");
        }
      } catch {
        setError("Failed to fetch doctor info.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorId();
  }, [doctorEmail, doctorToken]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!doctorId) return;
      try {
        setLoading(true);
        const res = await fetch(
          `https://doctors-bd-backend.vercel.app/api/v1/appointments/registered-doctor/${doctorId}`,
          {
            headers: { Authorization: `Bearer ${doctorToken}` },
          }
        );
        const data = await res.json();
        setAppointments(data.data || []);
      } catch {
        setError("Failed to fetch appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorId, doctorToken]);

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = appointments.filter(
    (a) => a.date > today && a.status !== "cancelled"
  );
  const todayList = appointments.filter(
    (a) => a.date === today && a.status !== "cancelled"
  );
  const past = appointments.filter(
    (a) =>
      a.date < today || a.status === "completed" || a.status === "cancelled"
  );

  const handleStatusChange = async (id, status) => {
    try {
      await fetch(
        `https://doctors-bd-backend.vercel.app/api/v1/appointments/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${doctorToken}`,
          },
          body: JSON.stringify({ status }),
        }
      );
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a))
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleStartVideoCall = (appointment) => {
    window.open(`https://meet.jit.si/doctorbd-${appointment._id}`, "_blank");
  };

  const hasAnyAppointments =
    todayList.length > 0 || upcoming.length > 0 || past.length > 0;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-purple-200">
      <h2 className="text-3xl font-bold text-purple-700 mb-6 flex items-center gap-2">
        <FaClipboard className="text-purple-700" />
        Doctor Appointments
      </h2>

      {loading && (
        <div className="text-center text-gray-500 py-8 text-lg animate-pulse">
          Loading appointments...
        </div>
      )}

      {error && (
        <div className="text-center text-red-500 py-8 text-lg font-medium">
          {error}
        </div>
      )}

      {selectedAppointment && (
        <PrescriptionForm
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onCreated={() => setSelectedAppointment(null)}
        />
      )}

      {!loading && !error && (
        <>
          <Section title="Today's Appointments">
            <AppointmentTable
              appointments={todayList}
              onStatusChange={handleStatusChange}
              onStartVideoCall={handleStartVideoCall}
              onCreatePrescription={setSelectedAppointment}
            />
          </Section>

          <Section title="Upcoming Appointments">
            <AppointmentTable
              appointments={upcoming}
              onStatusChange={handleStatusChange}
              onStartVideoCall={handleStartVideoCall}
              onCreatePrescription={setSelectedAppointment}
            />
          </Section>

          <Section title="Past Appointments">
            <AppointmentTable
              appointments={past}
              onStatusChange={handleStatusChange}
              onStartVideoCall={handleStartVideoCall}
              onCreatePrescription={setSelectedAppointment}
              isPast
            />
          </Section>

          {!hasAnyAppointments && (
            <div className="text-center text-gray-400 py-8 text-lg font-semibold">
              No appointments found.
            </div>
          )}
        </>
      )}
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold mb-4 text-purple-600 border-b pb-1 border-purple-300">
      {title}
    </h3>
    {children}
  </div>
);

const AppointmentTable = ({
  appointments,
  onStatusChange,
  onStartVideoCall,
  onCreatePrescription,
  isPast,
}) => (
  <div className="overflow-x-auto rounded-lg shadow ring-1 ring-black ring-opacity-5">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-purple-100">
        <tr>
          <th className="px-4 py-2 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
            Date
          </th>
          <th className="px-4 py-2 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
            Time
          </th>
          <th className="px-4 py-2 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
            Patient
          </th>
          <th className="px-4 py-2 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
            Status
          </th>
          <th className="px-4 py-2 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {appointments.length === 0 && (
          <tr>
            <td colSpan={5} className="text-center py-4 text-gray-400">
              No appointments
            </td>
          </tr>
        )}
        {appointments.map((a) => (
          <tr key={a._id}>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
              {a.date}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
              {a.time}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <FaUser className="text-purple-500" />
                <span className="font-medium">{a.patient_id?.name}</span>
              </div>
              <div className="text-xs text-gray-500">{a.patient_id?.phone}</div>
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                  a.status
                )}`}
              >
                {a.status}
              </span>
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
              <div className="flex flex-wrap gap-2">
                {!isPast && a.status === "pending" && (
                  <>
                    <button
                      onClick={() => onStatusChange(a._id, "confirmed")}
                      className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1 rounded shadow"
                    >
                      <FaCheckCircle className="inline-block mr-1" /> Accept
                    </button>
                    <button
                      onClick={() => onStatusChange(a._id, "cancelled")}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1 rounded shadow"
                    >
                      <FaTimesCircle className="inline-block mr-1" /> Cancel
                    </button>
                  </>
                )}
                {!isPast && a.status === "confirmed" && (
                  <>
                    <button
                      onClick={() => onStatusChange(a._id, "completed")}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1 rounded shadow"
                    >
                      <FaCheckCircle className="inline-block mr-1" /> Completed
                    </button>
                    <button
                      onClick={() => onStartVideoCall(a)}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-3 py-1 rounded shadow"
                    >
                      <FaVideo className="inline-block mr-1" /> Video Call
                    </button>
                  </>
                )}
                {a.status === "completed" && onCreatePrescription && (
                  <button
                    onClick={() => onCreatePrescription(a)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1 rounded shadow"
                  >
                    <FaNotesMedical className="inline-block mr-1" />{" "}
                    Prescription
                  </button>
                )}
                <button
                  onClick={() => alert(JSON.stringify(a.patient_id, null, 2))}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold px-3 py-1 rounded shadow"
                >
                  Patient Details
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DoctorAppointmentList;
