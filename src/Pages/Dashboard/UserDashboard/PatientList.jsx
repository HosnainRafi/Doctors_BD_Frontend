import React, { useEffect, useState } from "react";
import AddPatientForm from "./AddPatientForm";
import {
  FaUserEdit,
  FaTrash,
  FaCheck,
  FaPlus,
  FaUserShield,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { ImSpinner10 } from "react-icons/im";

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editPatient, setEditPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [defaultPatientId, setDefaultPatientId] = useState(
    localStorage.getItem("defaultPatientId") || ""
  );
  const [userId, setUserId] = useState("");

  const token = localStorage.getItem("userToken");
  const email = token ? JSON.parse(atob(token.split(".")[1])).email : null;

  // 1. On mount, get userId by email
  useEffect(() => {
    const fetchUserId = async () => {
      if (!email) return;
      setLoading(true);
      try {
        const res = await fetch(
          `https://doctors-bd-backend.vercel.app/api/v1/users?email=${encodeURIComponent(
            email
          )}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        console.log(data);
        if (data && data.data && data.data._id) {
          setUserId(data.data._id);
        } else {
          toast.error("User not found for this email.");
        }
      } catch (err) {
        toast.error("Error fetching user info.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserId();
  }, [email, token]);
  console.log(userId);
  // 2. When userId is set, fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      if (!userId) {
        setPatients([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `https://doctors-bd-backend.vercel.app/api/v1/patients?user_id=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setPatients(data.data || []);
      } catch (error) {
        toast.error("Error fetching patients.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, [showAdd, editPatient, userId, token]);

  const handleSetDefault = (id) => {
    setDefaultPatientId(id);
    localStorage.setItem("defaultPatientId", id);
    toast.success("✅ Default patient set!");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?"))
      return;

    try {
      await fetch(
        `https://doctors-bd-backend.vercel.app/api/v1/patients/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPatients((prev) => prev.filter((p) => p._id !== id));
      if (defaultPatientId === id) {
        setDefaultPatientId("");
        localStorage.removeItem("defaultPatientId");
      }
      toast.success("🗑️ Patient deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete patient");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <FaUserShield className="text-purple-600" /> My Patients
        </h3>
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-lg transition flex items-center gap-2"
          onClick={() => {
            setShowAdd((v) => !v);
            setEditPatient(null);
          }}
        >
          {showAdd ? (
            "Close"
          ) : (
            <>
              <FaPlus /> Add Patient
            </>
          )}
        </button>
      </div>

      {showAdd && (
        <div className="mb-4">
          <AddPatientForm
            onPatientAdded={() => setShowAdd(false)}
            userId={userId}
          />
        </div>
      )}
      {editPatient && (
        <div className="mb-4">
          <AddPatientForm
            editPatient={editPatient}
            onPatientAdded={() => setEditPatient(null)}
            userId={userId}
          />
        </div>
      )}

      {loading && patients.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <ImSpinner10 size={40} className="animate-spin text-purple-600" />
        </div>
      ) : (
        <div className="space-y-4">
          {patients.length === 0 && userId && (
            <div className="text-gray-400">
              No patients found for this user.
            </div>
          )}
          {patients.map((p) => (
            <div
              key={p._id}
              className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow transition"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div className="mb-3 sm:mb-0">
                  <p className="text-lg font-medium text-gray-800">{p.name}</p>
                  <p className="text-sm text-gray-600">{p.phone}</p>
                  {p.email && (
                    <p className="text-sm text-gray-400">{p.email}</p>
                  )}
                  {defaultPatientId === p._id && (
                    <span className="inline-block mt-2 px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                      <FaCheck className="inline-block mr-1" />
                      Default
                    </span>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleSetDefault(p._id)}
                    className={`px-4 py-2 text-sm rounded-lg transition flex items-center gap-2 ${
                      defaultPatientId === p._id
                        ? "bg-green-600 text-white cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-green-200"
                    }`}
                    disabled={defaultPatientId === p._id}
                  >
                    <FaCheck />
                    Set Default
                  </button>
                  <button
                    onClick={() => setEditPatient(p)}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg transition flex items-center gap-2"
                  >
                    <FaUserEdit />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition flex items-center gap-2"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientList;
