import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white px-8 py-4 shadow-lg backdrop-blur-md border-b border-white/10">

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        {/* Logo */}
        <h1 className="font-extrabold text-2xl tracking-wide cursor-pointer hover:scale-105 transition">
          TaskForge
        </h1>

        {/* Nav Links */}
        <div className="flex flex-wrap items-center gap-3 md:gap-4">

          <Link
            to="/dashboard"
            className="px-4 py-2 rounded-xl hover:bg-white/15 transition font-medium"
          >
            Dashboard
          </Link>

          <Link
            to="/projects"
            className="px-4 py-2 rounded-xl hover:bg-white/15 transition font-medium"
          >
            Projects
          </Link>

          <Link
            to="/tasks"
            className="px-4 py-2 rounded-xl hover:bg-white/15 transition font-medium"
          >
            Tasks
          </Link>

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl font-semibold shadow-md transition duration-300"
          >
            Logout
          </button>

        </div>
      </div>
    </div>
  );
}