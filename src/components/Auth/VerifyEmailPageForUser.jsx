import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import {
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ImSpinner9 } from "react-icons/im";

const VerifyEmailPageForUser = () => {
  const [checking, setChecking] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // eslint-disable-next-line no-unused-vars
  const [email, setEmail] = useState(
    localStorage.getItem("pendingUserEmail") || ""
  );
  const [password, setPassword] = useState(
    sessionStorage.getItem("pendingUserPassword") || ""
  );

  useEffect(() => {
    if (!email || !password) {
      toast.error("Missing session. Please register again.");
      navigate("/register");
    }
  }, [email, password, navigate]);

  const handleResend = async () => {
    if (!email || !password) {
      toast.error("Missing credentials.");
      return;
    }
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
    }
    setLoading(false);
  };

  const handleCheck = async () => {
    setChecking(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await userCredential.user.reload();

      if (userCredential.user.emailVerified) {
        toast.success("Email verified! You can now login.");

        localStorage.removeItem("pendingUserEmail");
        localStorage.removeItem("pendingUserName");
        sessionStorage.removeItem("pendingUserPassword");

        navigate("/login");
      } else {
        toast.error("Email not verified yet. Please check your inbox.");
      }
    } catch (err) {
      toast.error(err.message || "Failed to check verification.");
    } finally {
      setChecking(false);
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Are you sure you want to reset and re-enter your email and registration info?"
      )
    ) {
      localStorage.removeItem("pendingUserEmail");
      localStorage.removeItem("pendingUserName");
      sessionStorage.removeItem("pendingUserPassword");
      toast("Form cleared. Please re-register.");
      navigate("/register");
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
          placeholder="Enter your password to check verification"
        />
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={handleResend}
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
          disabled={loading}
        >
          {loading ? (
            <ImSpinner9 className="animate-spin text-xl" />
          ) : (
            "Resend Verification Email"
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
          onClick={handleReset}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Change Email or Info
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailPageForUser;
