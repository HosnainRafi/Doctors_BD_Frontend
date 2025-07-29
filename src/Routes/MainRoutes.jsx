import MainLayout from '../Layout/MainLayout';
import Home from '../Pages/Main/Home/Home';
import ChatWithAssistant from '../Pages/Main/ChatWithAssistant/ChatWithAssistant';
import FindDoctorByDistrict from '../Pages/Main/FindDoctorByDistrict/FindDoctorByDistrict';
import FindDoctorByHospital from '../Pages/Main/FindDoctorByHospital/FindDoctorByHospital';
import FindDoctorByCategory from '../Pages/Main/FindDoctorByCategory/FindDoctorByCategory';
import DoctorDetails from '../Pages/Main/DoctorDetails/DoctorDetails';
import AllDoctors from '../Pages/Main/AllDoctors/AllDoctors';
import Contact from '../Pages/Main/Contact/Contact';
import MedexSearch from '../Pages/SearchMedex/MedexSearch';
import MedexDetails from '../Pages/SearchMedex/MedexDetails';
import AboutUs from '../Pages/Main/AboutUs/AboutUs';
import DevTeam from '../Pages/Main/Team/Team';
import ArticleDetailPage from '../components/ArticleDetailPage';
import CompleteProfilePage from '../Pages/Dashboard/DoctorDashboard/CompleteProfilePage';
import CompleteDoctorProfilePage from '../Pages/Dashboard/DoctorDashboard/CompleteDoctorProfilePage';
import VerifyEmailPageForUser from '../components/Auth/VerifyEmailPageForUser';
import VerifyEmailPageForDoctor from '../components/Auth/VerifyEmailPageForDoctor';
import ErrorPage from '../Pages/Main/ErrorPage/ErrorPage';

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  errorElement: <ErrorPage />,
  children: [
    { path: '/', element: <Home /> },
    { path: '/chat-with-assistant', element: <ChatWithAssistant /> },
    { path: '/find-doctor-by-district', element: <FindDoctorByDistrict /> },
    { path: '/find-doctor-by-hospital', element: <FindDoctorByHospital /> },
    { path: '/find-doctor-by-category', element: <FindDoctorByCategory /> },
    { path: '/doctor/:slug', element: <DoctorDetails /> },
    { path: '/all-doctors', element: <AllDoctors /> },
    { path: '/contact', element: <Contact /> },
    { path: '/search-medicine', element: <MedexSearch /> },
    { path: '/medicine-details', element: <MedexDetails /> },
    { path: '/about-us', element: <AboutUs /> },
    { path: '/team', element: <DevTeam /> },
    { path: '/article/:id', element: <ArticleDetailPage /> },
    { path: '/doctor/complete-profile', element: <CompleteProfilePage /> },
    { path: '/complete-profile', element: <CompleteDoctorProfilePage /> },
    { path: '/verify-email-for-user', element: <VerifyEmailPageForUser /> },
    { path: '/verify-email-for-doctor', element: <VerifyEmailPageForDoctor /> },
  ],
};

export default MainRoutes;
