
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { FiX, FiUser, FiCalendar, FiClipboard } from 'react-icons/fi';

const AppointmentDetailsModal = ({ isOpen, onClose, appointment }) => {
  if (!appointment) return null;

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

        <div className="fixed inset-0 overflow-y-auto px-8">
          <div className="flex min-h-full items-center justify-center py-8">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all relative">
                <div className='flex justify-between gap-4 mb-4'>
                  <Dialog.Title className="text-2xl font-bold text-purple-700 text-center mb-1">
                    Appointment Summary
                  </Dialog.Title>
                  <button
                    className=" text-gray-500 hover:text-red-600 text-2xl"
                    onClick={onClose}
                  >
                    <FiX />
                  </button>
                </div>

                <p className="text-sm text-gray-500 text-center mb-4">
                  Detailed information about the selected appointment
                </p>

                <div className="space-y-4 text-sm md:text-base text-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 font-semibold text-gray-600">
                      <FiUser /> Patient Name:
                    </span>
                    <span>{appointment.patient_id?.name || '-'}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 font-semibold text-gray-600">
                      <FiCalendar /> Appointment Date:
                    </span>
                    <span>
                      {appointment.date || '-'} at {appointment.time || '-'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 font-semibold text-gray-600">
                      <FiClipboard /> Status:
                    </span>
                    <span className="text-purple-700 font-medium capitalize">
                      {appointment.status}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="flex items-center gap-2 font-semibold text-gray-600 mb-1">
                      <FiClipboard /> Notes:
                    </span>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-700">
                      {appointment.note ? (
                        appointment.note
                      ) : (
                        <span className="italic text-gray-400">
                          No notes provided.
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={onClose}
                    className="bg-purple-700 text-white px-5 py-2 rounded-lg hover:bg-purple-800 transition text-sm"
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
};

export default AppointmentDetailsModal;
