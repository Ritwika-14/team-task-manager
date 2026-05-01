import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const token = localStorage.getItem("token");
  const [data, setData] = useState({});

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const res = await axios.get(
      "https://team-task-manager-production-41c7.up.railway.app/api/dashboard/stats",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setData(res.data);
  };

  const pieData =
    data.role === "admin"
      ? [
          { name: "Completed", value: data.completedTasks || 0 },
          { name: "Pending", value: data.pendingTasks || 0 },
          { name: "Overdue", value: data.overdueTasks || 0 }
        ]
      : [
          { name: "Completed", value: data.completedMyTasks || 0 },
          { name: "Pending", value: data.pendingMyTasks || 0 },
          { name: "Overdue", value: data.overdueMyTasks || 0 }
        ];

  const barData =
    data.role === "admin"
      ? [
          { name: "Projects", value: data.totalProjects || 0 },
          { name: "Tasks", value: data.totalTasks || 0 }
        ]
      : [
          { name: "My Tasks", value: data.myTasks || 0 },
          { name: "In Progress", value: data.inProgressTasks || 0 }
        ];

  const colors = ["#22c55e", "#3b82f6", "#ef4444"];

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
           {data.role}'s Dashboard
        </h1>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {Object.entries(data).map(
            ([key, value]) =>
              key !== "role" && (
                <div
                  key={key}
                  className="bg-white/80 backdrop-blur-md border border-gray-200 shadow-md rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition duration-300"
                >
                  <h2 className="capitalize text-gray-500 text-sm mb-2 tracking-wide">
                    {key.replace(/([A-Z])/g, " $1")}
                  </h2>

                  <p className="text-3xl font-bold text-blue-600">
                    {value}
                  </p>
                </div>
              )
          )}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* Pie Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-5">
              Task Status
            </h2>

            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-5">
              Summary
            </h2>

            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Bar
                  dataKey="value"
                  radius={[10, 10, 0, 0]}
                  fill="#3b82f6"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </>
  );
}