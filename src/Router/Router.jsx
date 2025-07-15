import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Home from "../Pages/Home/Home";
import ChatWithAssistant from "../Pages/ChatWithAssistant/ChatWithAssistant";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <h4>Error Page</h4>,
    children: [
      {
        path: '/',
        element:<Home/>
      },
      {
        path: '/chat-with-assistant',
        element:<ChatWithAssistant/>
      }
    ]
  },
]);
