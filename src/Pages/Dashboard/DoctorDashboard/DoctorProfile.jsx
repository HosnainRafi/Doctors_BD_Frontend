import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiEdit, FiEye, FiEyeOff } from 'react-icons/fi';
import { getAuthDoctorToken } from '../../../utils/getAuthDoctorToken';
import { getDoctorIdByEmail } from '../../../utils/getDoctorIdByEmail';
import axiosCommon from '../../../api/axiosCommon';
import DoctorProfileEditModal from '../../../Modal/DoctorProfileEditModal';
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

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [form, setForm] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const doctorToken = getAuthDoctorToken();
  const [doctorId, setDoctorId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProfileLoading, setEditProfileLoading] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const id = await getDoctorIdByEmail();
        setDoctorId(id);
        const response = await axiosCommon.get(`/registered-doctors/${id}`, {
          headers: {
            Authorization: `Bearer ${doctorToken}`,
          },
        });
        const data = response.data;
        if (data?.data) {
          setDoctor(data.data);
          setForm({
            ...data.data,
            specialties: data.data.specialties || [],
            degree_names: data.data.degree_names || [],
          });
        } else {
          toast.error('Doctor not found.');
        }
      } catch (error) {
        toast.error(error.message || 'Failed to fetch doctor profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorToken]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSpecialtiesChange = e => {
    const value = e.target.value;
    setForm(prev => ({
      ...prev,
      specialties: prev.specialties.includes(value)
        ? prev.specialties.filter(s => s !== value)
        : [...prev.specialties, value],
    }));
  };

  const handleDegreesChange = e => {
    const value = e.target.value;
    setForm(prev => ({
      ...prev,
      degree_names: prev.degree_names.includes(value)
        ? prev.degree_names.filter(d => d !== value)
        : [...prev.degree_names, value],
    }));
  };

  const handlePhotoChange = async e => {
    const file = e.target.files[0];
    if (!file) return;

    setForm({ ...form, photo: URL.createObjectURL(file) });
  };

  const handleSave = async e => {
    e.preventDefault();
    try {
      setEditProfileLoading(true);
      const res = await axiosCommon.patch(
        `/registered-doctors/${doctorId}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${doctorToken}`,
          },
        }
      );

      const data = res.data;

      if (data.success) {
        setDoctor(data.data);
        toast.success('Profile updated!');
      } else {
        toast.error(data.message || 'Failed to update profile.');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update profile.');
    } finally {
      setEditProfileLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleChangePassword = async e => {
    e.preventDefault();
    try {
      const res = await axiosCommon.patch(
        `/registered-doctors/${doctorId}`,
        { password },
        {
          headers: {
            Authorization: `Bearer ${doctorToken}`,
          },
        }
      );

      const data = res.data;

      if (data.success) {
        setPassword('');
        toast.success('Password changed!');
      } else {
        toast.error(data.message || 'Failed to change password.');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to change password.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-white rounded-2xl shadow-md px-6 py-8">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ImSpinner9 size={40} className="animate-spin text-purple-600" />
        </div>
      ) : (
        <div>
          {' '}
          <div className="flex flex-col items-center ">
            <h2 className=" text-3xl font-bold text-purple-700">My Profile</h2>
            <img
              src={doctor.photo || 'https://i.pravatar.cc/150'}
              alt="Profile"
              className="w-40 h-40 rounded-full border-4 border-purple-700 object-cover shadow"
            />
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <div>
              <div className="max-w-6xl mx-auto space-y-6 text-gray-700 p-4 sm:p-6">
                <div className="border border-purple-700 p-5 rounded-2xl shadow-md bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div>
                        <h3 className="text-xs text-purple-700 font-bold uppercase tracking-widest mb-1">
                          Personal Information
                        </h3>
                        <h3 className="text-2xl font-semibold text-purple-700">
                          {doctor.name}
                        </h3>
                        <p className="text-base text-gray-500">
                          {doctor.specialty ||
                            (doctor.specialties &&
                              doctor.specialties.join(', '))}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className=" text-purple-800 px-4 py-2 rounded-lg  flex items-center gap-2"
                    >
                      <FiEdit className="text-xl" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-600">Email:</span>{' '}
                      <a
                        href={`mailto:${doctor.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {doctor.email}
                      </a>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Phone:</span>{' '}
                      <a
                        href={`tel:${doctor.phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {doctor.phone}
                      </a>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        Degrees:
                      </span>{' '}
                      {doctor.degree_names && doctor.degree_names.join(', ')}
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        BMDC No:
                      </span>{' '}
                      {doctor.bmdc_number}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6">
                  <div className="border border-purple-700 p-5 rounded-2xl shadow-md bg-white">
                    <div>
                      <h3 className="text-xs text-purple-700 font-bold uppercase tracking-widest mb-1">
                        Biography
                      </h3>
                      <h2 className="font-semibold text-2xl text-purple-700 ">
                        About Me:
                      </h2>{' '}
                      <p className="text-sm text-gray-700 mt-1">{doctor.bio}</p>
                    </div>
                  </div>
                  <div className="border border-purple-700 p-5 rounded-2xl shadow-md bg-white">
                    <form
                      onSubmit={handleChangePassword}
                      className="space-y-3 pt-2"
                    >
                      <h3 className="text-xs text-purple-700 font-bold uppercase tracking-widest ">
                        Security
                      </h3>
                      <label className="block text-base font-medium text-gray-600">
                        Change Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="New Password"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          className="w-full px-4 py-3 pr-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          minLength={6}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(v => !v)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-700 text-xl"
                          aria-label="Toggle password visibility"
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-purple-700 text-white py-3 rounded-lg hover:bg-purple-800"
                      >
                        Change Password
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <DoctorProfileEditModal
              isOpen={isModalOpen}
              setIsOpen={setIsModalOpen}
              form={form}
              setForm={setForm}
              handleChange={handleChange}
              handleSpecialtiesChange={handleSpecialtiesChange}
              handleDegreesChange={handleDegreesChange}
              handlePhotoChange={handlePhotoChange}
              handleSave={handleSave}
              editProfileLoading={editProfileLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;
