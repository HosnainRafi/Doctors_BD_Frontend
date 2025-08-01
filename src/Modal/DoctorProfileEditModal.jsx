import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiHash,
  FiBriefcase,
  FiBookOpen,
  FiFileText,
} from 'react-icons/fi';
import { ImSpinner9 } from 'react-icons/im';

const SPECIALTIES = [
  'General Physician',
  'Cardiology',
  'Dermatology',
  'Pediatrics',
  'Neurology',
  'Orthopedics',
  'Psychiatry',
  'Urology',
  'Gastroenterology',
  'Oncology',
  'Other',
];

const DEGREES = [
  'MBBS',
  'FCPS',
  'MD',
  'MS',
  'MRCP',
  'FRCS',
  'BCS (Health)',
  'DGO',
  'DLO',
  'Other',
];

const DoctorProfileEditModal = ({
  isOpen,
  setIsOpen,
  form,
  handleChange,
  handleSpecialtiesChange,
  handleDegreesChange,
  handlePhotoChange,
  handleSave,
  editProfileLoading,
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setIsOpen(false)}
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
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all border border-purple-700">
                <Dialog.Title className="text-2xl font-semibold text-purple-700 mb-6">
                  Edit Profile
                </Dialog.Title>

                <form onSubmit={handleSave} className="space-y-5 text-gray-800">
                  {/* Profile Picture */}
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        form.photo ||
                        'https://i.ibb.co/2kR5zq0/doctor-avatar.png'
                      }
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover border-2 border-purple-500"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Profile Photo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="block w-full text-sm text-gray-600 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 flex items-center gap-1">
                        <FiUser /> Name
                      </label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200 placeholder:text-sm"
                        placeholder="Dr. John Doe"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 flex items-center gap-1">
                        <FiMail /> Email
                      </label>
                      <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200 placeholder:text-sm"
                        placeholder="doctor@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 flex items-center gap-1">
                        <FiPhone /> Phone
                      </label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200 placeholder:text-sm"
                        placeholder="017xxxxxxxx"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 flex items-center gap-1">
                        <FiHash /> BMDC Number
                      </label>
                      <input
                        name="bmdc_number"
                        value={form.bmdc_number}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200 placeholder:text-sm"
                        placeholder="BMDC-123456"
                      />
                    </div>
                  </div>

                  {/* Specialty */}
                  <div>
                    <label className="text-sm font-medium mb-1 flex items-center gap-1">
                      <FiBriefcase /> Main Specialty
                    </label>
                    <select
                      name="specialty"
                      value={form.specialty || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
                    >
                      <option value="">Select Main Specialty</option>
                      {SPECIALTIES.map(s => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 flex items-center gap-1">
                      <FiBriefcase /> Other Specialties
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                      {SPECIALTIES.map(s => (
                        <label
                          key={s}
                          className="flex items-center gap-2 p-2 bg-gray-100 rounded hover:bg-purple-50 transition"
                        >
                          <input
                            type="checkbox"
                            name="specialties"
                            value={s}
                            checked={form.specialties?.includes(s)}
                            onChange={handleSpecialtiesChange}
                            className="form-checkbox text-purple-600 focus:ring-purple-500"
                          />
                          {s}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Degrees */}
                  <div>
                    <label className="text-sm font-medium mb-1 flex items-center gap-1">
                      <FiBookOpen /> Degrees
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                      {DEGREES.map(d => (
                        <label
                          key={d}
                          className="flex items-center gap-2 p-2 bg-gray-100 rounded hover:bg-purple-50 transition"
                        >
                          <input
                            type="checkbox"
                            name="degree_names"
                            value={d}
                            checked={form.degree_names?.includes(d)}
                            onChange={handleDegreesChange}
                            className="form-checkbox text-purple-600 focus:ring-purple-500"
                          />
                          {d}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="text-sm font-medium mb-1 flex items-center gap-1">
                      <FiFileText /> Bio
                    </label>
                    <textarea
                      name="bio"
                      value={form.bio}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200 placeholder:text-sm"
                      placeholder="Write something about yourself..."
                      rows={4}
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="bg-gray-300 text-gray-800 px-5 py-2.5 rounded-lg hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-purple-700 text-white px-5 py-2.5 rounded-lg hover:bg-purple-800 transition"
                    >
                      {editProfileLoading ? (
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

export default DoctorProfileEditModal;
