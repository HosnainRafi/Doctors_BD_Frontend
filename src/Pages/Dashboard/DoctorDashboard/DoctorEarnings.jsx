// src/Pages/Doctor/Earnings.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { formatCurrency } from "../../../utils/formatCurrency"; // Assuming you have this helper

const Earnings = () => {
  const { registered_doctor_id } = useParams();
  const [earnings, setEarnings] = useState(null); // Will hold the raw API response
  const [stats, setStats] = useState({
    // Will hold the calculated stats
    today: 0,
    thisMonth: 0,
    monthlyBreakdown: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("doctorToken"); // Make sure to use the correct token

  useEffect(() => {
    const fetchEarnings = async () => {
      if (!registered_doctor_id || !token) {
        setError("Missing Doctor ID or authentication token.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          `/api/v1/appointments/earnings/${registered_doctor_id}`, // Corrected API endpoint
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEarnings(response.data.data);
      } catch (err) {
        console.error("Error fetching earnings:", err);
        setError(
          "Failed to load earnings data. " +
            (err.response?.data?.message || err.message)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [registered_doctor_id, token]);

  // This useEffect will run after earnings data is fetched to calculate stats
  useEffect(() => {
    if (earnings && earnings.appointments) {
      const today = new Date();
      const todayString = today.toISOString().split("T")[0];
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      let todayEarnings = 0;
      let currentMonthEarnings = 0;
      const monthlyData = {};

      earnings.appointments.forEach((appt) => {
        const apptDate = new Date(appt.date);
        const apptAmount = appt.amount || 0;

        // Calculate Today's Earnings
        if (appt.date === todayString) {
          todayEarnings += apptAmount;
        }

        // Calculate This Month's Earnings
        if (
          apptDate.getMonth() === currentMonth &&
          apptDate.getFullYear() === currentYear
        ) {
          currentMonthEarnings += apptAmount;
        }

        // Aggregate Monthly Breakdown
        const monthKey = `${apptDate.getFullYear()}-${(apptDate.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`; // Format as YYYY-MM
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = 0;
        }
        monthlyData[monthKey] += apptAmount;
      });

      setStats({
        today: todayEarnings,
        thisMonth: currentMonthEarnings,
        monthlyBreakdown: monthlyData,
      });
    }
  }, [earnings]); // Dependency on `earnings`

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading earnings data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-center text-red-700">
        {error}
      </div>
    );
  }

  if (!earnings || earnings.count === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Earnings Overview
        </h1>
        <div className="text-center py-8 text-gray-500">
          No completed appointments found.
        </div>
      </div>
    );
  }

  // Sort monthly breakdown keys in descending order
  const sortedMonths = Object.keys(stats.monthlyBreakdown).sort().reverse();

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Earnings Overview
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500">
          <h3 className="text-gray-500 text-sm font-medium">Total Earnings</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {/* FIX 1: Use `earnings.total` */}
            {formatCurrency(earnings.total)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm font-medium">This Month</h3>
          <p className="text-3xl font-bold text-green-600">
            {/* FIX 2: Use calculated stats */}
            {formatCurrency(stats.thisMonth)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm font-medium">Today</h3>
          <p className="text-3xl font-bold text-blue-600">
            {/* FIX 3: Use calculated stats */}
            {formatCurrency(stats.today)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h3 className="text-gray-500 text-sm font-medium">
            Completed Appointments
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {/* FIX 4: Use `earnings.count` */}
            {earnings.count}
          </p>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Monthly Breakdown
        </h2>
        <div className="space-y-4">
          {/* FIX 5: Use calculated and sorted stats */}
          {sortedMonths.length > 0 ? (
            sortedMonths.map((month) => {
              const [year, monthNum] = month.split("-");
              const monthName = new Date(
                parseInt(year),
                parseInt(monthNum) - 1
              ).toLocaleString("default", { month: "long", year: "numeric" });

              return (
                <div
                  key={month}
                  className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-gray-700">{monthName}</span>
                  <span className="font-medium">
                    {formatCurrency(stats.monthlyBreakdown[month])}
                  </span>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No monthly data available.</p>
          )}
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Completed Appointments History
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fee
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* This part was already correct */}
              {earnings.appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {appointment.patient_id?.name || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(appointment.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      {formatCurrency(appointment.amount)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
