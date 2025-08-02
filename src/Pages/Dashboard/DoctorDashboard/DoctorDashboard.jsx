
import {
  FaCalendarAlt,
  FaUserInjured,
  FaMoneyBillWave,
  FaStethoscope,
  FaNotesMedical,
} from 'react-icons/fa';

const DoctorDashboard = () => {
  return (
    <div className="p-6 bg-gradient-to-br from-purple-50 to-white min-h-screen">
      <h1 className="text-4xl font-bold text-purple-800 mb-8 tracking-tight">
        Welcome Back, Doctor!
      </h1>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <MetricCard
          icon={<FaUserInjured />}
          label="Total Patients"
          value="238"
        />
        <MetricCard
          icon={<FaMoneyBillWave />}
          label="Total Earnings"
          value="$12,450"
        />
        <MetricCard
          icon={<FaStethoscope />}
          label="Appointments Today"
          value="7"
        />
        <MetricCard
          icon={<FaNotesMedical />}
          label="Prescriptions Given"
          value="89"
        />
      </div>

      {/* Main Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="bg-white rounded-2xl shadow-xl p-6 col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <FaCalendarAlt className="text-purple-600 text-2xl" />
            <h2 className="text-2xl font-semibold text-purple-700">Calendar</h2>
          </div>
          <div className="w-full h-64 bg-purple-100/60 rounded-lg flex items-center justify-center text-gray-500 border border-purple-200">
            Calendar Component Placeholder
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-semibold text-purple-700 mb-4">
            Upcoming Appointments
          </h2>
          <ul className="space-y-4 divide-y divide-gray-200">
            {[
              { time: '10:00 AM', name: 'John Doe', type: 'Consultation' },
              { time: '11:30 AM', name: 'Sarah Lee', type: 'Follow-up' },
              { time: '2:00 PM', name: 'Michael Scott', type: 'Routine Check' },
            ].map((item, index) => (
              <li key={index} className="pt-2">
                <div className="text-sm font-medium text-gray-800">
                  {item.time} - {item.name}
                </div>
                <div className="text-xs text-gray-500">{item.type}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-semibold text-purple-700 mb-4">
            Recent Patients
          </h2>
          <ul className="space-y-4 text-sm text-gray-700">
            {[
              { name: 'Jane Doe', date: 'Yesterday' },
              { name: 'Alex Smith', date: '2 days ago' },
              { name: 'Emily Clark', date: '3 days ago' },
            ].map((patient, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center border-b pb-2"
              >
                <span className="font-medium">{patient.name}</span>
                <span className="text-gray-500 text-sm">{patient.date}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-semibold text-purple-700 mb-4">
            Earnings Overview
          </h2>
          <div className="w-full h-52 bg-purple-100/60 rounded-lg flex items-center justify-center text-gray-500 border border-purple-200">
            Chart Placeholder
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ icon, label, value }) => (
  <div className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4 hover:shadow-lg transition-shadow">
    <div className="text-purple-700 text-3xl bg-purple-100 p-3 rounded-full">
      {icon}
    </div>
    <div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
    </div>
  </div>
);

export default DoctorDashboard;
