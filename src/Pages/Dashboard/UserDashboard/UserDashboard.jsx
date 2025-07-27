import {
  FaCalendarAlt,
  FaUserMd,
  FaMoneyBillWave,
  FaClock,
  FaUserCircle,
} from 'react-icons/fa';
import { ImStatsBars } from 'react-icons/im';
import { BsClipboard2CheckFill } from 'react-icons/bs';

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard (Static and will work latter)</h1>
          <div className="text-sm text-gray-600">Welcome back, Imran!</div>
        </div>

        {/* Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4 col-span-1 lg:col-span-1">
            <FaUserCircle size={60} className="text-purple-600" />
            <div>
              <p className="text-lg font-semibold text-gray-800">
                Asadul Islam Imran
              </p>
              <p className="text-sm text-gray-500">asadulimran1999@gmail.com</p>
              <p className="text-xs text-gray-400">Patient ID: #P12345</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 col-span-1 lg:col-span-3">
            <div className="bg-white shadow rounded-lg p-4 flex items-center gap-4">
              <FaCalendarAlt className="text-blue-500" size={24} />
              <div>
                <p className="text-xl font-bold">12</p>
                <p className="text-sm text-gray-600">Total Appointments</p>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-4 flex items-center gap-4">
              <FaClock className="text-yellow-500" size={24} />
              <div>
                <p className="text-xl font-bold">3</p>
                <p className="text-sm text-gray-600">Upcoming Appointments</p>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-4 flex items-center gap-4">
              <FaMoneyBillWave className="text-green-500" size={24} />
              <div>
                <p className="text-xl font-bold">$540</p>
                <p className="text-sm text-gray-600">Total Cost</p>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Calendar + Upcoming */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Calendar */}
          <div className="bg-white p-6 rounded-xl shadow col-span-1 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Calendar</h2>
              <span className="text-sm text-gray-400">July 2025</span>
            </div>
            <div className="h-64 border rounded-lg flex items-center justify-center text-gray-400">
              [Calendar Placeholder]
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Upcoming Appointments
            </h2>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Dr. Hossain</p>
                  <p className="text-xs text-gray-500">
                    Dermatologist · 27 July, 11:00 AM
                  </p>
                </div>
                <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded">
                  Pending
                </span>
              </li>
              <li className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Dr. Ahmed</p>
                  <p className="text-xs text-gray-500">
                    Cardiologist · 28 July, 3:00 PM
                  </p>
                </div>
                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                  Confirmed
                </span>
              </li>
              <li className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Dr. Laila</p>
                  <p className="text-xs text-gray-500">
                    Neurologist · 30 July, 2:00 PM
                  </p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                  Scheduled
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BsClipboard2CheckFill className="text-purple-500" />
              Health Summary
            </h2>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>✅ Blood pressure normal</li>
              <li>✅ Last checkup on June 10, 2025</li>
              <li>⚠️ Follow-up for cholesterol on Aug 15</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ImStatsBars className="text-green-500" />
              Activity Overview
            </h2>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>👣 Steps this week: 24,000</li>
              <li>💧 Water intake: 1.5L/day</li>
              <li>🛌 Sleep avg: 6.8 hrs/night</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
