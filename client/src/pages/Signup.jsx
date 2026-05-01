import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "https://team-task-manager-production-41c7.up.railway.app/api/auth/signup",
        form
      );

      navigate("/");

    } catch (error) {
      console.log(error.response?.data);
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-100 to-slate-200 flex justify-center items-center px-6">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white/80 backdrop-blur-md p-12 rounded-3xl shadow-2xl border border-white/50"
      >

        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-gray-800 mb-3">
            Create Account
          </h1>

          <p className="text-gray-500 text-lg">
            Join TaskForge and manage work smarter
          </p>
        </div>

        {/* Name */}
        <input
          className="border border-gray-300 rounded-2xl px-5 py-4 w-full mb-5 text-lg focus:ring-2 focus:ring-green-500 outline-none transition"
          placeholder="Enter your name"
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value
            })
          }
        />

        {/* Email */}
        <input
          className="border border-gray-300 rounded-2xl px-5 py-4 w-full mb-5 text-lg focus:ring-2 focus:ring-green-500 outline-none transition"
          placeholder="Enter your email"
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value
            })
          }
        />

        {/* Password */}
        <input
          type="password"
          className="border border-gray-300 rounded-2xl px-5 py-4 w-full mb-5 text-lg focus:ring-2 focus:ring-green-500 outline-none transition"
          placeholder="Create password"
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value
            })
          }
        />

        {/* Role */}
        <select
          className="border border-gray-300 rounded-2xl px-5 py-4 w-full mb-6 text-lg focus:ring-2 focus:ring-green-500 outline-none transition bg-white"
          onChange={(e) =>
            setForm({
              ...form,
              role: e.target.value
            })
          }
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>

        {/* Button */}
        <button className="bg-green-600 hover:bg-green-700 text-white w-full py-4 rounded-2xl text-lg font-semibold shadow-md transition duration-300">
          Signup
        </button>

        {/* Footer */}
        <p className="mt-6 text-center text-gray-600 text-base">
          Already have account?{" "}
          <Link
            to="/"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

      </form>
    </div>
  );
}