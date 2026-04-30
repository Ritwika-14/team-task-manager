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
        "http://localhost:5000/api/auth/signup",
        form
      );

      navigate("/");

    } catch (error) {
  console.log(error.response?.data);
  alert(error.response?.data?.message || "Signup failed");
}
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow w-96"
      >
        <h1 className="text-2xl font-bold mb-5">Signup</h1>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Name"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          className="border p-2 w-full mb-3"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <select
          className="border p-2 w-full mb-3"
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>

        <button className="bg-green-600 text-white w-full p-2 rounded">
          Signup
        </button>

        <p className="mt-4 text-sm">
          Already have account?{" "}
          <Link to="/" className="text-blue-600">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}