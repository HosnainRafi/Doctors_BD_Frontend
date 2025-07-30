import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import DatePicker from 'react-datepicker';
import './customPickerStyles.css';
import { ImSpinner9 } from 'react-icons/im';

const RescheduleAppointmentModal = ({
  isOpen,
  onClose,
  onSubmit,
  newDate,
  setNewDate,
  newTime,
  setNewTime,
  loading,
}) => {
  const handleTimeChange = e => {
    setNewTime(e.target.value);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0 backdrop-blur-none"
          enterTo="opacity-100 backdrop-blur-sm"
          leave="ease-in duration-150"
          leaveFrom="opacity-100 backdrop-blur-sm"
          leaveTo="opacity-0 backdrop-blur-none"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
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
              <Dialog.Panel className="w-full max-w-md transform bg-white rounded-2xl p-6 shadow-2xl transition-all relative z-50 overflow-visible">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-bold text-purple-700 mb-6 text-center"
                >
                  Reschedule Appointment
                </Dialog.Title>

                <form
                  onSubmit={e => {
                    e.preventDefault();
                    onSubmit();
                  }}
                  className="space-y-5"
                >
                  {/* Date Picker */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="reschedule-date"
                      className="text-sm font-medium text-gray-700 mb-1"
                    >
                      Select New Date
                    </label>
                    <DatePicker
                      id="reschedule-date"
                      selected={newDate}
                      onChange={date => setNewDate(date)}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="YYYY-MM-DD"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                      minDate={new Date()}
                      required
                      popperPlacement="bottom-start"
                      popperModifiers={[
                        {
                          name: 'preventOverflow',
                          options: {
                            boundary: 'viewport',
                          },
                        },
                      ]}
                    />
                  </div>

                  {/* Time Picker */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="reschedule-time"
                      className="text-sm font-medium text-gray-700 mb-1"
                    >
                      Select New Time
                    </label>
                    <input
                      id="reschedule-time"
                      type="time"
                      value={newTime}
                      onChange={handleTimeChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-md bg-purple-700 text-white hover:bg-purple-800 text-sm font-medium shadow"
                    >
                      {loading ? (
                        <ImSpinner9 className="animate-spin" />
                      ) : (
                        'Save'
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default RescheduleAppointmentModal;
