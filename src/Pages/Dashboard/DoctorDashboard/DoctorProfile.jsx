import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiEdit, FiEye, FiEyeOff } from "react-icons/fi";
import { ImSpinner9 } from "react-icons/im";
import { getAuthDoctorToken } from "../../../utils/getAuthDoctorToken";
import { getDoctorIdByEmail } from "../../../utils/getDoctorIdByEmail";
import axiosCommon from "../../../api/axiosCommon";

// --- CONSTANTS ---
const SPECIALTIES = [
  "Allergy & Immunology",
  "Anesthesiology",
  "Cardiology (Heart)",
  "Cardiothoracic Surgery",
  "Colorectal Surgery",
  "Dentistry (Dental)",
  "Dermatology (Skin)",
  "Endocrinology (Diabetes & Hormones)",
  "ENT (Ear, Nose, Throat)",
  "Family Medicine",
  "Gastroenterology (Digestive)",
  "General Physician",
  "General Surgery",
  "Geriatrics (Elderly Care)",
  "Gynecology & Obstetrics (OB/GYN)",
  "Hematology (Blood)",
  "Hepatology (Liver)",
  "Homeopathy",
  "Infectious Disease",
  "Internal Medicine",
  "Infertility Specialist",
  "Nephrology (Kidney)",
  "Neurology (Brain & Nerves)",
  "Neurosurgery",
  "Oncology (Cancer)",
  "Ophthalmology (Eye)",
  "Orthopedics (Bone & Joint)",
  "Pediatrics (Child Care)",
  "Physical Medicine & Rehabilitation",
  "Plastic Surgery",
  "Psychiatry (Mental Health)",
  "Pulmonology (Lungs)",
  "Radiology",
  "Rheumatology (Arthritis)",
  "Urology (Urinary)",
  "Vascular Surgery",
];
const DEGREES = [
  "MBBS",
  "FCPS",
  "MD",
  "MS",
  "MRCP",
  "FRCS",
  "BCS (Health)",
  "DGO",
  "DLO",
  "Other",
];
const DISTRICTS = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
  "Bagerhat",
  "Bandarban",
  "Barguna",
  "Bhola",
  "Bogra",
  "Brahmanbaria",
  "Chandpur",
  "Chapainawabganj",
  "Chuadanga",
  "Comilla",
  "Cox's Bazar",
  "Dinajpur",
  "Faridpur",
  "Feni",
  "Gaibandha",
  "Gazipur",
  "Gopalganj",
  "Habiganj",
  "Jamalpur",
  "Jashore",
  "Jhalokati",
  "Jhenaidah",
  "Joypurhat",
  "Khagrachari",
  "Kishoreganj",
  "Kurigram",
  "Kushtia",
  "Lakshmipur",
  "Lalmonirhat",
  "Madaripur",
  "Magura",
  "Manikganj",
  "Meherpur",
  "Moulvibazar",
  "Munshiganj",
  "Naogaon",
  "Narail",
  "Narayanganj",
  "Narsingdi",
  "Natore",
  "Netrokona",
  "Nilphamari",
  "Noakhali",
  "Pabna",
  "Panchagarh",
  "Patuakhali",
  "Pirojpur",
  "Rajbari",
  "Rangamati",
  "Shariatpur",
  "Sherpur",
  "Sirajganj",
  "Sunamganj",
  "Tangail",
  "Thakurgaon",
];
const GENDERS = ["Male", "Female", "Other"];

