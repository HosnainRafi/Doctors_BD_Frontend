import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Home from "../Pages/Home/Home";
import ChatWithAssistant from "../Pages/ChatWithAssistant/ChatWithAssistant";
import FindDoctorByDistrict from "../Pages/FindDoctorByDistrict/FindDoctorByDistrict";
import DoctorDetails from "../Pages/DoctorDetails/DoctorDetails";
import AllDoctors from "../Pages/AllDoctors/AllDoctors";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";

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
        path: "/doctor/:id",
        element: <DoctorDetails />,
      },
      {
        path: "/all-doctors",
        element: <AllDoctors />,
      },
      // {
      //   path: '/contact',
      //   element: <Contact />,
      // },
    ],
  },
]);
