import {
  FaUser,
  FaVideo,
  FaCheckCircle,
  FaTimesCircle,
  FaNotesMedical,
} from 'react-icons/fa';
const getStatusColor = status => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
const AppointmentTable = ({
  appointments,
  onStatusChange,
  onStartVideoCall,
  onCreatePrescription,
  isPast,
}) => (
  <div className="overflow-x-auto rounded-lg shadow ring-1 ring-black ring-opacity-5">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-purple-100">
        <tr>
          <th className="px-4 py-2 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
            Date
          </th>
          <th className="px-4 py-2 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
            Time
          </th>
          <th className="px-4 py-2 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
            Patient
          </th>
          <th className="px-4 py-2 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
            Status
          </th>
          <th className="px-4 py-2 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {appointments.length === 0 && (
          <tr>
            <td colSpan={5} className="text-center py-4 text-gray-400">
              No appointments
            </td>
          </tr>
        )}
        {appointments.map(a => (
          <tr key={a._id}>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
              {a.date}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
              {a.time}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <FaUser className="text-purple-500" />
                <span className="font-medium">{a.patient_id?.name}</span>
              </div>
              <div className="text-xs text-gray-500">{a.patient_id?.phone}</div>
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                  a.status
                )}`}
              >
                {a.status}
              </span>
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
              <div className="flex flex-wrap gap-2">
                {!isPast && a.status === 'pending' && (
                  <>
                    <button
                      onClick={() => onStatusChange(a._id, 'confirmed')}
                      className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1 rounded shadow"
                    >
                      <FaCheckCircle className="inline-block mr-1" />
                      Accept
                    </button>
                    <button
                      onClick={() => onStatusChange(a._id, 'cancelled')}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1 rounded shadow"
                    >
                      <FaTimesCircle className="inline-block mr-1" /> Cancel
                    </button>
                  </>
                )}
                {!isPast && a.status === 'confirmed' && (
                  <>
                    <button
                      onClick={() => onStatusChange(a._id, 'completed')}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1 rounded shadow flex items-center gap-1"
                    >
                      <FaCheckCircle className="inline-block mr-1" />
                      Mark Completed
                    </button>
                    <button
                      onClick={() => onStartVideoCall(a)}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-3 py-1 rounded shadow"
                    >
                      <FaVideo className="inline-block mr-1" /> Video Call
                    </button>
                  </>
                )}
                {a.status === 'completed' && onCreatePrescription && (
                  <button
                    onClick={() => onCreatePrescription(a)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1 rounded shadow"
                  >
                    <FaNotesMedical className="inline-block mr-1" />{' '}
                    Prescription
                  </button>
                )}
                <button
                  onClick={() => alert(JSON.stringify(a.patient_id, null, 2))}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold px-3 py-1 rounded shadow"
                >
                  Patient Details
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default AppointmentTable;
