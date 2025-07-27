import React, { useState } from "react";
import PrescriptionList from "./PrescriptionList";
import FollowUpList from "./FollowUpList";
import SetAvailabilityForm from "./SetAvailabilityForm";
import DoctorProfile from "./DoctorProfile";
import Reviews from "./Reviews";
import PrescriptionForm from "./PrescriptionForm";
import Earnings from "./Earnings";
import PatientHistory from "./PatientHistory";
import CompletedAppointments from "./CompletedAppointments";
import AppointmentList from "../UserDashboard/AppointmentList";
import DoctorAppointmentList from "./DoctorAppointmentList";

const TABS = [
  { key: "appointments", label: "Appointments" },
  { key: "prescriptions", label: "Prescriptions" },
  { key: "followups", label: "Follow-Ups" },
  { key: "completedAppointmens", label: "Completed-Appointments" },
  { key: "availability", label: "Availability" },
  { key: "profile", label: "Profile" },
  { key: "reviews", label: "Reviews" },
  { key: "patientHistory", label: "Patient History" },
  { key: "earnings", label: "Earnings" },
];

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState("appointments");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-8">
      <div className="max-w-5xl mx-auto p-4">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Doctor Dashboard
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
          {activeTab === "appointments" && (
            <>
              <DoctorAppointmentList
                onCreatePrescription={setSelectedAppointment}
              />
              {selectedAppointment && (
                <PrescriptionForm
                  appointment={selectedAppointment}
                  onClose={() => setSelectedAppointment(null)}
                  onCreated={() => setSelectedAppointment(null)}
                />
              )}
            </>
          )}
          {activeTab === "prescriptions" && <PrescriptionList />}
          {activeTab === "followups" && <FollowUpList />}
          {activeTab === "availability" && <SetAvailabilityForm />}
          {activeTab === "completedAppointmens" && <CompletedAppointments />}
          {activeTab === "profile" && <DoctorProfile />}
          {activeTab === "reviews" && <Reviews />}
          {activeTab === "patientHistory" && <PatientHistory />}
          {activeTab === "earnings" && <Earnings />}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
