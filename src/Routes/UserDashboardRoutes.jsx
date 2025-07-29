
import UserDashboard from '../Pages/Dashboard/UserDashboard/UserDashboard';
import UserProfile from '../Pages/Dashboard/UserDashboard/UserProfile';
import UserPatientList from '../Pages/Dashboard/UserDashboard/UserPatientList';
import UserAppointmentList from '../Pages/Dashboard/UserDashboard/UserAppointmentList';
import UserDashboardLayout from '../Layout/UserDashboardLayout';
import UserBookAppointment from '../Pages/Dashboard/UserDashboard/UserBookAppointment';
import UserPrescriptionList from '../Pages/Dashboard/UserDashboard/UserPrescriptionList';
import UserFollowUpList from '../Pages/Dashboard/UserDashboard/UserFollowUpList';
import UserNotificationList from '../Pages/Dashboard/UserDashboard/UserNotificationList';
import UserReviewToDoctor from '../Pages/Dashboard/UserDashboard/UserReviewToDoctor';

const UserDashboardRoutes = {
  path: '/dashboard/user',
  element: <UserDashboardLayout />,
  children: [
    { index: true, element: <UserDashboard /> },
    { path: 'patients', element: <UserPatientList /> },
    { path: 'appointment', element: <UserAppointmentList /> },
    { path: 'book-appointment', element: <UserBookAppointment /> },
    { path: 'prescriptions', element: <UserPrescriptionList /> },
    { path: 'followups', element: <UserFollowUpList /> },
    { path: 'notifications', element: <UserNotificationList /> },
    { path: 'reviews', element: <UserReviewToDoctor /> },
    { path: 'profile', element: <UserProfile /> },
  ],
};

export default UserDashboardRoutes;
