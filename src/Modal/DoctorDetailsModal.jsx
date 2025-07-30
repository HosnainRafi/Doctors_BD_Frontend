import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
  FaUserMd,
  FaGraduationCap,
  FaStethoscope,
  FaEnvelope,
  FaPhoneAlt,
  FaIdCard,
} from 'react-icons/fa';

export default function DoctorDetailsModal({ doctorDetails, isOpen, onClose }) {
  if (!doctorDetails) return null;

  const {
    name,
    email,
    phone,
    photo,
    bmdc_number,
    degree_names,
    specialties,
    bio,
    consultation,
    experiences = [],
    availableSlots = [],
  } = doctorDetails;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform rounded-2xl bg-white p-6 shadow-2xl transition-all max-h-[90vh] overflow-y-auto border border-purple-200">
                <Dialog.Title
                  as="h3"
                  className="text-3xl font-extrabold text-purple-700 text-center mb-6"
                >
                  Doctor Profile
                </Dialog.Title>

                {/* Personal Details */}
                <section className="bg-purple-50 border border-purple-200 rounded-xl shadow p-5 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FaUserMd className="text-purple-700 w-5 h-5" />
                    <h4 className="text-lg font-semibold text-purple-800 border-b border-purple-300 pb-1">
                      Personal Details
                    </h4>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-6">
                    <img
                      src={photo || 'https://via.placeholder.com/120'}
                      alt={name}
                      className="w-28 h-28 object-cover rounded-full border-4 border-purple-300"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
                      <p>
                        <span className="font-medium">Name:</span> {name}
                      </p>
                      <p className="flex items-center gap-2">
                        <FaEnvelope /> {email}
                      </p>
                      <p className="flex items-center gap-2">
                        <FaPhoneAlt /> {phone}
                      </p>
                      <p className="flex items-center gap-2">
                        <FaIdCard />{' '}
                        <span className="text-purple-700 font-medium">
                          BMDC:
                        </span>{' '}
                        {bmdc_number || 'N/A'}
                      </p>
                      {degree_names?.length > 0 && (
                        <p>
                          <span className="font-medium">Degrees:</span>{' '}
                          {degree_names.join(', ')}
                        </p>
                      )}
                      {specialties?.length > 0 && (
                        <p>
                          <span className="font-medium">Specialties:</span>{' '}
                          {specialties.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                  {bio && (
                    <div className="mt-4 text-sm text-gray-700">
                      <span className="font-medium">Bio:</span>
                      <p className="mt-1">{bio}</p>
                    </div>
                  )}
                </section>

                {/* Education & Experience */}
                <section className="bg-purple-50 border border-purple-200 rounded-xl shadow p-5 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FaGraduationCap className="text-purple-700 w-5 h-5" />
                    <h4 className="text-lg font-semibold text-purple-800 border-b border-purple-300 pb-1">
                      Education & Experience
                    </h4>
                  </div>
                  {experiences.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-gray-800">
                      {experiences.map((exp, i) => (
                        <li key={i}>
                          <span className="text-purple-700 font-medium">
                            {exp.designation}
                          </span>{' '}
                          at {exp.organization_name} ({exp.from} -{' '}
                          {exp.is_current ? 'Present' : exp.to})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No experience listed.
                    </p>
                  )}
                </section>

                {/* Consultation Info */}
                <section className="bg-purple-50 border border-purple-200 rounded-xl shadow p-5 mb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <FaStethoscope className="text-purple-700 w-5 h-5" />
                    <h4 className="text-lg font-semibold text-purple-800 border-b border-purple-300 pb-1">
                      Consultation & Availability
                    </h4>
                  </div>

                  {consultation && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800 mb-4">
                      <p>
                        <span className="font-medium">Fee:</span>{' '}
                        <span className="text-purple-700">
                          {consultation.standard_fee} BDT
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">With VAT:</span>{' '}
                        <span className="text-purple-700">
                          {consultation.standard_fee_with_vat} BDT
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">Avg. Time:</span>{' '}
                        {consultation.average_consultation_minutes} mins
                      </p>
                    </div>
                  )}

                  {availableSlots.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-gray-800">
                      {availableSlots.map((slot, i) => (
                        <li key={slot._id || i}>
                          {slot.date} at {slot.time}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No available slots.</p>
                  )}
                </section>

                {/* Close Button */}
                <div className="mt-6 text-center">
                  <button
                    onClick={onClose}
                    className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-md transition"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
