import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import useTheme from "../hooks/useTheme";

function MainLayout() {
const { theme, toggleTheme } = useTheme();
const isDark = theme === "dark";

return (
    <div className={`flex min-h-screen ${isDark ? "dark bg-slate-950" : "bg-slate-100"}`}>
        {/* Sidebar */}
        <Sidebar />
        {/* Main Area */}
        <div className="flex-1 min-w-0 flex flex-col">
            {/* Header */}
            <header className={`sticky top-0 z-30 border-b ${
                isDark
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-slate-200"
            }`}>
                <div className="px-4 md:px-8 py-4">
                    <div className="flex items-center justify-between gap-4">
                        {/* Page Branding */}
                        <div className="min-w-0">
                            <h1 className={`text-lg md:text-2xl font-bold ${
                                isDark ? "text-white" : "text-slate-800"
                            }`}>
                                Assessment System
                            </h1>
                            <p className={`hidden sm:block text-sm mt-1 ${
                                isDark ? "text-slate-400" : "text-slate-500"
                            }`}>
                                Manage Assessments and Track Performance
                            </p>
                        </div>
                        {/* Theme Toggle and User */}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={toggleTheme}
                                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                                aria-pressed={isDark}
                                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                                className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    isDark
                                        ? "border-slate-700 bg-slate-800 text-amber-300 hover:bg-slate-700"
                                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                                }`}
                            >
                                {isDark ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <circle cx="12" cy="12" r="4" />
                                        <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6.5 6.5 0 0 0 8.268 8.268c.344-.215.825-.003.803.401" />
                                    </svg>
                                )}
                            </button>
                            <div className="hidden sm:block text-right">
                                <p className={`text-sm font-semibold ${
                                    isDark ? "text-slate-100" : "text-slate-800"
                                }`}>
                                    Admin
                                </p>
                                <p className={`text-xs ${
                                    isDark ? "text-slate-400" : "text-slate-500"
                                }`}>
                                    Administrator
                                </p>
                            </div>
                            <div className={`hidden sm:flex w-10 h-10 rounded-full border items-center justify-center ${
                                isDark
                                    ? "bg-blue-950 border-blue-800"
                                    : "bg-blue-100 border-blue-200"
                            }`}>
                                <span className="text-lg" aria-hidden="true">
                                    👤
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            {/* Page Content */}
            <main className={`flex-1 min-w-0 p-4 pt-6 sm:p-5 lg:p-8 ${
                isDark ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900"
            }`}>
                <Outlet />
            </main>
        </div>
    </div>
);

}

export default MainLayout;