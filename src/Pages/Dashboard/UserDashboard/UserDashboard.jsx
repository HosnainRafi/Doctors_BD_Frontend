import React from 'react';
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
    <div className="p-6 bg-gradient-to-br from-purple-50 to-white min-h-screen">
      <h1 className="text-4xl font-bold text-purple-800 mb-8 tracking-tight">
        Welcome Back, Imran!
      </h1>

      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
        <div className="col-span-1 bg-white shadow-xl rounded-2xl p-6 flex items-center gap-4">
          <FaUserCircle size={60} className="text-purple-600" />
          <div>
            <p className="text-xl font-semibold text-gray-800">
              Asadul Islam Imran
            </p>
            <p className="text-sm text-gray-500">asadulimran1999@gmail.com</p>
            <p className="text-xs text-gray-400">Patient ID: #P12345</p>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Metric
            icon={<FaCalendarAlt />}
            label="Total Appointments"
            value="12"
            color="blue"
          />
          <Metric
            icon={<FaClock />}
            label="Upcoming"
            value="3"
            color="yellow"
          />
          <Metric
            icon={<FaMoneyBillWave />}
            label="Total Cost"
            value="$540"
            color="green"
          />
        </div>
      </div>

      {/* Calendar and Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-xl col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <FaCalendarAlt className="text-purple-600 text-2xl" />
            <h2 className="text-2xl font-semibold text-purple-700">Calendar</h2>
          </div>
          <div className="h-64 border border-purple-200 bg-purple-50 rounded-lg flex items-center justify-center text-purple-400">
            Calendar Component Placeholder
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-semibold text-purple-700 mb-4">
            Upcoming Appointments
          </h2>
          <ul className="space-y-4 text-sm text-gray-700">
            <li className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Dr. Hossain</p>
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
                <p className="font-semibold">Dr. Ahmed</p>
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
                <p className="font-semibold">Dr. Laila</p>
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
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-semibold text-purple-700 mb-4 flex items-center gap-2">
            <BsClipboard2CheckFill className="text-purple-500" />
            Health Summary
          </h2>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>✅ Blood pressure normal</li>
            <li>✅ Last checkup on June 10, 2025</li>
            <li>⚠️ Follow-up for cholesterol on Aug 15</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-semibold text-purple-700 mb-4 flex items-center gap-2">
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
  );
}

function Metric({ icon, label, value, color }) {
  const colorMap = {
    blue: 'text-blue-500 bg-blue-100',
    yellow: 'text-yellow-500 bg-yellow-100',
    green: 'text-green-500 bg-green-100',
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4 hover:shadow-lg transition-shadow">
      <div className={`text-2xl ${colorMap[color]} p-3 rounded-full`}>
        {icon}
      </div>
      <div>
        <div className="text-sm text-gray-500">{label}</div>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
      </div>
    </div>
  );
}
