import React, { useState } from "react";
import PatientList from "./PatientList";
import AppointmentList from "./AppointmentList";
import PrescriptionList from "./PrescriptionList";
import FollowUpList from "./FollowUpList";
import UserProfile from "./UserProfile";
import NotificationList from "./NotificationList"; // <-- Add this if you have it
import ReviewForm from "./reviewForm";

const TABS = [
  { key: "patients", label: "Patients" },
  { key: "appointments", label: "Appointments" },
  { key: "prescriptions", label: "Prescriptions" },
  { key: "followups", label: "Follow-Ups" },
  { key: "notifications", label: "Notifications" },
  { key: "reviews", label: "Reviews" },
  { key: "profile", label: "Profile" },
];

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("patients");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 py-8">
      <div className="max-w-5xl mx-auto p-4">
        <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">
          User Dashboard
        </h2>
        <div className="flex space-x-4 mb-6 justify-center">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded ${
                activeTab === tab.key
                  ? "bg-purple-700 text-white"
                  : "bg-white text-purple-700 border border-purple-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div>
          {activeTab === "patients" && <PatientList />}
          {activeTab === "appointments" && <AppointmentList />}
          {activeTab === "prescriptions" && <PrescriptionList />}
          {activeTab === "followups" && <FollowUpList />}
          {activeTab === "notifications" && <NotificationList />}
          {activeTab === "reviews" && <ReviewForm />}
          {activeTab === "profile" && <UserProfile />}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
