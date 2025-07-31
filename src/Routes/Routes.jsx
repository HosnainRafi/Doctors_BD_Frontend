import { createBrowserRouter } from 'react-router-dom';
import MainRoutes from './MainRoutes';
import AuthRoutes from './AuthRoutes';
import UserDashboardRoutes from './UserDashboardRoutes';
import DoctorDashboardRoutes from './DoctorDashboardRoutes';
import PaymentRoutes from './PaymentRoutes';

const router = createBrowserRouter([
  MainRoutes,
  PaymentRoutes,
  ...AuthRoutes,
  UserDashboardRoutes,
  DoctorDashboardRoutes,
]);

export default router;
