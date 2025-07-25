import { Outlet } from 'react-router-dom';
import Navbar from '../Shared/Navbar/Navbar';
import Footer from '../Shared/Footer/Footer';
import ChatBot from '../Pages/Main/ChatBot/ChatBot';
import DoctorSearchBar from '../Pages/Main/serachBar/DoctorSearchBar';

const MainLayout = () => {
  return (
    <div>
      <div className="mb-6">
        <Navbar />
        <DoctorSearchBar />
      </div>
      <Outlet />
      <Footer />
      <ChatBot />
    </div>
  );
};

export default MainLayout;
