// src/Pages/Payment/FailPayment.jsx

import React from "react";
import { Link, useSearchParams } from "react-router-dom";

const FailPayment = () => {
  const [searchParams] = useSearchParams();
  const tran_id = searchParams.get("tran_id");

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md text-center">
      <div className="text-red-500 text-6xl mb-4">✗</div>
      <h1 className="text-3xl font-bold text-red-600 mb-2">Payment Failed</h1>
      <p className="text-gray-600 mb-6">
        Unfortunately, your payment could not be processed. Your appointment has
        not been booked. Please try again.
      </p>
      {tran_id && (
        <p className="text-sm text-gray-500">Transaction ID: {tran_id}</p>
      )}
      <div className="mt-8">
        <Link
          to="/book-appointment" // Link back to the booking page
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
};

export default FailPayment;
