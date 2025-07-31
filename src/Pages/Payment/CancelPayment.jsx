// src/Pages/Payment/CancelPayment.jsx

import React from "react";
import { Link, useSearchParams } from "react-router-dom";

const CancelPayment = () => {
  const [searchParams] = useSearchParams();
  const tran_id = searchParams.get("tran_id");

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md text-center">
      <div className="text-yellow-500 text-6xl mb-4">!</div>
      <h1 className="text-3xl font-bold text-yellow-600 mb-2">
        Payment Cancelled
      </h1>
      <p className="text-gray-600 mb-6">
        You have cancelled the payment process. Your appointment has not been
        booked.
      </p>
      {tran_id && (
        <p className="text-sm text-gray-500">Transaction ID: {tran_id}</p>
      )}
      <div className="mt-8">
        <Link
          to="/book-appointment"
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
        >
          Book Another Appointment
        </Link>
      </div>
    </div>
  );
};

export default CancelPayment;
