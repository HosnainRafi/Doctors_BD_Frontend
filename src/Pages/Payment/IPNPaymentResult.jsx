import { FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function IPNPaymentResult() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 px-4 py-12">
      <div className="bg-white shadow-2xl rounded-3xl p-8 md:p-10 max-w-xl w-full text-center border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <FaCheckCircle className="text-green-600 text-5xl" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Payment Verified (IPN)
        </h2>

        <p className="text-gray-600 text-base md:text-lg mb-6">
          Your payment has been successfully verified via Instant Payment
          Notification. We’ve updated your account accordingly. You’ll receive a
          confirmation email shortly.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/dashboard/user"
            className="px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-full transition duration-300 shadow-md"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/"
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-full transition duration-300"
          >
            Go Home
          </Link>
        </div>

        <p className="text-sm text-gray-400 mt-6">
          Need help?{' '}
          <a
            href="mailto:support@carepoint.com"
            className="text-purple-700 underline"
          >
            support@carepoint.com
          </a>
        </p>
      </div>
    </div>
  );
}
