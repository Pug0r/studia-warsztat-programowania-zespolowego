import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { AdoptionApplicationPage } from "@/pages/adoption/AdoptionApplicationPage";
import { AdoptionsDashboardPage } from "@/pages/dashboard/AdoptionsDashboardPage";
import { VolunteersDashboardPage } from "@/pages/dashboard/VolunteersDashboardPage";
import { HomePage } from "@/pages/public/HomePage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { PetsPage } from "@/pages/pets/PetsPage";
import { HealthCardsPatientsPage } from "@/pages/healthCards/HealthCardsPatientsPage";
import { HealthCardPage } from "@/pages/healthCards/HealthCardPage";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { CoordinatorRoute } from "@/routes/CoordinatorRoute";
import { VetRoute } from "@/routes/VetRoute";
import { AdminRoute } from "@/routes/AdminRoute";
import { AdminPanelPage } from "@/pages/admin/AdminPanelPage";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/pets" element={<PetsPage />} />
      <Route path="/adopt" element={<AdoptionApplicationPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/adoptions"
        element={
          <ProtectedRoute>
            <AdoptionsDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/volunteers"
        element={
          <CoordinatorRoute>
            <VolunteersDashboardPage />
          </CoordinatorRoute>
        }
      />
      <Route
        path="/health-cards"
        element={
          <VetRoute>
            <HealthCardsPatientsPage />
          </VetRoute>
        }
      />
      <Route
        path="/health-cards/:petId"
        element={
          <VetRoute>
            <HealthCardPage />
          </VetRoute>
        }
      />
      <Route
        path="/dashboard/admin"
        element={
          <AdminRoute>
            <AdminPanelPage />
          </AdminRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
