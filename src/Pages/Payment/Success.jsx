// Success.jsx

import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Success = () => {
  const [searchParams] = useSearchParams();
  const tran_id = searchParams.get("tran_id");
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tran_id) {
      toast.success("Payment successful! Fetching appointment details...");
      const fetchAppointmentDetails = async () => {
        try {
          // OPTIMIZED: Use the new endpoint to get appointment details directly
          const response = await axios.get(
            `/api/v1/payment/appointment-by-tran_id/${tran_id}`
          );
          if (response.data.success) {
            setAppointment(response.data.data);
          } else {
            throw new Error(response.data.message);
          }
        } catch (err) {
          console.error("Error fetching appointment details:", err);
          setError(
            err.response?.data?.message ||
              "Could not fetch appointment details."
          );
          toast.error("Failed to load appointment details.");
        } finally {
          setLoading(false);
        }
      };

      fetchAppointmentDetails();
    } else {
      setError("No transaction ID found. Payment status is uncertain.");
      setLoading(false);
    }
  }, [tran_id]);

  if (loading) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-semibold">Verifying Payment...</h2>
        <p>Please wait.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <div className="text-red-500 text-6xl mb-4">✗</div>
        <h1 className="text-3xl font-bold text-red-600 mb-2">
          Verification Error
        </h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <p>Transaction ID: {tran_id || "N/A"}</p>
        <Link
          to="/dashboard"
          className="mt-8 inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h1 className="text-3xl font-bold text-green-600 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Your appointment has been confirmed.
        </p>
      </div>

      {appointment && (
        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Appointment Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">Transaction ID:</span>
              <span>{tran_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Appointment ID:</span>
              <span>{appointment._id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Patient:</span>
              {/* Note the updated path for populated data */}
              <span>{appointment.patient_id?.name || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Doctor:</span>
              <span>Dr. {appointment.registered_doctor_id?.name || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date:</span>
              <span>{new Date(appointment.date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Time:</span>
              <span>{appointment.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Status:</span>
              <span className="text-green-600 font-medium capitalize">
                {appointment.status}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <Link
          to="/dashboard"
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Success;
