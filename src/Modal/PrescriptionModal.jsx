import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
  FaUser,
  FaCalendarAlt,
  FaStethoscope,
  FaFileDownload,
  FaNotesMedical,
} from 'react-icons/fa';

export default function PrescriptionModal({ selected, setSelected }) {
  if (!selected) return null;

  return (
    <Transition appear show={!!selected} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setSelected(null)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-2xl transition-all max-h-[90vh] overflow-y-auto border border-purple-200 text-sm">
                <Dialog.Title
                  as="h3"
                  className="text-3xl font-extrabold text-purple-700 text-center mb-6"
                >
                  Prescription Details
                </Dialog.Title>

                {/* Dates Section */}
                <section className="bg-purple-50 border border-purple-200 rounded-xl shadow p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaCalendarAlt className="text-purple-700" />
                    <h4 className="text-lg font-semibold text-purple-800">
                      Dates
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                    <p>
                      <span className="font-medium">Prescribed On:</span>{' '}
                      {new Date(selected.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    <p>
                      <span className="font-medium">Follow-Up:</span>{' '}
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
                        <span className="italic text-gray-500">None</span>
                      )}
                    </p>
                  </div>
                </section>

                {/* Patient & Doctor */}
                <section className="bg-purple-50 border border-purple-200 rounded-xl shadow p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaUser className="text-purple-700" />
                    <h4 className="text-lg font-semibold text-purple-800">
                      Patient & Doctor
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                    <p>
                      <span className="font-medium">Patient:</span>{' '}
                      {selected.patient_id?.name || 'Unknown'}
                    </p>
                    <p>
                      <span className="font-medium">Doctor:</span>{' '}
                      {selected.doctor_id?.name ||
                        selected.registered_doctor_id?.name ||
                        'Unknown'}
                    </p>
                  </div>
                </section>

                {/* Medicines */}
                <section className="bg-purple-50 border border-purple-200 rounded-xl shadow p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaNotesMedical className="text-purple-700" />
                    <h4 className="text-lg font-semibold text-purple-800">
                      Medicines
                    </h4>
                  </div>
                  {selected.medicines?.length > 0 ? (
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
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
                    <p className="italic text-gray-500">No medicines listed.</p>
                  )}
                </section>

                {/* Advice */}
                <section className="bg-purple-50 border border-purple-200 rounded-xl shadow p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaStethoscope className="text-purple-700" />
                    <h4 className="text-lg font-semibold text-purple-800">
                      Advice
                    </h4>
                  </div>
                  <p className="text-gray-700">
                    {selected.advice || (
                      <span className="italic text-gray-500">
                        None provided.
                      </span>
                    )}
                  </p>
                </section>

                {/* Footer */}
                <div className="flex justify-between items-center mt-6">
                  <button
                    onClick={() => setSelected(null)}
                    className="px-5 py-2 border border-purple-300 text-purple-700 font-semibold rounded-md hover:bg-purple-50 transition"
                  >
                    Close
                  </button>
                  <a
                    href={`https://doctors-bd-backend.vercel.app/api/v1/prescriptions/${selected._id}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-md transition"
                  >
                    <FaFileDownload />
                    Download PDF
                  </a>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
