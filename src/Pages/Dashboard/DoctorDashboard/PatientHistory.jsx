import React, { useEffect, useState } from 'react';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { FaUser } from 'react-icons/fa';
import { FiDownload } from 'react-icons/fi';

const PatientHistory = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatientIndex, setSelectedPatientIndex] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  const doctorToken = localStorage.getItem('doctorToken');
  const doctorId = localStorage.getItem('doctorId');

  useEffect(() => {
    if (!doctorId) return;

    fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/appointments/registered-doctor/${doctorId}`,
      {
        headers: { Authorization: `Bearer ${doctorToken}` },
      }
    )
      .then(res => res.json())
      .then(data => {
        const uniquePatients = {};
        (data.data || []).forEach(a => {
          if (a.patient_id && a.patient_id._id) {
            uniquePatients[a.patient_id._id] = a.patient_id;
          }
        });
        const patientArray = Object.values(uniquePatients);
        setPatients(patientArray);
        if (patientArray.length > 0) {
          fetchPatientHistory(patientArray[0]);
        }
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId, doctorToken]);

  const fetchPatientHistory = patient => {
    if (!patient) return;

    fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/appointments?patient_id=${patient._id}`,
      {
        headers: { Authorization: `Bearer ${doctorToken}` },
      }
    )
      .then(res => res.json())
      .then(data => setAppointments(data.data || []));

    fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/prescriptions?patient_id=${patient._id}`,
      {
        headers: { Authorization: `Bearer ${doctorToken}` },
      }
    )
      .then(res => res.json())
      .then(data => setPrescriptions(data.data || []));
  };

  const handleTabSelect = index => {
    setSelectedPatientIndex(index);
    fetchPatientHistory(patients[index]);
  };

  const formatDateTime = (dateStr, timeStr = '') => {
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = date.toLocaleDateString(undefined, options);
    const formattedTime = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${formattedDate} ${timeStr || formattedTime}`;
  };

  return (
    <div className="max-w-6xl mx-auto mb-10 md:px-4">
      <h3 className="text-2xl font-bold text-purple-800 mb-6 text-center sm:text-left">
        Patient History
      </h3>

      {patients.length === 0 ? (
        <span className="text-gray-500 text-sm">No patients found.</span>
      ) : (
        <Tabs selectedIndex={selectedPatientIndex} onSelect={handleTabSelect}>
          <TabList className="flex gap-2 overflow-x-auto mb-6 border-b pb-2">
            {patients.map(p => (
              <Tab
                key={p._id}
                className="cursor-pointer px-3 py-2 text-xs sm:text-sm rounded-t-md flex items-center gap-2 bg-gray-100 hover:bg-purple-500 hover:text-white text-gray-700 border border-gray-200 shadow-sm min-w-max"
                selectedClassName="bg-purple-700 text-white focus:outline-none"
              >
                <FaUser />
                {p.name}
              </Tab>
            ))}
          </TabList>

          {patients.map(patient => (
            <TabPanel key={patient._id}>
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8 border border-gray-200">
                <h4 className="text-lg sm:text-xl font-semibold text-purple-700 mb-5">
                  {patient.name}'s Records
                </h4>

                <div className="mb-6">
                  <h5 className="font-semibold text-blue-700 mb-3">
                    Appointments
                  </h5>
                  {appointments.length === 0 ? (
                    <p className="text-gray-400 text-sm">
                      No appointments found.
                    </p>
                  ) : (
                    <div className="space-y-5">
                      {appointments.map(a => (
                        <div
                          key={a._id}
                          className="bg-white border border-gray-200 shadow rounded-xl p-4 sm:p-5 transition-all hover:shadow-md"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                            <h3 className="text-base sm:text-lg font-semibold text-purple-700">
                              {a?.patient_id?.name}
                            </h3>
                            <span
                              className={`text-xs font-semibold px-2 py-1 mt-2 sm:mt-0 rounded-full capitalize ${
                                a.status === 'completed'
                                  ? 'bg-green-100 text-green-700'
                                  : a.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {a.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-700 mb-3">
                            <div>
                              <span className="font-medium text-gray-500">
                                Age:
                              </span>{' '}
                              {a?.patient_id?.age}
                            </div>
                            <div>
                              <span className="font-medium text-gray-500">
                                Gender:
                              </span>{' '}
                              {a?.patient_id?.gender}
                            </div>
                            <div>
                              <span className="font-medium text-gray-500">
                                Reason:
                              </span>{' '}
                              {a?.patient_id?.reason}
                            </div>
                            <div>
                              <span className="font-medium text-gray-500">
                                Weight:
                              </span>{' '}
                              {a?.patient_id?.weight} kg
                            </div>
                            <div className="sm:col-span-2">
                              <span className="font-medium text-gray-500">
                                Address:
                              </span>{' '}
                              {a?.patient_id?.address}
                            </div>
                          </div>

                          <div className="text-sm text-gray-600 border-t pt-3">
                            <span className="text-purple-600 font-medium">
                              {formatDateTime(a.date, a.time)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h5 className="font-semibold text-green-700 mb-3">
                    Prescriptions
                  </h5>
                  {prescriptions.length === 0 ? (
                    <p className="text-gray-400 text-sm">
                      No prescriptions found.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {prescriptions.map(p => (
                        <li
                          key={p._id}
                          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-gray-50 px-4 py-3 rounded-md border border-gray-100 shadow-sm"
                        >
                          <span className="text-sm text-gray-700">
                            {formatDateTime(p.date)}
                          </span>
                          <a
                            href={`https://doctors-bd-backend.vercel.app/api/v1/prescriptions/${p._id}/pdf`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-md text-xs"
                          >
                            <FiDownload /> Download
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </TabPanel>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default PatientHistory;
