// src/pages/dashboard/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
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

  const navigateToSection = (section) => {
    navigate(`/admin/${section}`);
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: 'Segoe UI, sans-serif',
      color: '#333',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '40px',
    },
    logoutButton: {
      padding: '0.8rem 1.5rem',
      background: '#ff4444',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    grid: {
      display: 'grid',
      gap: '24px',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    },
    card: {
      background: '#f9f9f9',
      border: '1px solid #e0e0e0',
      padding: '24px',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    cardTitle: {
      marginBottom: '0.5rem',
      fontSize: '1.2rem',
      color: '#2ab77d',
    },
    cardText: {
      fontSize: '0.95rem',
      color: '#555',
    },
  };

  if (!user) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando...</div>;
  }

  const sections = [
    { title: 'Roles y Permisos', description: 'Gestionar roles, permisos y sus asignaciones', path: 'roles-permisos' },
    { title: 'Gestión de Usuarios', description: 'Administrar residentes, personal y permisos', path: 'usuarios' },
    { title: 'Gestor de Residentes', description: 'Gestionar copropietarios e inquilinos del condominio', path: 'residentes' },
    { title: 'Gestión de Unidades', description: 'Gestionar propiedades y características', path: 'unidades' },
    { title: 'Gestión de Residencias', description: 'Asignar residentes a unidades y contratos', path: 'residencias' },
    { title: 'Espacios Comunes', description: 'Gestionar areas y disponibilidad', path: 'areas-comunes' },
    { title: 'Expensas y Cuotas', description: 'Gestionar cuotas, pagos y multas', path: 'expensas' },
    { title: 'Tareas del Personal', description: 'Crear y asignar tareas de limpieza/mantenimiento', path: 'tareas' },
  ];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1>Panel de Administración</h1>
          <p>Bienvenido, {user.nombre} {user.apellido}</p>
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Cerrar Sesión
        </button>
      </header>

      <main>
        <h2 style={{ marginBottom: '24px' }}>Funcionalidades de Administrador</h2>
        <div style={styles.grid}>
          {sections.map((section, index) => (
            <div
              key={index}
              style={styles.card}
              onClick={() => navigateToSection(section.path)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(42, 183, 125, 0.15)';
                e.currentTarget.style.borderColor = '#2ab77d';
                e.currentTarget.style.background = '#eafaf3';
              }}
              onMouseLeave={(e) => {
                Object.assign(e.currentTarget.style, styles.card);
              }}
            >
              <h3 style={styles.cardTitle}>{section.title}</h3>
              <p style={styles.cardText}>{section.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
