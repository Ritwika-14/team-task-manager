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
  Legend
} from "recharts";

export default function Dashboard() {
  const token = localStorage.getItem("token");
  const [data, setData] = useState({});

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/dashboard/stats",
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
          {
            name: "Completed",
            value: data.completedTasks || 0
          },
          {
            name: "Pending",
            value: data.pendingTasks || 0
          },
          {
            name: "Overdue",
            value: data.overdueTasks || 0
          }
        ]
      : [
          {
            name: "Completed",
            value:
              data.completedMyTasks || 0
          },
          {
            name: "Pending",
            value:
              data.pendingMyTasks || 0
          },
          {
            name: "Overdue",
            value:
              data.overdueMyTasks || 0
          }
        ];

  const barData =
    data.role === "admin"
      ? [
          {
            name: "Projects",
            value:
              data.totalProjects || 0
          },
          {
            name: "Tasks",
            value:
              data.totalTasks || 0
          }
        ]
      : [
          {
            name: "My Tasks",
            value:
              data.myTasks || 0
          },
          {
            name: "In Progress",
            value:
              data.inProgressTasks || 0
          }
        ];

  const colors = [
    "#22c55e",
    "#3b82f6",
    "#ef4444"
  ];

  return (
    <>
      <Navbar />

      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">
          Dashboard
        </h1>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {Object.entries(data).map(
            ([key, value]) =>
              key !== "role" && (
                <div
                  key={key}
                  className="bg-white shadow rounded-xl p-5"
                >
                  <h2 className="capitalize text-gray-500">
                    {key}
                  </h2>
                  <p className="text-2xl font-bold">
                    {value}
                  </p>
                </div>
              )
          )}
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-10">

          {/* Pie */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">
              Task Status
            </h2>

            <PieChart width={350} height={300}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {pieData.map(
                  (entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        colors[index %
                          colors.length]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip />
            </PieChart>
          </div>

          {/* Bar */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">
              Summary
            </h2>

            <BarChart
              width={400}
              height={300}
              data={barData}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Bar dataKey="value" />
            </BarChart>
          </div>

        </div>
      </div>
    </>
  );
}