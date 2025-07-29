import React, { useEffect, useState } from "react";
import {
  HiBell,
  HiOutlineUserCircle,
  HiRefresh,
  HiVideoCamera,
  HiX,
} from "react-icons/hi";
import { ImSpinner10 } from "react-icons/im";
import toast, { Toaster } from "react-hot-toast";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reminderMsg, setReminderMsg] = useState("");
  const [rescheduleId, setRescheduleId] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [userId, setUserId] = useState("");

  const token = localStorage.getItem("userToken");
  const email = token ? JSON.parse(atob(token.split(".")[1])).email : null;

  // 1. On mount, get userId by email
  useEffect(() => {
    const fetchUserId = async () => {
      if (!email) return;
      setLoading(true);
      try {
        const res = await fetch(
          `https://doctors-bd-backend.vercel.app/api/v1/users?email=${encodeURIComponent(
            email
          )}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (data && data.data && data.data._id) {
          setUserId(data.data._id);
        } else {
          toast.error("User not found for this email.");
        }
      } catch (err) {
        toast.error("Error fetching user info.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserId();
  }, [email, token]);

  // 2. When userId is set, fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!userId) {
        setAppointments([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `https://doctors-bd-backend.vercel.app/api/v1/appointments?user_id=${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setAppointments(data.data || []);
      } catch (error) {
        toast.error("Error fetching appointments.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [userId, token]);

  const handleCancel = async (id) => {
    try {
      await fetch(
        `https://doctors-bd-backend.vercel.app/api/v1/appointments/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "cancelled" }),
        }
      );
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "cancelled" } : a))
      );
      toast.success("Appointment cancelled successfully");
    } catch (error) {
      toast.error("Failed to cancel appointment", error);
    }
  };

  const handleReschedule = (id, currentDate, currentTime) => {
    setRescheduleId(id);
    setNewDate(currentDate);
    setNewTime(currentTime);
  };

  const handleSubmitReschedule = async (id) => {
    try {
      await fetch(
        `https://doctors-bd-backend.vercel.app/api/v1/appointments/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ date: newDate, time: newTime }),
        }
      );
      setAppointments((prev) =>
        prev.map((a) =>
          a._id === id ? { ...a, date: newDate, time: newTime } : a
        )
      );
      setRescheduleId(null);
      setNewDate("");
      setNewTime("");
      toast.success("Appointment rescheduled successfully");
    } catch (error) {
      toast.error("Failed to reschedule appointment", error);
    }
  };

  const handleStartVideoCall = (appointment) => {
    window.open(`https://meet.jit.si/doctorbd-${appointment._id}`, "_blank");
  };

  const handleSendReminder = async (appointment) => {
    setReminderMsg("");
    try {
      const res = await fetch(
        `https://doctors-bd-backend.vercel.app/api/v1/appointments/${appointment._id}/reminder`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data.success) {
        setReminderMsg("Reminder sent!");
        toast.success("Reminder sent successfully");
      } else {
        setReminderMsg(data.message || "Failed to send reminder.");
        toast.error(data.message || "Failed to send reminder.");
      }
    } catch (error) {
      toast.error("Error sending reminder", error);
    } finally {
      setTimeout(() => setReminderMsg(""), 2000);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateStr, timeStr) => {
    const [hours, minutes] = timeStr.split(":");
    const date = new Date(dateStr);
    date.setHours(hours);
    date.setMinutes(minutes);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">
          My Appointments
        </h3>
        <a
          href={`/dashboard/user/book-appointment?userId=${userId}`}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          Book New Appointment
        </a>
      </div>

      {loading && appointments.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <ImSpinner10 size={40} className="animate-spin text-purple-600" />
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.length === 0 && (
            <div className="text-gray-400">No appointments found.</div>
          )}

          {appointments.map((a) => (
            <div
              key={a._id}
              className="bg-white border border-purple-500 rounded-lg shadow-sm p-6 md:p-8 transition hover:shadow-md "
            >
              <h2 className="text-3xl font-bold text-purple-700 pb-3 text-center">
                Appointment Details
              </h2>
              <hr className="border-t border-t-purple-700" />

              <div className="flex flex-col gap-4 mt-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* doctors details */}
                  <div className="border border-purple-700 p-5 rounded-2xl shadow-md bg-white">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xl">
                        {a.registered_doctor_id?.name?.charAt(0) || "D"}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm text-purple-700 font-semibold uppercase tracking-wide">
                          Doctor Info
                        </h3>
                        <h2 className="font-semibold text-lg md:text-xl text-gray-800 flex items-center gap-2">
                          {a.doctor_id?.name ||
                            a.registered_doctor_id?.name ||
                            "Unassigned"}
                          {a.registered_doctor_id?.isOnline ? (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              Online
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                              Offline
                            </span>
                          )}
                        </h2>
                        <div>
                          {(a.registered_doctor_id?.specialty ||
                            a.registered_doctor_id?.degree_names?.length >
                              0) && (
                            <div className="text-sm text-gray-600 mt-1 space-y-0.5">
                              {a.registered_doctor_id?.specialty && (
                                <div>
                                  <span className="font-medium text-gray-700">
                                    Specialty:
                                  </span>{" "}
                                  {a.registered_doctor_id.specialty}
                                </div>
                              )}
                              {a.registered_doctor_id?.degree_names?.length >
                                0 && (
                                <div>
                                  <span className="font-medium text-gray-700">
                                    Degrees:
                                  </span>{" "}
                                  {a.registered_doctor_id.degree_names.join(
                                    ", "
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex justify-end mt-1">
                          {a.status !== "cancelled" &&
                            a.status !== "completed" && (
                              <button
                                onClick={() =>
                                  alert(
                                    JSON.stringify(
                                      a.doctor_id || a.registered_doctor_id,
                                      null,
                                      2
                                    )
                                  )
                                }
                                className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-full text-xs font-medium shadow-sm hover:bg-purple-700 transition duration-200"
                              >
                                <HiOutlineUserCircle className="w-4 h-4" />
                                Doctor Details
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* patient details */}
                  <div className="border border-purple-700 p-5 rounded-2xl shadow-md bg-white">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full truncate bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xl">
                        {a.patient_id?.name?.charAt(0) || "P"}
                      </div>
                      <div className="w-full">
                        <h3 className="text-sm text-purple-700 font-semibold uppercase tracking-wide">
                          Patient Info
                        </h3>
                        <h2 className="font-semibold text-lg md:text-xl text-gray-800">
                          {a.patient_id?.name || "Unknown"}
                        </h2>
                        <div className="text-sm text-gray-700 mt-2 space-y-1">
                          <p className="font-medium text-gray-800 flex items-center text-sm">
                            <span className="pr-3 border-r-2 border-gray-400">
                              Gender: {a.patient_id?.gender || "N/A"}
                            </span>
                            <span className="pl-3">
                              Weight:{" "}
                              {a.patient_id?.weight
                                ? `${a.patient_id.weight} kg`
                                : "N/A"}
                            </span>
                          </p>
                          {a.patient_id?.address && (
                            <div>
                              <span className="font-medium text-gray-800">
                                Address:
                              </span>{" "}
                              {a.patient_id.address}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* appointment details */}
                <div className="border border-purple-700 p-5 rounded-2xl shadow-md bg-white">
                  <h3 className="text-base font-semibold text-purple-700 mb-4">
                    Appointment Details
                  </h3>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex items-center text-gray-800 font-semibold text-base space-x-2">
                      <span className="text-purple-800">
                        {formatDate(a.date)}
                      </span>
                      <span className="text-gray-500">•</span>
                      <span>{formatTime(a.date, a.time)}</span>
                    </div>
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold text-white uppercase ${
                        a.status === "confirmed"
                          ? "bg-green-500"
                          : a.status === "cancelled"
                          ? "bg-red-500"
                          : "bg-blue-500"
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>

                  {a.reason && (
                    <div className="mt-4 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <span className="font-medium text-gray-800">Reason:</span>{" "}
                      {a.reason}
                    </div>
                  )}

                  <div className="flex flex-wrap justify-end gap-2 mt-4">
                    {a.status !== "cancelled" && a.status !== "completed" && (
                      <>
                        <button
                          onClick={() => handleCancel(a._id)}
                          className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full text-xs font-medium shadow-sm hover:bg-red-700 transition"
                        >
                          <HiX className="w-4 h-4" />
                          Cancel
                        </button>
                        <button
                          onClick={() =>
                            handleReschedule(a._id, a.date, a.time)
                          }
                          className="inline-flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-full text-xs font-medium shadow-sm hover:bg-yellow-600 transition"
                        >
                          <HiRefresh className="w-4 h-4" />
                          Reschedule
                        </button>
                      </>
                    )}

                    {a.registered_doctor_id?.isOnline &&
                      a.status === "confirmed" && (
                        <button
                          onClick={() => handleStartVideoCall(a)}
                          className="inline-flex items-center gap-2 bg-purple-700 text-white px-4 py-2 rounded-full text-xs font-medium shadow-sm hover:bg-purple-800 transition"
                        >
                          <HiVideoCamera className="w-4 h-4" />
                          Join Video Call
                        </button>
                      )}

                    <button
                      onClick={() => handleSendReminder(a)}
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-medium shadow-sm hover:bg-blue-700 transition"
                    >
                      <HiBell className="w-4 h-4" />
                      Send Reminder
                    </button>
                  </div>
                </div>
              </div>

              {rescheduleId === a._id && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitReschedule(a._id);
                  }}
                  className="mt-4 flex flex-wrap items-center gap-2"
                >
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="border border-gray-300 px-3 py-2 rounded text-sm"
                    required
                  />
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="border border-gray-300 px-3 py-2 rounded text-sm"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded text-xs hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setRescheduleId(null)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-xs hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}

      {reminderMsg && (
        <div className="mt-4 text-sm text-green-700 font-medium">
          {reminderMsg}
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
