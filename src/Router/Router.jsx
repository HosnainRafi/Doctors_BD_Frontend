import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../Layout/MainLayout';
import ChatWithAssistant from '../Pages/Main/ChatWithAssistant/ChatWithAssistant';
import FindDoctorByDistrict from '../Pages/Main/FindDoctorByDistrict/FindDoctorByDistrict';
import DoctorDetails from '../Pages/Main/DoctorDetails/DoctorDetails';
import AllDoctors from '../Pages/Main/AllDoctors/AllDoctors';
import ErrorPage from '../Pages/Main/ErrorPage/ErrorPage';
import Contact from '../Pages/Main/Contact/Contact';
import FindDoctorByHospital from '../Pages/Main/FindDoctorByHospital/FindDoctorByHospital';
import FindDoctorByCategory from '../Pages/Main/FindDoctorByCategory/FindDoctorByCategory';
import ArticleDetailPage from '../components/ArticleDetailPage';
import DevTeam from '../Pages/Main/Team/Team';
import AboutUs from '../Pages/Main/AboutUs/AboutUs';
import UserLogin from '../Pages/Main/Login/UserLogin';
import UserRegister from '../Pages/Main/Register/UserRegister';
import DoctorLogin from '../Pages/Main/Login/DoctorLogin';
import DoctorRegister from '../Pages/Main/Register/DoctorRegister';
import UserDashboard from '../Pages/Dashboard/UserDashboard/UserDashboard';
import DoctorDashboard from '../Pages/Dashboard/DoctorDashboard/DoctorDashboard';
import BookAppointment from '../Pages/Dashboard/UserDashboard/BookAppointment';
import AuthLayout from '../Layout/AuthLayout';
import DashboardUserLayout from '../Layout/DashboardUserLayout';
import CompleteProfilePage from '../Pages/Dashboard/DoctorDashboard/CompleteProfilePage';
import Home from '../Pages/Main/Home/Home';
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/chat-with-assistant',
        element: <ChatWithAssistant />,
      },
      {
        path: '/find-doctor-by-district',
        element: <FindDoctorByDistrict />,
      },
      {
        path: '/find-doctor-by-hospital',
        element: <FindDoctorByHospital />,
      },
      {
        path: '/find-doctor-by-category',
        element: <FindDoctorByCategory />,
      },
      {
        path: '/doctor/:slug',
        element: <DoctorDetails />,
      },
      {
        path: '/all-doctors',
        element: <AllDoctors />,
      },
      {
        path: '/contact',
        element: <Contact />,
      },
      {
        path: '/about-us',
        element: <AboutUs />,
      },
      {
        path: '/team',
        element: <DevTeam />,
      },
      {
        path: '/article/:id',
        element: <ArticleDetailPage />,
      },
      {
        path: '/doctor/dashboard',
        element: <DoctorDashboard />,
      },
      {
        path: '/book-appointment',
        element: <BookAppointment />,
      },
    ],
  },
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <UserLogin />,
      },
      {
        path: 'doctor',
        element: <DoctorLogin />,
      },
    ],
  },
  {
    path: '/register',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <UserRegister />,
      },
      {
        path: 'doctor',
        element: <DoctorRegister />,
      },
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardUserLayout />,
    children: [
      {
        path: 'user',
        element: <UserDashboard />,
      },
    ],
  },
  {
    path: '/doctor/complete-profile',
    element: <CompleteProfilePage />,
  },
]);
