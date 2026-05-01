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

  // Logged User
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

  // Projects
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

  // Collect Members
  const fetchMembers = async () => {
    const res = await axios.get(
      "https://team-task-manager-production-41c7.up.railway.app/api/projects",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    let all = [];

    res.data.forEach((p) => {
      if (p.members) {
        all.push(...p.members);
      }
    });

    const unique = Array.from(
      new Map(
        all.map((m) => [m._id, m])
      ).values()
    );

    setMembers(unique);
  };

  // Create or Update
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

  // Delete
  const deleteProject = async (id) => {
    const confirmDelete =
      window.confirm(
        "Delete this project?"
      );

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

  // Edit
  const editProject = (project) => {
    setEditingId(project._id);

    setForm({
      name: project.name,
      description:
        project.description,
      deadline:
        project.deadline
          ?.split("T")[0],
      members:
        project.members.map(
          (m) => m._id
        )
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Multi Select
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

      <div className="p-8">

        <h1 className="text-3xl font-bold mb-6">
          Projects
        </h1>

        {/* ADMIN FORM */}
        {user?.role === "admin" && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow mb-8"
          >
            <h2 className="text-xl font-bold mb-4">
              {editingId
                ? "Edit Project"
                : "Create Project"}
            </h2>

            <input
              className="border p-2 w-full mb-3"
              placeholder="Project Name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name:
                    e.target.value
                })
              }
            />

            <input
              className="border p-2 w-full mb-3"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description:
                    e.target.value
                })
              }
            />

            <input
              type="date"
              className="border p-2 w-full mb-3"
              value={form.deadline}
              onChange={(e) =>
                setForm({
                  ...form,
                  deadline:
                    e.target.value
                })
              }
            />

            <select
              multiple
              className="border p-2 w-full h-32 mb-3"
              onChange={handleMembers}
            >
              {members.map((m) => (
                <option
                  key={m._id}
                  value={m._id}
                >
                  {m.name}
                </option>
              ))}
            </select>

            <button className="bg-blue-600 text-white px-5 py-2 rounded">
              {editingId
                ? "Update Project"
                : "Create Project"}
            </button>
          </form>
        )}

        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-5">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white p-5 rounded-xl shadow"
            >
              <h2 className="text-xl font-bold">
                {project.name}
              </h2>

              <p className="mt-2 text-gray-600">
                {project.description}
              </p>

              <p className="mt-2">
                Deadline:
                {" "}
                <b>
                  {new Date(
                    project.deadline
                  ).toLocaleDateString()}
                </b>
              </p>

              <p className="mt-2">
                Members:
                {" "}
                <b>
                  {project.members
                    ?.map(
                      (m) =>
                        m.name
                    )
                    .join(", ")}
                </b>
              </p>

              {user?.role === "admin" && (
                <div className="mt-4 space-x-2">
                  <button
                    onClick={() =>
                      editProject(
                        project
                      )
                    }
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteProject(
                        project._id
                      )
                    }
                    className="bg-red-500 text-white px-3 py-1 rounded"
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