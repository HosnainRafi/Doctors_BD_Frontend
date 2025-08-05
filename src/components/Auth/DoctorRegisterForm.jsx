import React, { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { auth } from "./firebase";
import { ImSpinner9 } from "react-icons/im";

const DoctorRegisterForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    bmdc_number: "",
    specialty: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const pendingEmail = localStorage.getItem("pendingDoctorEmail");
    if (pendingEmail) {
      navigate("/verify-email-for-doctor");
    }
  }, [navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const methods = await fetchSignInMethodsForEmail(auth, form.email);
      if (methods.length > 0) {
        toast.error("Email already exists. Please login or use another email.");
        setLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      await updateProfile(userCredential.user, {
        displayName: form.name,
      });

      await sendEmailVerification(userCredential.user);

      toast.success(
        "Verification email sent. Please check your inbox and verify."
      );

      // Save to localStorage + password to sessionStorage
      localStorage.setItem("pendingDoctorEmail", form.email);
      localStorage.setItem("pendingDoctorName", form.name);
      localStorage.setItem("pendingDoctorPhone", form.phone);
      localStorage.setItem("pendingDoctorBMDC", form.bmdc_number);
      localStorage.setItem("pendingDoctorSpecialty", form.specialty);
      sessionStorage.setItem("pendingDoctorPassword", form.password);

      navigate("/verify-email-for-doctor");
    } catch (err) {
      toast.error(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      {/* <h2 className="text-xl font-bold mb-4">Doctor Registration</h2> */}
      {["name", "email", "phone", "password", "bmdc_number", "specialty"].map(
        (field) => (
          <input
            key={field}
            type={field === "password" ? "password" : "text"}
            name={field}
            placeholder={field.replace("_", " ").toUpperCase()}
            value={form[field]}
            onChange={handleChange}
            required={field !== "bmdc_number" && field !== "specialty"}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
          />
        )
      )}
      <button
        type="submit"
        className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <ImSpinner9 className="animate-spin text-xl" />
          </div>
        ) : (
          "Register as Doctor"
        )}
      </button>
    </form>
  );
};

export default DoctorRegisterForm;
