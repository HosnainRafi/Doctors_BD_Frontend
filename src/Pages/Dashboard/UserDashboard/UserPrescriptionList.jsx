import { useEffect, useState } from "react";
import { ImSpinner9 } from "react-icons/im";
import axiosCommon from "../../../api/axiosCommon";
import { getUserIdByEmail } from "../../../utils/getUserIdByEmail";
import toast from "react-hot-toast";
import { getAuthToken } from "../../../utils/getAuthToken";
import PrescriptionModal from "../../../Modal/PrescriptionModal";
import NoDataFound from "./components/NoDataFound";

const UserPrescriptionList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = getAuthToken();

  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoading(true);
      try {
        const id = await getUserIdByEmail();
        const res = await axiosCommon.get(`/prescriptions`, {
          params: { user_id: id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPrescriptions(res.data.data || []);
      } catch (error) {
        toast.error(error.message || "Failed to fetch prescriptions");
        setPrescriptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, [token]);

  return (
    <div className="mb-16 mt-4 px-4 max-w-6xl mx-auto">
      <h3 className="text-3xl font-bold text-purple-700 mb-8 text-center">
        Your Prescriptions
      </h3>

      {loading && prescriptions.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <ImSpinner9 size={40} className="animate-spin text-purple-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prescriptions.length === 0 ? (
            <NoDataFound message="No prescriptions found." />
          ) : (
            prescriptions.map((p) => (
              <div
                key={p._id}
                className="border border-purple-700 p-4 rounded-xl shadow-md bg-white space-y-3"
              >
                <h2 className="text-xl font-bold text-center text-purple-800 mb-3">
                  Prescription Details
                </h2>
                <hr className="border-t border-purple-400" />

                <div className="text-sm text-gray-700 border border-purple-300 rounded-md p-3 space-y-2 shadow-sm">
                  <div>
                    <span className="font-semibold">Date:</span>{" "}
                    {new Date(p.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <div>
                    <span className="font-semibold">Time:</span>{" "}
                    {new Date(
                      `1970-01-01T${p.appointment_id?.time}`
                    ).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
                  {p.follow_up_date && (
                    <div>
                      <span className="font-semibold">Follow-up Date:</span>{" "}
                      {new Date(p.follow_up_date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  )}
                </div>

                <div className="text-sm text-gray-700 border border-purple-300 rounded-md p-3 shadow-sm">
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    Patient
                  </h3>
                  <div>{p.patient_id?.name || "Unknown Patient"}</div>
                </div>

                <div className="text-sm text-gray-700 border border-purple-300 rounded-md p-3 shadow-sm">
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    Doctor
                  </h3>
                  <div>{p.registered_doctor_id?.name || "Unknown Doctor"}</div>
                </div>

                <hr className="border-t border-purple-400 mt-6" />

                <div className="flex justify-center gap-3 mt-4">
                  <button
                    onClick={() => setSelected(p)}
                    className="px-5 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
                  >
                    View Details
                  </button>
                  <a
                    href={`https://doctors-bd-backend.vercel.app/api/v1/prescriptions/${p._id}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 bg-purple-700 text-white text-sm rounded-md hover:bg-purple-800 transition"
                  >
                    Download PDF
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selected && (
        <PrescriptionModal selected={selected} setSelected={setSelected} />
      )}
    </div>
  );
};

export default UserPrescriptionList;
