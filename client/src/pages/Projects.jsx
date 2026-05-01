import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function Projects() {
  const token = localStorage.getItem("token");

  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    deadline: "",
    members: []
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchUser();
    fetchProjects();
    fetchMembers();
  }, []);

  const fetchUser = async () => {
    const res = await axios.get(
      "https://team-task-manager-production-41c7.up.railway.app/api/auth/me",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setUser(res.data);
  };

  const fetchProjects = async () => {
    const res = await axios.get(
      "https://team-task-manager-production-41c7.up.railway.app/api/projects",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setProjects(res.data);
  };

  const fetchMembers = async () => {
  const res = await axios.get(
    "https://team-task-manager-production-41c7.up.railway.app/api/users/members",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  setMembers(res.data);
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await axios.put(
        `https://team-task-manager-production-41c7.up.railway.app/api/projects/${editingId}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert("Project Updated");
    } else {
      await axios.post(
        "https://team-task-manager-production-41c7.up.railway.app/api/projects",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert("Project Created");
    }

    setForm({
      name: "",
      description: "",
      deadline: "",
      members: []
    });

    setEditingId(null);
    fetchProjects();
  };

  const deleteProject = async (id) => {
    const confirmDelete = window.confirm("Delete this project?");
    if (!confirmDelete) return;

    await axios.delete(
      `https://team-task-manager-production-41c7.up.railway.app/api/projects/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    fetchProjects();
  };

  const editProject = (project) => {
    setEditingId(project._id);

    setForm({
      name: project.name,
      description: project.description,
      deadline: project.deadline?.split("T")[0],
      members: project.members.map((m) => m._id)
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleMembers = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );

    setForm({
      ...form,
      members: values
    });
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-8">

        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Projects
        </h1>

        {/* ADMIN FORM */}
        {user?.role === "admin" && (
          <form
            onSubmit={handleSubmit}
            className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg mb-10 border border-gray-200"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-700">
              {editingId ? "Edit Project" : "Create Project"}
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                className="border border-gray-300 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Project Name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value
                  })
                }
              />

              <input
                type="date"
                className="border border-gray-300 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.deadline}
                onChange={(e) =>
                  setForm({
                    ...form,
                    deadline: e.target.value
                  })
                }
              />
            </div>

            <textarea
              rows="4"
              className="border border-gray-300 rounded-xl px-4 py-3 w-full mt-4 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value
                })
              }
            />

            <select
              multiple
              className="border border-gray-300 rounded-xl px-4 py-3 w-full h-36 mt-4 focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={handleMembers}
            >
              {members.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name}
                </option>
              ))}
            </select>

            <button className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition">
              {editingId ? "Update Project" : "Create Project"}
            </button>
          </form>
        )}

        {/* PROJECT CARDS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-800">
                {project.name}
              </h2>

              <p className="mt-3 text-gray-600 leading-relaxed">
                {project.description}
              </p>

              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <span className="font-semibold text-gray-700">
                    Deadline:
                  </span>{" "}
                  {new Date(project.deadline).toLocaleDateString()}
                </p>

                <p>
                  <span className="font-semibold text-gray-700">
                    Members:
                  </span>{" "}
                  {project.members
                    ?.map((m) => m.name)
                    .join(", ")}
                </p>
              </div>

              {user?.role === "admin" && (
                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => editProject(project)}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-xl transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteProject(project._id)
                    }
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl transition"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </>
  );
}