import DoctorDashboard from '../Pages/Dashboard/DoctorDashboard/DoctorDashboard';
import DoctorAppointmentList from '../Pages/Dashboard/DoctorDashboard/DoctorAppointmentList';
import DoctorPrescriptionList from '../Pages/Dashboard/DoctorDashboard/DoctorPrescriptionList';
import DoctorFollowUpList from '../Pages/Dashboard/DoctorDashboard/DoctorFollowUpList';
import DoctorProfile from '../Pages/Dashboard/DoctorDashboard/DoctorProfile';
import DoctorProtectedRoute from '../components/Auth/DoctorProtectedRoute';
import DoctorDashboardLayout from '../Layout/DoctorDashboardLayout';
import DoctorAvailability from '../Pages/Dashboard/DoctorDashboard/DoctorAvailability';
import DoctorCompletedAppointments from '../Pages/Dashboard/DoctorDashboard/DoctorCompletedAppointments';
import DoctorPatientHistory from '../Pages/Dashboard/DoctorDashboard/DoctorPatientHistory';
import DoctorReviewsToPatients from '../Pages/Dashboard/DoctorDashboard/DoctorReviewsToPatients';
import DoctorEarnings from '../Pages/Dashboard/DoctorDashboard/DoctorEarnings';

const DoctorDashboardRoutes = {
  path: '/dashboard/doctor',
  element: (
    <DoctorProtectedRoute>
      <DoctorDashboardLayout />
    </DoctorProtectedRoute>
  ),
  children: [
    { index: true, element: <DoctorDashboard /> },
    { path: 'appointment', element: <DoctorAppointmentList /> },
    { path: 'prescriptions', element: <DoctorPrescriptionList /> },
    { path: 'followups', element: <DoctorFollowUpList /> },
    { path: 'availability', element: <DoctorAvailability /> },
    {
      path: 'completed-appointments',
      element: <DoctorCompletedAppointments />,
    },
    { path: 'patient-history', element: <DoctorPatientHistory /> },
    { path: 'reviews', element: <DoctorReviewsToPatients /> },
    { path: 'earnings', element: <DoctorEarnings /> },
    { path: 'profile', element: <DoctorProfile /> },
  ],
};

export default DoctorDashboardRoutes;
