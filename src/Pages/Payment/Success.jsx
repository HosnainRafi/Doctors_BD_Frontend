// SuccessPayment.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const Success = () => {
  const [searchParams] = useSearchParams();
  const tran_id = searchParams.get("tran_id");
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        // Fetch transaction details
        const transactionRes = await axios.get(
          `/api/v1/payment/transaction/${tran_id}`
        );
        const transaction = transactionRes.data.data;

        // Fetch appointment details
        const appointmentRes = await axios.get(
          `/api/v1/appointments/${transaction.appointment_id}`
        );
        setAppointment(appointmentRes.data.data);
      } catch (error) {
        console.error("Error fetching appointment:", error);
      } finally {
        setLoading(false);
      }
    };

    if (tran_id) {
      fetchAppointment();
    }
  }, [tran_id]);

  if (loading) return <div>Loading...</div>;

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
              <span className="font-medium">Appointment ID:</span>
              <span>{appointment._id}</span>
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
              <span className="font-medium">Doctor:</span>
              <span>Dr. {appointment.doctor_id?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Patient:</span>
              <span>{appointment.patient_id?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Status:</span>
              <span className="text-green-600 font-medium">
                {appointment.status}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Success;
