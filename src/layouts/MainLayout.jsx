import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function MainLayout() {
    return (
        <div className="flex min-h-screen">

            <Sidebar />

            <div className="flex-1 bg-gray-100">

            <header className="bg-white shadow p-5">

                <h1 className="text-3xl font-bold">
                    Assessment System
                </h1>

            </header>

            <main className="p-8">
                <Outlet />
            </main>

        </div>

    </div>
    );
}
export default MainLayout;
