import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TextField from "@mui/material/TextField";
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
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [form, setForm] = useState({
    patient_id: "",
    doctor_id: "",
    registered_doctor_id: "",
    date: new Date(),
    time: new Date(),
    reason: "",
  });

  const token = localStorage.getItem("userToken");
  const backendUrl = "http://localhost:5000";

  useEffect(() => {
    // This effect correctly fetches initial data and does not need to change.
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("userToken");
      if (!userId || !storedToken) {
        toast.error("User ID or token is missing. Please log in again.");
        return;
      }
      const fetchData = async () => {
        try {
          const patientRes = await fetch(
            `${backendUrl}/api/v1/patients?user_id=${userId}`,
            { headers: { Authorization: `Bearer ${storedToken}` } }
          );
          if (!patientRes.ok) {
            const errorData = await patientRes.json();
            throw new Error(errorData.message || "Failed to fetch patients");
          }
          const patientData = await patientRes.json();
          setPatients(patientData.data || []);

          const doctorRes = await fetch(
            `${backendUrl}/api/v1/registered-doctors`,
            { headers: { Authorization: `Bearer ${storedToken}` } }
          );
          if (!doctorRes.ok) {
            const errorData = await doctorRes.json();
            throw new Error(errorData.message || "Failed to fetch doctors");
          }
          const doctorData = await doctorRes.json();
          setDoctors(doctorData.data || []);
        } catch (err) {
          console.error("Fetch error:", err);
          toast.error(err.message || "Failed to fetch necessary data");
        }
      };
      fetchData();
    }
  }, [userId]);

  const validateForm = () => {
    if (!form.patient_id) {
      toast.error("Please select a patient");
      return false;
    }
    if (!form.registered_doctor_id) {
      toast.error("Please select a doctor");
      return false;
    }
    if (!form.date) {
      toast.error("Please select a date");
      return false;
    }
    if (!form.time) {
      toast.error("Please select a time");
      return false;
    }
    return true;
  };

  const getMinTime = () => {
    const today = new Date();
    const isToday = form.date.toDateString() === today.toDateString();
    if (isToday) {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 30); // Add 30 minutes buffer
      return now;
    }
    return new Date(0, 0, 0, 9, 0); // 9:00 AM default
  };

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
    if (!validateForm()) return;

    setLoading(true);
    try {
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

      // Step 1: Create the appointment with a 'pending' status
      const appointmentRes = await fetch(`${backendUrl}/api/v1/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!appointmentRes.ok) {
        const errorData = await appointmentRes.json();
        throw new Error(errorData.message || "Failed to book appointment");
      }

      const appointmentData = await appointmentRes.json();

      if (appointmentData.success) {
        const appointmentId = appointmentData.data._id;

        // Step 2: Initiate payment for the created appointment
        setPaymentLoading(true);
        try {
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

          if (!paymentRes.ok) {
            const paymentError = await paymentRes.json();
            throw new Error(
              paymentError.message || "Failed to initiate payment"
            );
          }

          const paymentData = await paymentRes.json();

          // Step 3: Redirect user to the payment gateway
          if (paymentData.success && paymentData.data.GatewayPageURL) {
            window.location.href = paymentData.data.GatewayPageURL;
          } else {
            throw new Error(paymentData.message || "Failed to get payment URL");
          }
        } finally {
          // This will only be reached if the redirect fails
          setPaymentLoading(false);
        }
      } else {
        throw new Error(
          appointmentData.message || "Appointment creation failed"
        );
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const selectedPatient = patients.find((p) => p._id === form.patient_id);
  const selectedDoctor = doctors.find(
    (d) => d._id === form.registered_doctor_id
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* The payment status notification is REMOVED from this component */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-purple-100 rounded-2xl shadow-xl p-10"
      >
        <h2 className="text-4xl font-bold text-purple-700 text-center mb-10">
          Book an Appointment
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
                minTime={getMinTime()}
                maxTime={new Date(0, 0, 0, 20, 0)} // 8:00 PM max
                renderInput={(
                  params // renderInput is used for older MUI versions
                ) => (
                  <TextField
                    {...params}
                    fullWidth
                    required
                    sx={{
                      backgroundColor: "#fff",
                      borderRadius: 1,
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "#8b5cf6", // purple-700
                        },
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </div>
        </div>

        <div className="mb-6">
          <label className="text-gray-800 font-medium mb-2 flex items-center gap-2">
            <FaRegFileAlt className="text-purple-700" /> Reason for Visit
          </label>
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            rows={3}
            placeholder="e.g., General check-up, fever, etc."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-700 bg-white"
          />
        </div>

        {/* Appointment Summary */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            Appointment Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium text-gray-600">Patient:</span>
              <span className="ml-2 text-gray-900">
                {selectedPatient ? selectedPatient.name : "Not selected"}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Doctor:</span>
              <span className="ml-2 text-gray-900">
                {selectedDoctor ? `Dr. ${selectedDoctor.name}` : "Not selected"}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Date:</span>
              <span className="ml-2 text-gray-900">
                {form.date.toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Time:</span>
              <span className="ml-2 text-gray-900">
                {form.time.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg mb-6 border border-purple-200">
          <div className="flex items-center gap-3">
            <FaCreditCard className="text-purple-700 text-xl" />
            <div>
              <h3 className="font-semibold text-purple-800">Appointment Fee</h3>
              <p className="text-purple-600">
                BDT 500 (This is a test payment)
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || paymentLoading}
          className="w-full bg-purple-700 hover:bg-purple-800 transition-colors text-white font-semibold text-lg py-3 rounded-lg shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading && !paymentLoading && (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5"
                viewBox="0 0 24 24"
              >
                ...
              </svg>
              Creating Appointment...
            </>
          )}
          {paymentLoading && (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5"
                viewBox="0 0 24 24"
              >
                ...
              </svg>
              Redirecting to Payment...
            </>
          )}
          {!loading && !paymentLoading && "Proceed to Payment"}
        </button>
      </form>
    </div>
  );
};

export default UserBookAppointment;
