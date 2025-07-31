// src/Pages/Payment/Success.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const [searchParams] = useSearchParams();
  const tran_id = searchParams.get("tran_id");
  const status = searchParams.get("status");
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      if (!tran_id) {
        setError("Transaction ID is missing");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching transaction details for:", tran_id);

        // Fetch transaction details with populated appointment
        const transactionRes = await axios.get(
          `/api/v1/payment/transaction/${tran_id}`
        );
        const transactionData = transactionRes.data.data;

        console.log("Transaction data:", transactionData);
        setTransaction(transactionData);
      } catch (err) {
        console.error("Error fetching transaction:", err);
        console.error("Error response:", err.response);
        setError(
          `Failed to load transaction details: ${
            err.response?.data?.message || err.message
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetails();
  }, [tran_id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error || status !== "success") {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="text-red-500 text-6xl mb-4">✗</div>
        <h1 className="text-3xl font-bold text-red-600 mb-2">
          Payment {status || "Failed"}
        </h1>
        <p className="text-gray-600 mb-6">
          {error || "There was an issue processing your payment."}
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const appointment = transaction?.appointment_id;

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="text-center">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h1 className="text-3xl font-bold text-green-600 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Your appointment has been confirmed.
        </p>
        <p className="text-gray-600 mb-6">Transaction ID: {tran_id}</p>
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
              <span>
                Dr.{" "}
                {appointment.doctor_id?.name ||
                  appointment.registered_doctor_id?.name}
              </span>
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
          onClick={() => navigate("/dashboard")}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Success;
