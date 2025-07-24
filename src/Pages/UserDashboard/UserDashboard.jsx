import React from "react";
import PatientList from "./PatientList";
import AppointmentList from "./AppointmentList";
import PrescriptionList from "./PrescriptionList";
import FollowUpList from "./FollowUpList";
import UserProfile from "./UserProfile";

const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 py-8">
      <div className="max-w-5xl mx-auto p-4">
        <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">
          User Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <PatientList />
            <AppointmentList />
          </div>
          <div>
            <PrescriptionList />
            <FollowUpList />
            <UserProfile />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
