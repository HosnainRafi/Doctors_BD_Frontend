import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Home from "../Pages/Home/Home";
import ChatWithAssistant from "../Pages/ChatWithAssistant/ChatWithAssistant";
import FindDoctorByDistrict from "../Pages/FindDoctorByDistrict/FindDoctorByDistrict";
import DoctorDetails from "../Pages/DoctorDetails/DoctorDetails";
import AllDoctors from "../Pages/AllDoctors/AllDoctors";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import Contact from "../Pages/Contact/Contact";
import FindDoctorByHospital from "../Pages/FindDoctorByHospital/FindDoctorByHospital";
import FindDoctorByCategory from "../Pages/FindDoctorByCategory/FindDoctorByCategory";
import ArticleDetailPage from "../components/ArticleDetailPage";
import DevTeam from "../Pages/Team/Team";
import AboutUs from "../Pages/AboutUs/AboutUs";
import UserLogin from "../Pages/Login/UserLogin";
import UserRegister from "../Pages/Login/UserRegister";
import DoctorLogin from "../Pages/Login/DoctorLogin";
import DoctorRegister from "../Pages/Login/DoctorRegister";
import UserDashboard from "../Pages/UserDashboard/UserDashboard";
import DoctorDashboard from "../Pages/DoctorDashboard/DoctorDashboard";
import BookAppointment from "../Pages/UserDashboard/BookAppointment";

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
        path: "/login",
        element: <UserLogin />,
      },
      {
        path: "/register",
        element: <UserRegister />,
      },
      {
        path: "/doctor/login",
        element: <DoctorLogin />,
      },
      {
        path: "/doctor/register",
        element: <DoctorRegister />,
      },
      {
        path: "/user/dashboard",
        element: <UserDashboard />,
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
]);
