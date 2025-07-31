import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import {
  FaUserInjured,
  FaUserMd,
  FaCalendarAlt,
  FaClock,
  FaRegFileAlt,
  FaCreditCard,
} from "react-icons/fa";

const UserBookAppointment = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    patient_id: "",
    doctor_id: "",
    registered_doctor_id: "",
    date: new Date(),
    time: new Date(),
    reason: "",
  });

  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");
  const backendUrl = "http://localhost:5000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientRes = await fetch(
          `${backendUrl}/api/v1/patients?user_id=${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const patientData = await patientRes.json();
        setPatients(patientData.data || []);
        const doctorRes = await fetch(
          `${backendUrl}/api/v1/registered-doctors`
        );
        const doctorData = await doctorRes.json();
        setDoctors(doctorData.data || []);
      } catch (err) {
        toast.error(err.message);
      }
    };
    if (userId && token) fetchData();
  }, [userId, token, backendUrl]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setForm({ ...form, date });
  };

  const handleTimeChange = (newTime) => {
    setForm({ ...form, time: newTime });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const timeFormatted = form.time
      ? `${form.time.getHours().toString().padStart(2, "0")}:${form.time
          .getMinutes()
          .toString()
          .padStart(2, "0")}`
      : "10:00";

    const body = {
      ...form,
      time: timeFormatted,
      date: form.date.toISOString().split("T")[0],
      user_id: userId,
    };

    if (body.registered_doctor_id) delete body.doctor_id;
    else if (body.doctor_id) delete body.registered_doctor_id;

    Object.keys(body).forEach((key) => {
      if (body[key] === "") delete body[key];
    });

    try {
      // First create the appointment
      const res = await fetch(`${backendUrl}/api/v1/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        const appointmentId = data.data._id;

        // Now initiate payment
        const paymentRes = await fetch(
          `${backendUrl}/api/v1/payment/initiate/${appointmentId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const paymentData = await paymentRes.json();

        if (paymentData.success) {
          // Redirect to SSLCommerz payment gateway
          window.location.href = paymentData.data.GatewayPageURL;
        } else {
          toast.error(paymentData.message || "Failed to initiate payment.");
          setLoading(false);
        }
      } else {
        toast.error(data.message || "Failed to book appointment.");
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-purple-100 rounded-2xl shadow-xl p-10"
      >
        <h2 className="text-4xl font-bold text-purple-700 text-center mb-10">
          Book Appointment
        </h2>

        <div className="mb-6">
          <label className="text-gray-800 font-medium mb-2 flex items-center gap-2">
            <FaUserInjured className="text-purple-700" /> Select Patient
          </label>
          <select
            name="patient_id"
            value={form.patient_id}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-700 bg-white"
          >
            <option value="">-- Choose a patient --</option>
            {patients.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="text-gray-800 font-medium mb-2 flex items-center gap-2">
            <FaUserMd className="text-purple-700" /> Select Doctor
          </label>
          <select
            name="registered_doctor_id"
            value={form.registered_doctor_id}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-700 bg-white"
          >
            <option value="">-- Choose a doctor --</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>
                Dr. {d.name} ({d.specialty})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="text-gray-800 font-medium mb-2 flex items-center gap-2">
              <FaCalendarAlt className="text-purple-700" /> Date
            </label>
            <DatePicker
              selected={form.date}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-700 bg-white"
              minDate={new Date()}
              required
            />
          </div>

          <div className="flex-1">
            <label className="text-gray-800 font-medium mb-2 flex items-center gap-2">
              <FaClock className="text-purple-700" /> Time
            </label>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                value={form.time}
                onChange={handleTimeChange}
                textField={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    required
                    sx={{
                      backgroundColor: "#fff",
                      borderRadius: 1,
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </div>
        </div>

        <div className="mb-6">
          <label className="text-gray-800 font-medium mb-2 flex items-center gap-2">
            <FaRegFileAlt className="text-purple-700" /> Reason
          </label>
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            rows={3}
            placeholder="Describe the reason for your appointment"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-700 bg-white"
          />
        </div>

        <div className="bg-purple-50 p-4 rounded-lg mb-6">
          <div className="flex items-center gap-3">
            <FaCreditCard className="text-purple-700 text-xl" />
            <div>
              <h3 className="font-semibold text-purple-800">Appointment Fee</h3>
              <p className="text-purple-600">
                BDT 500 (Test Payment - No Real Money)
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-700 hover:bg-purple-800 transition text-white font-semibold text-lg py-3 rounded-lg shadow-md disabled:opacity-70"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Pay & Book Appointment"
          )}
        </button>
      </form>
    </div>
  );
};

export default UserBookAppointment;
