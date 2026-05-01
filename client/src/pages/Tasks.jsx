import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function Tasks() {
  const token = localStorage.getItem("token");

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    projectId: "",
    assignedTo: ""
  });

  useEffect(() => {
    fetchUser();
    fetchProjects();
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

    if (res.data.length > 0) {
      const first = res.data[0];

      setMembers(first.members);

      setForm((prev) => ({
        ...prev,
        projectId: first._id,
        assignedTo:
          first.members.length > 0
            ? first.members[0]._id
            : ""
      }));

      fetchTasks(first._id);
    }
  };

  const fetchTasks = async (projectId) => {
    const res = await axios.get(
      `https://team-task-manager-production-41c7.up.railway.app/api/tasks/project/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setTasks(res.data);
  };

  const handleProjectChange = (id) => {
    const selected = projects.find(
      (p) => p._id === id
    );

    setMembers(selected.members);

    setForm({
      ...form,
      projectId: id,
      assignedTo:
        selected.members.length > 0
          ? selected.members[0]._id
          : ""
    });

    fetchTasks(id);
  };

  const createTask = async (e) => {
    e.preventDefault();

    await axios.post(
      "https://team-task-manager-production-41c7.up.railway.app/api/tasks",
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    fetchTasks(form.projectId);
    alert("Task Created");
  };

  const updateStatus = async (id, status) => {
    await axios.put(
      `https://team-task-manager-production-41c7.up.railway.app/api/tasks/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    fetchTasks(form.projectId);
  };

  const deleteTask = async (id) => {
    await axios.delete(
      `https://team-task-manager-production-41c7.up.railway.app/api/tasks/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    fetchTasks(form.projectId);
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-8">

        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Task Management
        </h1>

        {/* ADMIN FORM */}
        {user?.role === "admin" && (
          <form
            onSubmit={createTask}
            className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg mb-10 border border-gray-200"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-700">
              Create & Assign Task
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              <input
                className="border border-gray-300 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Task Title"
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value
                  })
                }
              />

              <input
                type="date"
                className="border border-gray-300 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={(e) =>
                  setForm({
                    ...form,
                    dueDate: e.target.value
                  })
                }
              />

            </div>

            <textarea
              rows="4"
              className="border border-gray-300 rounded-xl px-4 py-3 w-full mt-4 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Description"
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value
                })
              }
            />

            <div className="grid md:grid-cols-3 gap-4 mt-4">

              <select
                className="border border-gray-300 rounded-xl px-4 py-3 w-full"
                onChange={(e) =>
                  setForm({
                    ...form,
                    priority: e.target.value
                  })
                }
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>

              <select
                className="border border-gray-300 rounded-xl px-4 py-3 w-full"
                value={form.projectId}
                onChange={(e) =>
                  handleProjectChange(
                    e.target.value
                  )
                }
              >
                {projects.map((p) => (
                  <option
                    key={p._id}
                    value={p._id}
                  >
                    {p.name}
                  </option>
                ))}
              </select>

              <select
                className="border border-gray-300 rounded-xl px-4 py-3 w-full"
                value={form.assignedTo}
                onChange={(e) =>
                  setForm({
                    ...form,
                    assignedTo: e.target.value
                  })
                }
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

            </div>

            <button className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition">
              Assign Task
            </button>
          </form>
        )}

        {/* TASK CARDS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-800">
                {task.title}
              </h2>

              <p className="mt-3 text-gray-600 leading-relaxed">
                {task.description}
              </p>

              <div className="mt-4 space-y-2 text-sm">

                <p>
                  <span className="font-semibold text-gray-700">
                    Assigned To:
                  </span>{" "}
                  {task.assignedTo?.name}
                </p>

                <p>
                  <span className="font-semibold text-gray-700">
                    Priority:
                  </span>{" "}
                  <span className="capitalize">
                    {task.priority}
                  </span>
                </p>

                <p>
                  <span className="font-semibold text-gray-700">
                    Status:
                  </span>{" "}
                  <span className="capitalize">
                    {task.status}
                  </span>
                </p>

              </div>

              <div className="mt-5 flex flex-wrap gap-2">

                <button
                  onClick={() =>
                    updateStatus(
                      task._id,
                      "in-progress"
                    )
                  }
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl transition"
                >
                  Progress
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      task._id,
                      "done"
                    )
                  }
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition"
                >
                  Done
                </button>

                {user?.role === "admin" && (
                  <button
                    onClick={() =>
                      deleteTask(task._id)
                    }
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition"
                  >
                    Delete
                  </button>
                )}

              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}