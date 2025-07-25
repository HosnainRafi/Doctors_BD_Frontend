import { Link } from 'react-router-dom';
import DoctorRegisterForm from '../../../components/Auth/DoctorRegisterForm';

const DoctorRegister = () => (
  <div
    className="flex items-center justify-center bg-gray-50 px-4 py-10"
    style={{ minHeight: 'calc(100vh - 65px)' }}
  >
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-10 ring-1 ring-blue-300 ring-opacity-30 hover:shadow-blue-500/40 transition-shadow duration-300">
      <h2 className="text-3xl font-extrabold text-blue-700 mb-4 text-center tracking-wide">
        Doctor Registration
      </h2>
      <hr className="border border-t-blue-700" />
      <DoctorRegisterForm />
      <div className="mt-6 text-center text-sm text-black font-medium">
        Already have an account?{' '}
        <Link
          to="/doctor/login"
          className="text-blue-700 font-bold hover:underline hover:text-blue-900 transition-colors duration-200"
        >
          Login
        </Link>
      </div>
    </div>
  </div>
);

export default DoctorRegister;
