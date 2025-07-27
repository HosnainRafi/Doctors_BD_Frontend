import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import ChatWithAssistant from "../Pages/Main/ChatWithAssistant/ChatWithAssistant";
import FindDoctorByDistrict from "../Pages/Main/FindDoctorByDistrict/FindDoctorByDistrict";
import DoctorDetails from "../Pages/Main/DoctorDetails/DoctorDetails";
import AllDoctors from "../Pages/Main/AllDoctors/AllDoctors";
import ErrorPage from "../Pages/Main/ErrorPage/ErrorPage";
import Contact from "../Pages/Main/Contact/Contact";
import FindDoctorByHospital from "../Pages/Main/FindDoctorByHospital/FindDoctorByHospital";
import FindDoctorByCategory from "../Pages/Main/FindDoctorByCategory/FindDoctorByCategory";
import ArticleDetailPage from "../components/ArticleDetailPage";
import DevTeam from "../Pages/Main/Team/Team";
import AboutUs from "../Pages/Main/AboutUs/AboutUs";
import UserLogin from "../Pages/Main/Login/UserLogin";
import UserRegister from "../Pages/Main/Register/UserRegister";
import DoctorLogin from "../Pages/Main/Login/DoctorLogin";
import DoctorRegister from "../Pages/Main/Register/DoctorRegister";
import UserDashboard from "../Pages/Dashboard/UserDashboard/UserDashboard";
import DoctorDashboard from "../Pages/Dashboard/DoctorDashboard/DoctorDashboard";
import BookAppointment from "../Pages/Dashboard/UserDashboard/BookAppointment";
import AuthLayout from "../Layout/AuthLayout";
import DashboardUserLayout from "../Layout/DashboardUserLayout";
import CompleteProfilePage from "../Pages/Dashboard/DoctorDashboard/CompleteProfilePage";
import Home from "../Pages/Main/Home/Home";
import PatientList from "../Pages/Dashboard/UserDashboard/PatientList";
import VerifyEmailPageForUser from "../components/Auth/VerifyEmailPageForUser";
import VerifyEmailPageForDoctor from "../components/Auth/VerifyEmailPageForDoctor";
import AppointmentList from "../Pages/Dashboard/UserDashboard/AppointmentList";
import DashboardDoctorLayout from "../Layout/DashboardDoctorLayout";
import PrescriptionList from "../Pages/Dashboard/UserDashboard/PrescriptionList";
import FollowUpList from "../Pages/Dashboard/UserDashboard/FollowUpList";
import SetAvailabilityForm from "../Pages/Dashboard/DoctorDashboard/SetAvailabilityForm";
import CompletedAppointments from "../Pages/Dashboard/DoctorDashboard/CompletedAppointments";
import PatientHistory from "../Pages/Dashboard/DoctorDashboard/PatientHistory";
import Reviews from "../Pages/Dashboard/DoctorDashboard/Reviews";
import Earnings from "../Pages/Dashboard/DoctorDashboard/Earnings";
import DoctorProfile from "../Pages/Dashboard/DoctorDashboard/DoctorProfile";
import DoctorAppointmentList from "../Pages/Dashboard/DoctorDashboard/DoctorAppointmentList";
import CompleteDoctorProfilePage from "../Pages/Dashboard/DoctorDashboard/CompleteDoctorProfilePage";
import DoctorProtectedRoute from "../components/Auth/DoctorProtectedRoute";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/chat-with-assistant",
        element: <ChatWithAssistant />,
      },
      {
        path: "/find-doctor-by-district",
        element: <FindDoctorByDistrict />,
      },
      {
        path: "/find-doctor-by-hospital",
        element: <FindDoctorByHospital />,
      },
      {
        path: "/find-doctor-by-category",
        element: <FindDoctorByCategory />,
      },
      {
        path: "/doctor/:slug",
        element: <DoctorDetails />,
      },
      {
        path: "/all-doctors",
        element: <AllDoctors />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/about-us",
        element: <AboutUs />,
      },
      {
        path: "/team",
        element: <DevTeam />,
      },
      {
        path: "/article/:id",
        element: <ArticleDetailPage />,
      },
      {
        path: "/doctor/dashboard",
        element: <DoctorDashboard />,
      },
      {
        path: "/book-appointment",
        element: <BookAppointment />,
      },
    ],
  },
  {
    path: "/login",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <UserLogin />,
      },
      {
        path: "doctor",
        element: <DoctorLogin />,
      },
    ],
  },
  {
    path: "/register",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <UserRegister />,
      },
      {
        path: "doctor",
        element: <DoctorRegister />,
      },
    ],
  },
  {
    path: "/dashboard/user",
    element: <DashboardUserLayout />,
    children: [
      {
        index: true,
        element: <UserDashboard />,
      },
      {
        path: "patients",
        element: <PatientList />,
      },
      {
        path: "appointment",
        element: <AppointmentList />,
      },
    ],
  },
  {
    path: "/dashboard/doctor",
    element: (
      <DoctorProtectedRoute>
        <DashboardDoctorLayout />
      </DoctorProtectedRoute>
    ),
    children: [
      { index: true, element: <DoctorDashboard /> },
      { path: "appointment", element: <DoctorAppointmentList /> },
      { path: "prescriptions", element: <PrescriptionList /> },
      { path: "followups", element: <FollowUpList /> },
      { path: "availability", element: <SetAvailabilityForm /> },
      { path: "completed-appointments", element: <CompletedAppointments /> },
      { path: "patient-history", element: <PatientHistory /> },
      { path: "reviews", element: <Reviews /> },
      { path: "earnings", element: <Earnings /> },
      { path: "profile", element: <DoctorProfile /> },
    ],
  },
  {
    path: "/doctor/complete-profile",
    element: <CompleteProfilePage />,
  },
  {
    path: "complete-profile",
    element: <CompleteDoctorProfilePage />,
  },
  {
    path: "/verify-email-for-user",
    element: <VerifyEmailPageForUser />,
  },
  {
    path: "/verify-email-for-doctor",
    element: <VerifyEmailPageForDoctor />,
  },
]);
