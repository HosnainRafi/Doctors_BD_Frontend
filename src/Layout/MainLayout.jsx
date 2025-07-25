import { Outlet } from 'react-router-dom';
import Navbar from '../Shared/Navbar/Navbar';
import Footer from '../Shared/Footer/Footer';
import ChatBot from '../Pages/Main/ChatBot/ChatBot';
import DoctorSearchBar from '../Pages/Main/serachBar/DoctorSearchBar';

const MainLayout = () => {
  return (
    <div>
      <div className="mb-2 relative">
        <Navbar />
        <div className="fixed top-0 w-full left-0 z-20 pb-3 bg-white">
          <DoctorSearchBar />
        </div>
      </div>
      <div className='mt-[150px]'>
        <Outlet />
        <Footer />
        <ChatBot />
      </div>
    </div>
  );
};

export default MainLayout;
