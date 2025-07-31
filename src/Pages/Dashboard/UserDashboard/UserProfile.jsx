import { useEffect, useState } from 'react';
import { FiEdit, FiEye, FiEyeOff, FiMail, FiPhone } from 'react-icons/fi';
import { getUserIdByEmail } from '../../../utils/getUserIdByEmail';
import axiosCommon from '../../../api/axiosCommon';
import toast from 'react-hot-toast';
import { ImSpinner9 } from 'react-icons/im';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const id = await getUserIdByEmail();
        setUserId(id);
        const res = await axiosCommon.get(`/users/${id}`);
        const data = res.data;
        setUser(data.data);
        setForm(data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async e => {
    e.preventDefault();
    try {
      const res = await axiosCommon.patch(`/users/${userId}`, form);
      if (res.data.success) {
        setUser(res.data.data);
        setEditMode(false);
        toast.success('Profile updated!');
      } else {
        toast.error(res.data.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Something went wrong.');
    }
  };

  const handleChangePassword = async e => {
    e.preventDefault();
    try {
      const res = await axiosCommon.patch(`/users/${userId}`, { password });
      if (res.data.success) {
        setPassword('');
        toast.success('Password changed!');
      } else {
        toast.error(res.data.message || 'Failed to change password.');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Something went wrong.');
    }
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ImSpinner9 size={40} className="animate-spin text-purple-600" />
        </div>
      ) : (
        <div className="max-w-3xl mx-auto mt-10 bg-white rounded-2xl shadow-md px-6 py-8">
          <div className="flex flex-col items-center ">
            {/* <img
          src="https://i.pravatar.cc/150"
          alt="Profile"
          className="w-40 h-40 rounded-full border-4 border-purple-700 object-cover shadow"
        /> */}
            <h2 className=" text-3xl font-bold text-purple-700">
              User Profile
            </h2>
          </div>

          {!editMode ? (
            <div className="space-y-6 text-gray-700 p-4 sm:p-6 max-w-4xl mx-auto">
              <div className="border border-purple-700 p-5 rounded-2xl shadow-md bg-white relative">
                <h3 className="text-sm text-purple-700 font-bold uppercase tracking-widest mb-4">
                  Personal Details
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide ">
                      Full Name
                    </label>
                    <p className="text-2xl font-medium truncate">
                      {user?.name}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <FiMail className="text-lg" />
                    <a
                      href={`mailto:${user?.email}`}
                      className="hover:underline  truncate text-base"
                    >
                      {user?.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <FiPhone className="text-lg" />
                    <a
                      href={`tel:${user?.phone}`}
                      className="hover:underline  truncate text-base"
                    >
                      {user?.phone}
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => setEditMode(true)}
                  className="absolute top-4 right-4 text-purple-700 hover:text-purple-900 text-2xl"
                  title="Edit Profile"
                >
                  <FiEdit />
                </button>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4 pt-4">
                <div className="border border-purple-700 p-5 rounded-2xl shadow-md bg-white">
                  <h3 className="text-sm text-purple-700 font-bold uppercase tracking-widest mb-4">
                    Security
                  </h3>

                  <div className="relative">
                    <label htmlFor="changePassword" className='pb-2'>New Password</label>
                    <input
                      name="changePassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="New Password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 bottom-[25%] transform -translate-y-1/2 text-purple-700"
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
                </div>
              </form>
            </div>
          ) : (
            <form onSubmit={handleSave}>
              <div className="border border-purple-700 p-5 rounded-2xl shadow-md bg-white space-y-6">
                <h3 className="text-base text-purple-700 font-bold uppercase tracking-widest mb-4">
                  Edit Personal Details
                </h3>

                <div className="">
                  <label className="text-base text-gray-600">Full Name</label>
                  <input
                    name="name"
                    value={form.name || ''}
                    onChange={handleChange}
                    className="w-full mt-1 px-4 py-3 border rounded-lg shadow-sm  focus:outline-purple-700 "
                    placeholder="Name"
                    required
                  />
                </div>
                <div>
                  <label className="text-base text-gray-600">Email</label>
                  <input
                    name="email"
                    value={form.email || ''}
                    onChange={handleChange}
                    className="w-full mt-1 px-4 py-3 border rounded-lg shadow-sm focus:outline-purple-700 focus:ring-purple-500"
                    placeholder="Email"
                    required
                  />
                </div>
                <div>
                  <label className="text-base text-gray-600">Phone</label>
                  <input
                    name="phone"
                    value={form.phone || ''}
                    onChange={handleChange}
                    className="w-full mt-1 px-4 py-3 border rounded-lg shadow-sm focus:outline-purple-700 focus:ring-purple-500"
                    placeholder="Phone"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="w-1/2 border border-gray-300 py-3 rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 bg-purple-700 text-white py-3 rounded-lg hover:bg-purple-800"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
