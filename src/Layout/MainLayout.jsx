import { Outlet } from "react-router-dom"
import Navbar from "../Shared/Navbar/Navbar"
import Footer from "../Shared/Footer/Footer"
import ChatBot from "../Pages/ChatBot/ChatBot"


const MainLayout = () => {
  return (
    <div>
      <div className="mb-[70px]">
        <Navbar />
      </div>
      <Outlet />
      <Footer />
      <ChatBot />
    </div>
  );
}

export default MainLayout
