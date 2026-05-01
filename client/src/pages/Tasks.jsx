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

  // Logged In User
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

  // Tasks
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

  // Change Project
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

  // Create Task (Admin Only)
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

  // Update Status
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

  // Delete Task (Admin)
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

      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">
          Task Management
        </h1>

        {/* ADMIN FORM */}
        {user?.role === "admin" && (
          <form
            onSubmit={createTask}
            className="bg-white p-6 rounded-xl shadow mb-8"
          >
            <h2 className="text-xl font-bold mb-4">
              Create & Assign Task
            </h2>

            <input
              className="border p-2 w-full mb-3"
              placeholder="Task Title"
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value
                })
              }
            />

            <input
              className="border p-2 w-full mb-3"
              placeholder="Description"
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value
                })
              }
            />

            <select
              className="border p-2 w-full mb-3"
              onChange={(e) =>
                setForm({
                  ...form,
                  priority: e.target.value
                })
              }
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <input
              type="date"
              className="border p-2 w-full mb-3"
              onChange={(e) =>
                setForm({
                  ...form,
                  dueDate: e.target.value
                })
              }
            />

            {/* Project */}
            <select
              className="border p-2 w-full mb-3"
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

            {/* Member */}
            <select
              className="border p-2 w-full mb-3"
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

            <button className="bg-blue-600 text-white px-5 py-2 rounded">
              Assign Task
            </button>
          </form>
        )}

        {/* TASK CARDS */}
        <div className="grid md:grid-cols-3 gap-5">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white p-5 rounded-xl shadow"
            >
              <h2 className="text-xl font-bold">
                {task.title}
              </h2>

              <p>{task.description}</p>

              <p className="mt-2">
                Assigned To:
                {" "}
                <b>
                  {task.assignedTo?.name}
                </b>
              </p>

              <p>
                Priority:
                {" "}
                <b>{task.priority}</b>
              </p>

              <p>
                Status:
                {" "}
                <b>{task.status}</b>
              </p>

              <div className="mt-4 space-x-2">
                <button
                  onClick={() =>
                    updateStatus(
                      task._id,
                      "in-progress"
                    )
                  }
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
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
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Done
                </button>

                {user?.role === "admin" && (
                  <button
                    onClick={() =>
                      deleteTask(task._id)
                    }
                    className="bg-red-500 text-white px-3 py-1 rounded"
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