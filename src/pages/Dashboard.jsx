import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {

    const [stats, setStats] = useState(null);

    useEffect(() => {

        const fetchDashboard = async () => {

            try {

                const response = await api.get("/dashboard");

                console.log(response.data);

                setStats(response.data);

            } catch (error) {

                console.error(error.response?.data || error.message);

            }

        };

        fetchDashboard();

    }, []);

    if (!stats) {
        return <h2>Loading Dashboard...</h2>;
    }

    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">
          Admin Dashboard
        </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-gray-500">Total Users</h2>
        <p className="text-3xl font-bold">{stats.totalUsers}</p>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-gray-500">Students</h2>
        <p className="text-3xl font-bold">{stats.totalStudents}</p>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-gray-500">Assessments</h2>
        <p className="text-3xl font-bold">{stats.totalAssessments}</p>
      </div>

    </div>
  </div>
);
}

export default Dashboard;