import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Assessment from "../pages/Assessment";
import Question from "../pages/Question";
import Submission from "../pages/Submission";

import ProtectedRoute from "../components/ProtectedRoutes";
import MainLayout from "../layouts/MainLayout";


function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
      >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assessments" element={<Assessment />} />
            <Route path="/questions" element={<Question />} />
            <Route path="/submissions" element={<Submission />} />
      </Route>

    </Routes>
  );
}

export default AppRoutes;
