import  { useEffect, useState } from 'react';
import { FaDownload, FaRegEye, FaTimes, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

const DoctorPrescriptionList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [loading, setLoading] = useState(true);

  const doctorToken = localStorage.getItem('doctorToken');
  let doctorEmail = null;
  try {
    doctorEmail = doctorToken
      ? JSON.parse(atob(doctorToken.split('.')[1])).email
      : null;
  } catch (err) {
    doctorEmail = null;
    console.log(err);
  }

  useEffect(() => {
    const fetchDoctorId = async () => {
      if (!doctorEmail) {
        toast.error('Doctor email not found in token.');
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(
          `https://doctors-bd-backend.vercel.app/api/v1/registered-doctors/by-email?email=${doctorEmail}`,
          { headers: { Authorization: `Bearer ${doctorToken}` } }
        );
        const data = await response.json();
        if (data?.data?._id) {
          setDoctorId(data.data._id);
        } else {
          toast.error('Doctor not found.');
        }
      } catch {
        toast.error('Failed to fetch doctor info.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorId();
  }, [doctorEmail, doctorToken]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!doctorId) return;
      setLoading(true);
      try {
        const response = await fetch(
          `https://doctors-bd-backend.vercel.app/api/v1/prescriptions/registered-doctor/${doctorId}`,
          { headers: { Authorization: `Bearer ${doctorToken}` } }
        );
        const data = await response.json();
        setPrescriptions(data.data || []);
      } catch {
        toast.error('Failed to fetch prescriptions.');
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, [doctorId, doctorToken]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-8">
        📝 Your Prescriptions
      </h2>

      {loading && (
        <div className="flex justify-center items-center py-6 bg-white rounded-xl shadow-md">
          <FaSpinner className="animate-spin text-indigo-500 text-3xl mr-3" />
          <span className="text-gray-600 text-lg">
            Loading prescriptions...
          </span>
        </div>
      )}

      {!loading && prescriptions.length === 0 && (
        <div className="text-gray-500 py-6 text-center bg-white rounded-xl shadow-md">
          No prescriptions found.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2   gap-6">
        {prescriptions.map(p => (
          <div
            key={p._id}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg text-gray-800">
                  {p.patient_id?.name}
                </h3>
                <span className="text-sm text-gray-500">
                  {p.patient_id?.phone}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Date:</span> {p.date}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Appointment:</span>{' '}
                {p.appointment_id?.date} {p.appointment_id?.time}
              </p>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setSelected(p)}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 text-sm font-medium transition-all"
              >
                <FaRegEye />
                View Details
              </button>
              <a
                href={`https://doctors-bd-backend.vercel.app/api/v1/prescriptions/${p._id}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 text-sm font-medium transition-all"
              >
                <FaDownload />
                Download
              </a>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-8">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-lg relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-gray-600 text-xl hover:text-gray-800"
            >
              <FaTimes />
            </button>
            <h4 className="text-2xl font-bold text-gray-800 mb-6">
              Prescription Details
            </h4>
            <div className="space-y-4 text-gray-700">
              <div>
                <strong>Patient:</strong> {selected.patient_id?.name}
              </div>
              <div>
                <strong>Date:</strong> {selected.date}
              </div>
              <div>
                <strong>Medicines:</strong>
                <ul className="list-disc list-inside mt-2 text-sm">
                  {selected.medicines.map((med, i) => (
                    <li key={i}>
                      <span className="font-medium">{med.name}</span> (
                      {med.dose}){' '}
                      {med.instructions && (
                        <span className="text-gray-500">
                          - {med.instructions}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Advice:</strong>{' '}
                {selected.advice || <span className="text-gray-400">None</span>}
              </div>
              <div>
                <strong>Follow-up Date:</strong>{' '}
                {selected.follow_up_date || (
                  <span className="text-gray-400">None</span>
                )}
              </div>
            </div>
            <div className="mt-6">
              <a
                href={`https://doctors-bd-backend.vercel.app/api/v1/prescriptions/${selected._id}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-600 transition"
              >
                <FaDownload />
                Download PDF
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPrescriptionList;
