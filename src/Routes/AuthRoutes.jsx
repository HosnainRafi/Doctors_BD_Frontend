import AuthLayout from '../Layout/AuthLayout';
import UserLogin from '../Pages/Main/Login/UserLogin';
import DoctorLogin from '../Pages/Main/Login/DoctorLogin';
import UserRegister from '../Pages/Main/Register/UserRegister';
import DoctorRegister from '../Pages/Main/Register/DoctorRegister';

const AuthRoutes = [
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      { index: true, element: <UserLogin /> },
      { path: 'doctor', element: <DoctorLogin /> },
    ],
  },
  {
    path: '/register',
    element: <AuthLayout />,
    children: [
      { index: true, element: <UserRegister /> },
      { path: 'doctor', element: <DoctorRegister /> },
    ],
  },
];

export default AuthRoutes;
