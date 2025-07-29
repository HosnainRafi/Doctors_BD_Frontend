import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ImSpinner10 } from 'react-icons/im';

const UserPrescriptionList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('userToken');
  const email = token ? JSON.parse(atob(token.split('.')[1])).email : null;

  useEffect(() => {
    const fetchUserId = async () => {
      if (!email) return;
      setLoading(true);
      const res = await fetch(
        `https://doctors-bd-backend.vercel.app/api/v1/users?email=${encodeURIComponent(
          email
        )}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (data?.data?._id) {
        setUserId(data.data._id);
      } else {
        toast.error('User not found for this email.');
      }
      setLoading(false);
    };
    fetchUserId();
  }, [email, token]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!userId) return;
      setLoading(true);
      const res = await fetch(
        `https://doctors-bd-backend.vercel.app/api/v1/prescriptions?user_id=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setPrescriptions(data.data || []);
      setLoading(false);
    };
    fetchPrescriptions();
  }, [userId, token]);

  return (
    <div className="mb-16 px-4 max-w-6xl mx-auto">
      <h3 className="text-3xl font-bold text-purple-700 mb-8 text-center">
        Your Prescriptions
      </h3>

      {loading && prescriptions.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <ImSpinner10 size={40} className="animate-spin text-purple-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prescriptions.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 bg-white p-8 rounded-xl shadow border">
              <p className="text-lg font-medium">No prescriptions found.</p>
            </div>
          ) : (
            prescriptions.map(p => (
              <div
                key={p._id}
                className="border border-purple-700 p-4 rounded-xl shadow-md bg-white space-y-3"
              >
                <h2 className="text-xl font-bold text-center text-purple-800 mb-3">
                  Prescription Details
                </h2>
                <hr className="border-t border-purple-400" />

                <div className="text-sm text-gray-700 border border-purple-300 rounded-md p-3 space-y-2 shadow-sm">
                  <div>
                    <span className="font-semibold">Date:</span>{' '}
                    {new Date(p.date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                  <div>
                    <span className="font-semibold">Time:</span>{' '}
                    {new Date(
                      `1970-01-01T${p.appointment_id?.time}`
                    ).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </div>
                  {p.follow_up_date && (
                    <div>
                      <span className="font-semibold">Follow-up Date:</span>{' '}
                      {new Date(p.follow_up_date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                  )}
                </div>

                <div className="text-sm text-gray-700 border border-purple-300 rounded-md p-3 shadow-sm">
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    Patient
                  </h3>
                  <div>{p.patient_id?.name || 'Unknown Patient'}</div>
                </div>

                <div className="text-sm text-gray-700 border border-purple-300 rounded-md p-3 shadow-sm">
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    Doctor
                  </h3>
                  <div>{p.registered_doctor_id?.name || 'Unknown Doctor'}</div>
                </div>

                <hr className="border-t border-purple-400 mt-6" />

                <div className="flex justify-center gap-3 mt-4">
                  <button
                    onClick={() => setSelected(p)}
                    className="px-5 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
                  >
                    View Details
                  </button>
                  <a
                    href={`https://doctors-bd-backend.vercel.app/api/v1/prescriptions/${p._id}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 bg-purple-700 text-white text-sm rounded-md hover:bg-purple-800 transition"
                  >
                    Download PDF
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl relative max-h-[90vh] overflow-y-auto text-sm">
            {/* Sticky Header */}
            <div className="sticky top-0 bg-white z-20 border-b border-purple-300 px-6 py-3">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-bold text-purple-700">
                  Prescription Details
                </h4>
                <button
                  onClick={() => setSelected(null)}
                  aria-label="Close modal"
                  className="text-gray-400 hover:text-gray-700 transition text-2xl font-bold"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-3 text-gray-800">
              {/* Date & Follow-up */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <section className="border border-purple-200 rounded-md p-3 shadow-sm">
                  <h5 className="text-sm font-semibold text-purple-800 mb-1">
                    Date
                  </h5>
                  <p>
                    {new Date(selected.date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </section>
                <section className="border border-purple-200 rounded-md p-3 shadow-sm">
                  <h5 className="text-sm font-semibold text-purple-800 mb-1">
                    Follow-up Date
                  </h5>
                  <p>
                    {selected.follow_up_date ? (
                      new Date(selected.follow_up_date).toLocaleDateString(
                        'en-GB',
                        {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        }
                      )
                    ) : (
                      <span className="italic text-gray-400">None</span>
                    )}
                  </p>
                </section>
              </div>

              {/* Patient & Doctor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <section className="border border-purple-200 rounded-md p-3 shadow-sm">
                  <h5 className="text-sm font-semibold text-purple-800 mb-1">
                    Patient
                  </h5>
                  <p>{selected.patient_id?.name || 'Unknown Patient'}</p>
                </section>
                <section className="border border-purple-200 rounded-md p-3 shadow-sm">
                  <h5 className="text-sm font-semibold text-purple-800 mb-1">
                    Doctor
                  </h5>
                  <p>
                    {selected.doctor_id?.name ||
                      selected.registered_doctor_id?.name ||
                      'Unknown Doctor'}
                  </p>
                </section>
              </div>

              {/* Medicines */}
              <section className="border border-purple-200 rounded-md p-3 shadow-sm">
                <h5 className="text-sm font-semibold text-purple-800 mb-2">
                  Medicines
                </h5>
                {selected.medicines?.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1">
                    {selected.medicines.map((med, i) => (
                      <li key={i}>
                        <strong>{med.name}</strong>
                        {med.dose && <> ({med.dose})</>}
                        {med.timing && (
                          <>
                            {' '}
                            — <em>{med.timing}</em>
                          </>
                        )}
                        {med.instructions && <> — {med.instructions}</>}
                        {med.duration && (
                          <div className="text-xs text-gray-500">
                            Duration: {med.duration}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="italic text-gray-400">
                    No medicines prescribed.
                  </p>
                )}
              </section>

              {/* Advice */}
              <section className="border border-purple-200 rounded-md p-3 shadow-sm">
                <h5 className="text-sm font-semibold text-purple-800 mb-1">
                  Advice
                </h5>
                <p>
                  {selected.advice || (
                    <span className="italic text-gray-400">None</span>
                  )}
                </p>
              </section>
            </div>

            {/* Download Button */}
            <div className="px-6 pb-4 pt-2 text-center">
              <a
                href={`https://doctors-bd-backend.vercel.app/api/v1/prescriptions/${selected._id}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 bg-purple-700 text-white rounded-full font-medium text-sm hover:bg-purple-800 transition"
              >
                Download PDF
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPrescriptionList;
