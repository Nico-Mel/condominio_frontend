// src/pages/dashboard/CleaningDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CleaningDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(userData);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1>Panel de Limpieza</h1>
          <p>Bienvenido, {user.nombre} {user.apellido} ({user.rol})</p>
        </div>
        <button onClick={handleLogout} style={{ padding: '10px 20px', background: '#ff4444', color: 'white', border: 'none', borderRadius: '5px' }}>
          Cerrar Sesión
        </button>
      </header>
      
      <main>
        <h2>Funcionalidades de Limpieza</h2>
        <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px' }}>
            <h3>Horarios de Limpieza</h3>
            <p>Ver tu calendario de trabajo</p>
          </div>
          <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px' }}>
            <h3>Tareas Completadas</h3>
            <p>Reportar tareas finalizadas</p>
          </div>
          <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px' }}>
            <h3>Materiales</h3>
            <p>Solicitar insumos de limpieza</p>
          </div>
        </div>
      </main>
    </div>
  );
}