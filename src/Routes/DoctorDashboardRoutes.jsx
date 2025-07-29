import DashboardDoctorLayout from '../Layout/DashboardDoctorLayout';
import DoctorDashboard from '../Pages/Dashboard/DoctorDashboard/DoctorDashboard';
import DoctorAppointmentList from '../Pages/Dashboard/DoctorDashboard/DoctorAppointmentList';
import DoctorPrescriptionList from '../Pages/Dashboard/DoctorDashboard/DoctorPrescriptionList';
import DoctorFollowUpList from '../Pages/Dashboard/DoctorDashboard/DoctorFollowUpList';
import SetAvailabilityForm from '../Pages/Dashboard/DoctorDashboard/SetAvailabilityForm';
import CompletedAppointments from '../Pages/Dashboard/DoctorDashboard/CompletedAppointments';
import PatientHistory from '../Pages/Dashboard/DoctorDashboard/PatientHistory';
import Reviews from '../Pages/Dashboard/DoctorDashboard/Reviews';
import Earnings from '../Pages/Dashboard/DoctorDashboard/Earnings';
import DoctorProfile from '../Pages/Dashboard/DoctorDashboard/DoctorProfile';
import DoctorProtectedRoute from '../components/Auth/DoctorProtectedRoute';

const DoctorDashboardRoutes = {
  path: '/dashboard/doctor',
  element: (
    <DoctorProtectedRoute>
      <DashboardDoctorLayout />
    </DoctorProtectedRoute>
  ),
  children: [
    { index: true, element: <DoctorDashboard /> },
    { path: 'appointment', element: <DoctorAppointmentList /> },
    { path: 'prescriptions', element: <DoctorPrescriptionList /> },
    { path: 'followups', element: <DoctorFollowUpList /> },
    { path: 'availability', element: <SetAvailabilityForm /> },
    { path: 'completed-appointments', element: <CompletedAppointments /> },
    { path: 'patient-history', element: <PatientHistory /> },
    { path: 'reviews', element: <Reviews /> },
    { path: 'earnings', element: <Earnings /> },
    { path: 'profile', element: <DoctorProfile /> },
  ],
};

export default DoctorDashboardRoutes;
