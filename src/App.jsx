// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import ResidentDashboard from "./pages/dashboard/ResidentDashboard";
import CleaningDashboard from "./pages/dashboard/CleaningDashboard";
import UserManagementPage from './pages/admin/UserManagementPage';
import RolesPermisosPage from './pages/admin/RolesPermisosPage';
import ResidentesManagementPage from "./pages/admin/ResidentesManagementPage";  
import UnidadesManagementPage from "./pages/admin/UnidadesManagementPage";
import ResidenciasManagementPage from "./pages/admin/ResidenciasManagementPage";
import AreasComunesManagementPage from "./pages/admin/AreasComunesManagementPage";  
import ExpensasManagementPage from './pages/admin/ExpensaManagementPage';
import CuotasManagementPage from './pages/admin/CuotasManagementPage';
import DetallesCuotaManagementPage from './pages/admin/DetallesCuotaManagementPage';
import MultasManagementPage from './pages/admin/MultasManagementPage';
import TareasManagementPage from './pages/admin/TareasManagementPage';
import PersonalDashboard from './pages/dashboard/PersonalDashboard';



// Importar otros dashboards y páginas según sea necesario

// Componente simple de protección
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return user ? children : <Navigate to="/login" replace />;
};

// Componente que redirige según el rol
const DashboardRouter = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  if (!user) return <Navigate to="/login" replace />;

  switch(user.rol) {
    case 'Admin':
      return <Navigate to="/dashboard/admin" replace />;
    case 'Copropietario':
      return <Navigate to="/dashboard/resident" replace />;
    case 'Personal':
      return <Navigate to="/dashboard/cleaning" replace />;
    default:
      return <Navigate to="/unauthorized" replace />;
  }
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<h1>Página de Registro - Próximamente</h1>} />
        
        {/* Ruta general que redirige según rol */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          } 
        />
        
        {/* Dashboards específicos por rol */}
        <Route 
          path="/dashboard/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
          
        />
        
        <Route 
          path="/dashboard/resident" 
          element={
            <ProtectedRoute>
              <ResidentDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard/cleaning" 
          element={
            <ProtectedRoute>
              <CleaningDashboard />
            </ProtectedRoute>
          } 
        />

        {/* NUEVA RUTA: Gestión de Usuarios (solo para admin) */}
        <Route 
          path="/admin/usuarios" 
          element={
            <ProtectedRoute>
              <UserManagementPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/roles-permisos" 
          element={
            <ProtectedRoute>
              <RolesPermisosPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/residentes" 
          element={
            <ProtectedRoute>
              <ResidentesManagementPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/unidades" 
          element={
            <ProtectedRoute>
              <UnidadesManagementPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/residencias" 
          element={
            <ProtectedRoute>
              <ResidenciasManagementPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/areas-comunes"
          element={
            <ProtectedRoute>
              <AreasComunesManagementPage />
            </ProtectedRoute>
          } 
        />
                
        <Route 
          path="/admin/expensas"
          element={
            <ProtectedRoute>
              <ExpensasManagementPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/cuotas"
          element={
            <ProtectedRoute>
              <CuotasManagementPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/detalles-cuota"
          element={
            <ProtectedRoute>
              <DetallesCuotaManagementPage />
            </ProtectedRoute>
          } 
        />
        <Route 
  path="/admin/multas"
  element={
    <ProtectedRoute>
      <MultasManagementPage />
    </ProtectedRoute>
  }
/>
<Route 
  path="/admin/tareas" 
  element={
    <ProtectedRoute>
      <TareasManagementPage />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/personal/tareas" 
  element={
    <ProtectedRoute>
      <PersonalDashboard />
    </ProtectedRoute>
  } 
/>


        <Route path="/unauthorized" element={<h1>No tienes permisos</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;