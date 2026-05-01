import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://team-task-manager-production-41c7.up.railway.app/api/auth/login",
        form
      );

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");

    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-slate-200 flex justify-center items-center px-6">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white/80 backdrop-blur-md p-12 rounded-3xl shadow-2xl border border-white/50"
      >

        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-gray-800 mb-3">
            Welcome Back
          </h1>

          <p className="text-gray-500 text-lg">
            Login to continue to TaskForge
          </p>
        </div>

        {/* Email */}
        <input
          className="border border-gray-300 rounded-2xl px-5 py-4 w-full mb-5 text-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
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
          className="border border-gray-300 rounded-2xl px-5 py-4 w-full mb-6 text-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          placeholder="Enter your password"
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value
            })
          }
        />

        {/* Button */}
        <button className="bg-blue-600 hover:bg-blue-700 text-white w-full py-4 rounded-2xl text-lg font-semibold shadow-md transition duration-300">
          Login
        </button>

        {/* Footer */}
        <p className="mt-6 text-center text-gray-600 text-base">
          No account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-semibold hover:underline"
          >
            Signup
          </Link>
        </p>

      </form>
    </div>
  );
}