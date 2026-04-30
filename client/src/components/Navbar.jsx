import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="bg-blue-700 text-white px-8 py-4 flex justify-between">
      <h1 className="font-bold text-xl">TaskForge</h1>

      <div className="space-x-4">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/tasks">Tasks</Link>
        <button
          onClick={logout}
          className="bg-red-500 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}