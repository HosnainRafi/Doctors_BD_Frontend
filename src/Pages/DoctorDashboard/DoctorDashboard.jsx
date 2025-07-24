import React from "react";
import AppointmentList from "./AppointmentList";
import PrescriptionList from "./PrescriptionList";
import FollowUpList from "./FollowUpList";
import SetAvailabilityForm from "./SetAvailabilityForm";
import DoctorProfile from "./DoctorProfile";

const DoctorDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-8">
      <div className="max-w-5xl mx-auto p-4">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Doctor Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <AppointmentList />
            <SetAvailabilityForm />
          </div>
          <div>
            <PrescriptionList />
            <FollowUpList />
            <DoctorProfile />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
