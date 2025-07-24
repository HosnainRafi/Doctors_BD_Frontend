import { Outlet } from 'react-router-dom';
import Navbar from '../Shared/Navbar/Navbar';
import Footer from '../Shared/Footer/Footer';
import AuthNavbar from '../Shared/Navbar/AuthNavbar';

const AuthLayout = () => {
  return (
    <div>
      <div className="mb-16">
        <AuthNavbar />
      </div>
      <Outlet />
      <Footer />
    </div>
  );
};

export default AuthLayout;
