import { Outlet } from 'react-router-dom';
import Navbar from '../Shared/Navbar/Navbar';
import Footer from '../Shared/Footer/Footer';
import ChatBot from '../Pages/ChatBot/ChatBot';
import DoctorSearchBar from './../Pages/serachBar/DoctorSearchBar';

const AuthLayout = () => {
  return (
    <div>
      <div className="mb-6">
        <Navbar />
      </div>
      <Outlet />
      <Footer />
      <ChatBot />
    </div>
  );
};

export default AuthLayout;
