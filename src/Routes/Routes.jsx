import { createBrowserRouter } from 'react-router-dom';
import MainRoutes from './MainRoutes';
import AuthRoutes from './AuthRoutes';
import UserDashboardRoutes from './UserDashboardRoutes';
import DoctorDashboardRoutes from './DoctorDashboardRoutes';

const router = createBrowserRouter([
  MainRoutes,
  ...AuthRoutes,
  UserDashboardRoutes,
  DoctorDashboardRoutes,
]);

export default router;
