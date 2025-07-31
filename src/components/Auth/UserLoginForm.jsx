import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { auth } from "./firebase";
import { ImSpinner9 } from "react-icons/im";

const UserLoginForm = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Firebase login
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("userToken", token);

      // 2. Optionally, fetch user profile from your backend
      const res = await fetch(
        `https://doctors-bd-backend.vercel.app/api/v1/users?email=${form.email}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      localStorage.setItem("userId", data.data._id);

      toast.success("Login successful!");
      navigate("/dashboard/user");
    } catch (err) {
      toast.error(err.message || "Login failed.");
    }
    setLoading(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 text-gray-700 font-medium"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                       transition placeholder-gray-400 bg-gray-50"
          />
        </div>
        <div className="mb-5 relative">
          <label
            htmlFor="password"
            className="block mb-2 text-gray-700 font-medium"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                       transition placeholder-gray-400 bg-gray-50 pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-[48px] right-4 text-gray-600 hover:text-purple-700 focus:outline-none"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold  py-3 rounded-lg transition"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <ImSpinner9 className="animate-spin text-xl" />
            </div>
          ) : (
            "Login as User"
          )}
        </button>
      </form>
    </>
  );
};

export default UserLoginForm;
