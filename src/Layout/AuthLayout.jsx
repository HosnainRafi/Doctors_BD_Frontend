import { Outlet } from 'react-router-dom';
import AuthNavbar from '../Shared/Navbar/AuthNavbar';

const AuthLayout = () => {
  return (
    <div>
      <div className="mb-16">
        <AuthNavbar />
      </div>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
