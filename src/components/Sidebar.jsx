import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import useTheme from "../hooks/useTheme";

function Sidebar() {
const navigate = useNavigate();
const [isOpen, setIsOpen] = useState(false);
const { theme } = useTheme();
const isDark = theme === "dark";

const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
};
const handleNavigation = () => {
    setIsOpen(false);
};
const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/assessments", label: "Assessments", icon: "📝" },
    { to: "/questions", label: "Questions", icon: "❓" },
    { to: "/submissions", label: "Submissions", icon: "📤" },
    { to: "/results", label: "Results", icon: "📈" },
];
return (
    <>
        {/* Mobile Header */}
        <div
            className={`lg:hidden fixed top-0 left-0 right-0 z-40 border-b transition-colors ${
                isDark
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-slate-200"
            }`}
        >
            <div className="h-16 px-4 flex items-center justify-between gap-3">
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className={`w-10 h-10 flex shrink-0 items-center justify-center rounded-lg transition-colors ${
                        isDark
                            ? "text-slate-200 hover:bg-slate-800"
                            : "text-slate-600 hover:bg-slate-100"
                    }`}
                    aria-label="Open navigation"
                    aria-expanded={isOpen}
                >
                    <span className="text-2xl" aria-hidden="true">☰</span>
                </button>
                <div className="text-center min-w-0">
                    <h1 className={`text-lg font-bold ${
                        isDark ? "text-white" : "text-slate-800"
                    }`}>
                        Assessment
                    </h1>
                    <p className={`text-xs ${
                        isDark ? "text-slate-400" : "text-slate-500"
                    }`}>
                        Management System
                    </p>
                </div>
                <div className={`w-10 h-10 shrink-0 rounded-full border flex items-center justify-center ${
                    isDark
                        ? "bg-blue-950 border-blue-800"
                        : "bg-blue-100 border-blue-200"
                }`}>
                    <span className="text-blue-500" aria-hidden="true">👤</span>
                </div>
            </div>
        </div>
        {/* Mobile Backdrop */}
        {isOpen && (
            <button
                type="button"
                className="lg:hidden fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
                aria-label="Close navigation backdrop"
            />
        )}
        {/* Sidebar */}
        <aside
            className={`fixed lg:sticky top-0 left-0 z-50 w-64 h-screen shrink-0 flex flex-col transform transition-all duration-300 ease-in-out ${
                isOpen
                    ? "translate-x-0"
                    : "-translate-x-full lg:translate-x-0"
            } ${
                isDark
                    ? "bg-slate-950 text-white border-r border-slate-800"
                    : "bg-blue-700 text-white"
            }`}
        >
            {/* Logo / Brand */}
            <div className={`px-6 py-6 border-b ${
                isDark ? "border-slate-800" : "border-blue-600"
            }`}>
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <h1 className="text-2xl font-bold">Assessment</h1>
                        <p className={`text-sm mt-1 ${
                            isDark ? "text-slate-400" : "text-blue-200"
                        }`}>
                            Management System
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className={`lg:hidden w-9 h-9 shrink-0 rounded-lg flex items-center justify-center transition-colors ${
                            isDark
                                ? "text-slate-300 hover:bg-slate-800 hover:text-white"
                                : "text-blue-100 hover:bg-blue-600 hover:text-white"
                        }`}
                        aria-label="Close navigation"
                    >
                        <span className="text-xl" aria-hidden="true">✕</span>
                    </button>
                </div>
            </div>
            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={handleNavigation}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                isActive
                                    ? isDark
                                        ? "bg-blue-500 text-white font-semibold shadow-sm"
                                        : "bg-white text-blue-700 font-semibold shadow-sm"
                                    : isDark
                                        ? "text-slate-300 hover:bg-slate-800 hover:text-white"
                                        : "text-blue-100 hover:bg-blue-600 hover:text-white"
                            }`
                        }
                    >
                        <span className="text-lg" aria-hidden="true">
                            {item.icon}
                        </span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
            {/* Logout */}
            <div className={`p-4 border-t ${
                isDark ? "border-slate-800" : "border-blue-600"
            }`}>
                <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 transition-colors text-white py-3 rounded-lg font-semibold"
                >
                    <span aria-hidden="true">🚪</span>
                    Logout
                </button>
            </div>
        </aside>
    </>
);

}

export default Sidebar;