// --- MODAL COMPONENT ---
const DoctorProfileEditModal = ({
  isOpen,
  setIsOpen,
  form,
  handleChange,
  handleDegreesChange,
  handlePhotoChange,
  handleSave,
  editProfileLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-purple-700">Edit Profile</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-800 text-3xl font-light"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profile Photo
            </label>
            <div className="mt-1 flex items-center space-x-4">
              <img
                src={form.photo || "https://i.pravatar.cc/150"}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-purple-300"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700"
            >
              Biography
            </label>
            <textarea
              id="bio"
              name="bio"
              value={form.bio || ""}
              onChange={handleChange}
              rows="4"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Gender Dropdown */}
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={form.gender || ""}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="" disabled>
                Select Gender
              </option>
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* District Dropdown */}
          <div>
            <label
              htmlFor="district"
              className="block text-sm font-medium text-gray-700"
            >
              District
            </label>
            <select
              id="district"
              name="district"
              value={form.district || ""}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="" disabled>
                Select District
              </option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Degrees Checkboxes */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Degrees
            </label>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DEGREES.map((degree) => (
                <label
                  key={degree}
                  className="flex items-center space-x-2 text-sm"
                >
                  <input
                    type="checkbox"
                    value={degree}
                    checked={form.degree_names?.includes(degree) || false}
                    onChange={handleDegreesChange}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>{degree}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={editProfileLoading}
              className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 disabled:bg-purple-400 flex items-center justify-center font-medium w-36"
            >
              {editProfileLoading ? (
                <ImSpinner9 className="animate-spin" />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [form, setForm] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
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
          headers: { Authorization: `Bearer ${doctorToken}` },
        });
        const data = response.data;
        if (data?.data) {
          setDoctor(data.data);
          // Initialize form state for the modal
          setForm({
            ...data.data,
            specialties: data.data.specialties || [],
            degree_names: data.data.degree_names || [],
            bio: data.data.bio || "",
            gender: data.data.gender || "",
            district: data.data.district || "",
          });
        } else {
          toast.error("Doctor not found.");
        }
      } catch (error) {
        toast.error(error.message || "Failed to fetch doctor profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorToken]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDegreesChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      degree_names: prev.degree_names.includes(value)
        ? prev.degree_names.filter((d) => d !== value)
        : [...prev.degree_names, value],
    }));
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, photo: URL.createObjectURL(file) });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setEditProfileLoading(true);
      const res = await axiosCommon.patch(
        `/registered-doctors/${doctorId}`,
        form,
        {
          headers: { Authorization: `Bearer ${doctorToken}` },
        }
      );
      const data = res.data;
      if (data.success) {
        setDoctor(data.data);
        toast.success("Profile updated!");
      } else {
        toast.error(data.message || "Failed to update profile.");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update profile.");
    } finally {
      setEditProfileLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosCommon.patch(
        `/registered-doctors/${doctorId}`,
        { password },
        {
          headers: { Authorization: `Bearer ${doctorToken}` },
        }
      );
      const data = res.data;
      if (data.success) {
        setPassword("");
        toast.success("Password changed!");
      } else {
        toast.error(data.message || "Failed to change password.");
      }
    } catch (error) {
      toast.error(error.message || "Failed to change password.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-10 bg-white rounded-2xl shadow-lg px-4 sm:px-6 py-8">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ImSpinner9 size={40} className="animate-spin text-purple-600" />
        </div>
      ) : doctor ? (
        <div>
          <div className="flex flex-col items-center ">
            <h2 className="text-3xl font-bold text-purple-700">My Profile</h2>
            <img
              src={doctor.photo || "https://i.pravatar.cc/150"}
              alt="Profile"
              className="w-40 h-40 rounded-full border-4 border-purple-700 object-cover shadow mt-4"
            />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg mt-6">
            <div className="max-w-6xl mx-auto space-y-6 text-gray-700">
              <div className="border border-purple-700 p-5 rounded-2xl shadow-md bg-white">
                <div className="flex items-start sm:items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-grow">
                      <h3 className="text-xs text-purple-700 font-bold uppercase tracking-widest mb-1">
                        Personal Information
                      </h3>
                      <h3 className="text-2xl font-semibold text-purple-700">
                        {doctor.name}
                      </h3>
                      <p className="text-base text-gray-500">
                        {doctor.specialty ||
                          (doctor.specialties && doctor.specialties.join(", "))}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-purple-800 p-2 rounded-full hover:bg-purple-100 flex items-center gap-2"
                  >
                    <FiEdit className="text-xl" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pt-3 border-t">
                  <div>
                    <span className="font-medium text-gray-600">Email:</span>{" "}
                    <a
                      href={`mailto:${doctor.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {doctor.email}
                    </a>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Phone:</span>{" "}
                    <a
                      href={`tel:${doctor.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {doctor.phone}
                    </a>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Gender:</span>{" "}
                    {doctor.gender || "Not set"}
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">District:</span>{" "}
                    {doctor.district || "Not set"}
                  </div>
                  <div className="sm:col-span-2">
                    <span className="font-medium text-gray-600">Degrees:</span>{" "}
                    {doctor.degree_names && doctor.degree_names.join(", ")}
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">BMDC No:</span>{" "}
                    {doctor.bmdc_number}
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-purple-700 p-5 rounded-2xl shadow-md bg-white">
                  <h3 className="text-xs text-purple-700 font-bold uppercase tracking-widest mb-1">
                    Biography
                  </h3>
                  <h2 className="font-semibold text-2xl text-purple-700">
                    About Me:
                  </h2>
                  <p className="text-sm text-gray-700 mt-1">
                    {doctor.bio || "No biography provided."}
                  </p>
                </div>
                <div className="border border-purple-700 p-5 rounded-2xl shadow-md bg-white">
                  <h3 className="text-xs text-purple-700 font-bold uppercase tracking-widest mb-2">
                    Security
                  </h3>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <label className="block text-base font-medium text-gray-600">
                      Change Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        minLength={6}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-700 text-xl"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-purple-700 text-white py-3 rounded-lg hover:bg-purple-800 font-semibold"
                    >
                      Update Password
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
            handleDegreesChange={handleDegreesChange}
            handlePhotoChange={handlePhotoChange}
            handleSave={handleSave}
            editProfileLoading={editProfileLoading}
          />
        </div>
      ) : null}
    </div>
  );
};

export default DoctorProfile;
