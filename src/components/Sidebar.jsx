import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <aside className="w-64 bg-blue-700 text-white min-h-screen p-6">

        <h2 className="text-2xl font-bold mb-8">
            Dashboard
            </h2>

            <nav className="space-y-4">

            <NavLink
                 to="/dashboard"
                 className="block hover:text-yellow-300"
            >
                🏢 Dashboard
            </NavLink>

            <NavLink
                to="/assessments"
                className="block hover:text-yellow-300"
            >
                📝 Assessments
            </NavLink>

                <NavLink
                    to="/questions"
                    className="block hover:text-yellow-300"
                >
                    ❓ Questions
                </NavLink>

                <NavLink
                    to="/submissions"
                    className="block hover:text-yellow-300"
                >
                    📤 Submissions
                </NavLink>

                <button
                    onClick={handleLogout}
                    className="mt-10 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
                >
                    🚪 Logout
                </button>
            </nav>
        </aside>
    );
}

export default Sidebar;