import { useEffect, useState } from 'react';
import {
  FaUserEdit,
  FaTrash,
  FaCheck,
  FaPlus,
  FaUserShield,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { ImSpinner10 } from 'react-icons/im';
import { getUserIdByEmail } from '../../../utils/getUserIdByEmail';
import axiosCommon from '../../../api/axiosCommon';
import DeleteConfirmModal from '../../../Modal/DeleteConfirmModal';
import UserAddPatientModal from '../../../Modal/UserAddPatientModal';

const UserPatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editPatient, setEditPatient] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [defaultPatientId, setDefaultPatientId] = useState(
    localStorage.getItem('defaultPatientId') || ''
  );
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchUserIdAndPatients = async () => {
      setLoading(true);
      try {
        const id = await getUserIdByEmail();
        setUserId(id);

        const response = await axiosCommon.get('/patients', {
          params: { user_id: id },
        });
        setPatients(response.data.data || []);
      } catch (error) {
        toast.error(error.message || 'Error fetching patients.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserIdAndPatients();
  }, [modalOpen, deleteModalOpen]);

  const openAddModal = () => {
    setEditPatient(null);
    setModalOpen(true);
  };

  const openEditModal = patient => {
    setEditPatient(patient);
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditPatient(null);
    setModalOpen(false);
  };

  const handlePatientSaved = () => {
    closeModal();
  };

  const handleSetDefault = id => {
    setDefaultPatientId(id);
    localStorage.setItem('defaultPatientId', id);
    toast.success('Default patient set!');
  };

  const openDeleteModal = patient => {
    setPatientToDelete(patient);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setPatientToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!patientToDelete) return;
    try {
      await axiosCommon.delete(`/patients/${patientToDelete._id}`);
      toast.success('Patient deleted successfully');
      if (defaultPatientId === patientToDelete._id) {
        setDefaultPatientId('');
        localStorage.removeItem('defaultPatientId');
      }
      closeDeleteModal();
    } catch (error) {
      toast.error(error.message || 'Failed to delete patient');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <FaUserShield className="text-purple-600" /> My Patients
        </h3>
        <button
          onClick={openAddModal}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-lg transition flex items-center gap-2"
        >
          <FaPlus /> Add Patient
        </button>
      </div>

      {loading ? (
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
          {patients.map(patient => (
            <div
              key={patient._id}
              className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow transition"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div className="mb-3 sm:mb-0">
                  <p className="text-lg font-medium text-gray-800">
                    {patient.name}
                  </p>
                  <p className="text-sm text-gray-600">{patient.phone}</p>
                  {patient.email && (
                    <p className="text-sm text-gray-400">{patient.email}</p>
                  )}
                  {defaultPatientId === patient._id && (
                    <span className="inline-block mt-2 px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                      <FaCheck className="inline-block mr-1" />
                      Default
                    </span>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleSetDefault(patient._id)}
                    className={`px-4 py-2 text-sm rounded-lg transition flex items-center gap-2 ${
                      defaultPatientId === patient._id
                        ? 'bg-green-600 text-white cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-green-200'
                    }`}
                    disabled={defaultPatientId === patient._id}
                  >
                    <FaCheck />
                    Set Default
                  </button>
                  <button
                    onClick={() => openEditModal(patient)}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg transition flex items-center gap-2"
                  >
                    <FaUserEdit />
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(patient)}
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

      <UserAddPatientModal
        isOpen={modalOpen}
        onClose={closeModal}
        onPatientSaved={handlePatientSaved}
        userId={userId}
        editPatient={editPatient}
      />

      <DeleteConfirmModal
        title="Confirm Delete"
        subTitle={`Are you sure you want to delete patient "${patientToDelete?.name}"?`}
        buttonActionType="Delete"
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default UserPatientList;
