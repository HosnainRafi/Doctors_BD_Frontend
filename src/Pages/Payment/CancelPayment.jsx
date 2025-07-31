import { FaRegTimesCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function CancelPayment() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 px-4 py-12">
      <div className="bg-white shadow-xl rounded-3xl p-8 md:p-10 max-w-lg w-full text-center border border-yellow-200">
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-100 p-4 rounded-full">
            <FaRegTimesCircle className="text-yellow-600 text-5xl" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Payment Canceled
        </h2>
        <p className="text-gray-600 text-base md:text-lg mb-6">
          You have canceled the payment process. No charges were made. You can
          retry anytime.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/retry-payment"
            className="px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-full transition duration-300 shadow-md"
          >
            Retry Payment
          </Link>
          <Link
            to="/dashboard/user"
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-full transition duration-300"
          >
            Go Home
          </Link>
        </div>

        <p className="text-sm text-gray-400 mt-6">
          Questions?{' '}
          <a
            href="mailto:support@example.com"
            className="text-purple-700 underline"
          >
            support@example.com
          </a>
        </p>
      </div>
    </div>
  );
}
