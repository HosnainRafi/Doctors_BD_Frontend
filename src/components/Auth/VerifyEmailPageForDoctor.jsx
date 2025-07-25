import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import {
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ImSpinner9 } from "react-icons/im";

const VerifyEmailPageForDoctor = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [email, setEmail] = useState(
    localStorage.getItem("pendingDoctorEmail") || ""
  );
  const [password, setPassword] = useState(
    sessionStorage.getItem("pendingDoctorPassword") || ""
  );
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!email || !password) {
      toast.error("Missing registration session. Please register again.");
      navigate("/register/doctor");
    }
  }, [email, password, navigate]);

  const handleResend = async () => {
    if (!email || !password) return toast.error("Missing credentials.");

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await sendEmailVerification(userCredential.user);
      toast.success("Verification email resent!");
    } catch (err) {
      toast.error(err.message || "Failed to resend verification.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = async () => {
    if (!email || !password) return toast.error("Missing credentials.");

    try {
      setChecking(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await userCredential.user.reload();

      if (!userCredential.user.emailVerified) {
        toast.error("Email not verified yet.");
        return;
      }

      const token = await userCredential.user.getIdToken();

      const payload = {
        name: localStorage.getItem("pendingDoctorName") || "",
        email,
        phone: localStorage.getItem("pendingDoctorPhone") || "",
        bmdc_number: localStorage.getItem("pendingDoctorBMDC") || "",
        specialty: localStorage.getItem("pendingDoctorSpecialty") || "",
        password: password || "firebase",
      };

      const res = await fetch(
        "http://localhost:5000/api/v1/registered-doctors",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Doctor registration complete!");
        localStorage.removeItem("pendingDoctorEmail");
        localStorage.removeItem("pendingDoctorName");
        localStorage.removeItem("pendingDoctorPhone");
        localStorage.removeItem("pendingDoctorBMDC");
        localStorage.removeItem("pendingDoctorSpecialty");
        sessionStorage.removeItem("pendingDoctorPassword");
        navigate("/login/doctor");
      } else {
        toast.error(data.message || "Backend registration failed.");
      }
    } catch (err) {
      toast.error(err.message || "Verification check failed.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-12">
      <h2 className="text-xl font-bold mb-4 text-center">Verify Your Email</h2>
      <p className="mb-4 text-gray-700">
        We have sent a verification link to your email. Please check your inbox
        and click the link to verify your account.
      </p>
      <div className="mb-4">
        <label className="block mb-2 text-gray-700 font-medium">Email</label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-gray-700 font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          placeholder="Enter your password"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleResend}
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
          disabled={loading}
        >
          {loading ? (
            <ImSpinner9 className="animate-spin text-xl" />
          ) : (
            "Resend Email"
          )}
        </button>
        <button
          onClick={handleCheck}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          disabled={checking}
        >
          {checking ? "Checking..." : "I've Verified"}
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("pendingDoctorEmail");
            localStorage.removeItem("pendingDoctorName");
            localStorage.removeItem("pendingDoctorPhone");
            localStorage.removeItem("pendingDoctorBMDC");
            localStorage.removeItem("pendingDoctorSpecialty");
            sessionStorage.removeItem("pendingDoctorPassword");
            toast("Form cleared. Please re-enter details.");
            navigate("/register/doctor");
          }}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Change Email or Info
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailPageForDoctor;
