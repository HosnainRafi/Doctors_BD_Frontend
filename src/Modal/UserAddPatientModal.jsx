import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import toast from 'react-hot-toast';
import { HiCheckCircle, HiXCircle } from 'react-icons/hi';
import axiosCommon from '../api/axiosCommon';
import { getAuthToken } from './../utils/getAuthToken';
import { ImSpinner9 } from 'react-icons/im';

function calculateAge(dob) {
  if (!dob) return '';
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return `${age} years`;
}

const defaultForm = {
  name: '',
  phone: '',
  email: '',
  dob: null,
  gender: '',
  address: '',
  weight: '',
  chief_complaints: '',
};

const UserAddPatientModal = ({
  isOpen,
  onClose,
  userId,
  editPatient,
  onPatientSaved,
}) => {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editPatient && typeof editPatient === 'object') {
      setForm({
        name: editPatient.name || '',
        phone: editPatient.phone || '',
        email: editPatient.email || '',
        dob: editPatient.dob ? new Date(editPatient.dob) : null,
        gender: editPatient.gender || '',
        address: editPatient.address || '',
        weight: editPatient.weight || '',
        chief_complaints: Array.isArray(editPatient.chief_complaints)
          ? editPatient.chief_complaints.join('\n')
          : '',
      });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
  }, [editPatient, isOpen]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleDateChange = date => {
    setForm(prev => ({ ...prev, dob: date }));
    setErrors(prev => ({ ...prev, dob: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Full Name is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!form.dob) newErrors.dob = 'Date of Birth is required';
    if (!form.gender) newErrors.gender = 'Gender is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.weight) newErrors.weight = 'Weight is required';
    if (!form.chief_complaints.trim())
      newErrors.chief_complaints = 'Chief Complaints are required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const token = getAuthToken();
    const chiefComplaintsArray = form.chief_complaints
      .split('\n')
      .map(c => c.trim())
      .filter(Boolean);

    const payload = {
      ...form,
      dob: form.dob?.toISOString().split('T')[0] || '',
      age: calculateAge(form.dob),
      user_id: userId,
      chief_complaints: chiefComplaintsArray,
    };

    try {
      const method = editPatient ? 'patch' : 'post';
      const url = editPatient ? `/patients/${editPatient._id}` : '/patients';
      const res = await axiosCommon[method](url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success(
          <div className="flex items-center gap-2 text-green-600">
            <HiCheckCircle className="text-xl" />
            Patient {editPatient ? 'updated' : 'added'} successfully!
          </div>
        );
        setForm(defaultForm);
        setErrors({});
        onPatientSaved();
        onClose();
      } else {
        throw new Error(res.data.message || 'Operation failed');
      }
    } catch (err) {
      toast.error(
        <div className="flex items-center gap-2 text-red-600">
          <HiXCircle className="text-xl" />
          {err.message || 'Something went wrong.'}
        </div>
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-6 text-left">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-90"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-90"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-semibold leading-7 text-center text-gray-900 mb-8 border-b pb-4"
                >
                  {editPatient ? 'Edit Patient' : 'Add Patient'}
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Name */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="name"
                        className="mb-1 text-sm font-semibold text-gray-700"
                      >
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className={`border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-transparent shadow-sm transition ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="phone"
                        className="mb-1 text-sm font-semibold text-gray-700"
                      >
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="phone"
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className={`border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-transparent shadow-sm transition ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="email"
                        className="mb-1 text-sm font-semibold text-gray-700"
                      >
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className={`border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-transparent shadow-sm transition ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* DOB */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="dob"
                        className="mb-1 text-sm font-semibold text-gray-700"
                      >
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <DatePicker
                        id="dob"
                        selected={form.dob}
                        onChange={handleDateChange}
                        placeholderText="Select date"
                        dateFormat="yyyy-MM-dd"
                        className={`border rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-transparent shadow-sm transition ${
                          errors.dob ? 'border-red-500' : 'border-gray-300'
                        }`}
                        maxDate={new Date()}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        isClearable
                      />
                      {errors.dob && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.dob}
                        </p>
                      )}
                    </div>

                    {/* Gender */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="gender"
                        className="mb-1 text-sm font-semibold text-gray-700"
                      >
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        className={`border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-transparent shadow-sm transition ${
                          errors.gender ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.gender && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.gender}
                        </p>
                      )}
                    </div>

                    {/* Address */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="address"
                        className="mb-1 text-sm font-semibold text-gray-700"
                      >
                        Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="address"
                        type="text"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        className={`border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-transparent shadow-sm transition ${
                          errors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.address && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.address}
                        </p>
                      )}
                    </div>

                    {/* Weight */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="weight"
                        className="mb-1 text-sm font-semibold text-gray-700"
                      >
                        Weight (kg) <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="weight"
                        type="number"
                        name="weight"
                        value={form.weight}
                        onChange={handleChange}
                        className={`border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-transparent shadow-sm transition ${
                          errors.weight ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.weight && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.weight}
                        </p>
                      )}
                    </div>

                    {/* Age (disabled) */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="age"
                        className="mb-1 text-sm font-semibold text-gray-700"
                      >
                        Age
                      </label>
                      <input
                        id="age"
                        type="text"
                        value={calculateAge(form.dob)}
                        disabled
                        className="border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 text-gray-400 cursor-not-allowed shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Chief complaints textarea */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="chief_complaints"
                      className="mb-2 text-sm font-semibold text-gray-700"
                    >
                      Chief Complaints <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="chief_complaints"
                      name="chief_complaints"
                      value={form.chief_complaints}
                      onChange={handleChange}
                      rows="4"
                      className={`resize-none border rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-transparent shadow-sm transition ${
                        errors.chief_complaints
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      placeholder="Each complaint in a new line"
                    />
                    {errors.chief_complaints && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.chief_complaints}
                      </p>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end gap-4 mt-8">
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-lg px-6 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="rounded-lg px-6 py-2.5 bg-purple-600 text-white hover:bg-purple-700 transition disabled:opacity-60 flex items-center gap-2 justify-center"
                    >
                      {loading && <ImSpinner9 className='animate-spin'/>}
                      {editPatient ? 'Update Patient' : 'Add Patient'}
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

export default UserAddPatientModal;
