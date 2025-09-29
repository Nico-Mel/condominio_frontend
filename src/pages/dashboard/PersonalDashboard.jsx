// src/pages/dashboard/PersonalDashboard.jsx
import { useState, useEffect } from 'react';
import { tareaService } from '../../services/tareaService';

const PersonalDashboard = () => {
  const [misTareas, setMisTareas] = useState([]);
  const [tareasDisponibles, setTareasDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('mis-tareas');

  useEffect(() => {
    loadTareas();
  }, []);

  const loadTareas = async () => {
    try {
      setLoading(true);
      const [misTareasData, disponiblesData] = await Promise.all([
        tareaService.getMisTareas(),
        tareaService.getTareasDisponibles()
      ]);
      setMisTareas(misTareasData || []);
      setTareasDisponibles(disponiblesData || []);
    } catch (error) {
      console.error('Error cargando tareas:', error);
      alert('Error al cargar las tareas');
    } finally {
      setLoading(false);
    }
  };

  const handleTomarTarea = async (tarea) => {
    try {
      await tareaService.tomarTarea(tarea.id);
      alert('Tarea tomada correctamente');
      loadTareas();
    } catch (error) {
      alert(`Error al tomar la tarea: ${error.message}`);
    }
  };

  const handleCompletarTarea = async (tarea) => {
    try {
      await tareaService.completarTarea(tarea.id);
      alert('Tarea completada correctamente');
      loadTareas();
    } catch (error) {
      alert(`Error al completar la tarea: ${error.message}`);
    }
  };

  const TareaCard = ({ tarea, esDisponible = false }) => (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h3 style={styles.cardTitle}>{tarea.titulo}</h3>
        <div style={styles.badges}>
          <span style={{
            ...styles.badge,
            backgroundColor: tarea.tipo === 'ordinaria' ? '#007bff' : '#ff6b35'
          }}>
            {tarea.tipo === 'ordinaria' ? 'Ordinaria' : 'Extraordinaria'}
          </span>
          <span style={{
            ...styles.badge,
            backgroundColor: 
              tarea.prioridad === 'baja' ? '#2ab77d' :
              tarea.prioridad === 'media' ? '#007bff' :
              tarea.prioridad === 'alta' ? '#ffc107' : '#dc3545'
          }}>
            {tarea.prioridad_display || tarea.prioridad}
          </span>
        </div>
      </div>
      
      <p style={styles.cardDescription}>{tarea.descripcion}</p>
      
      <div style={styles.cardDetails}>
        <div style={styles.detailItem}>
          <strong>Estado:</strong> 
          <span style={{
            color: 
              tarea.estado === 'pendiente' ? '#ffc107' :
              tarea.estado === 'en_progreso' ? '#007bff' :
              tarea.estado === 'completada' ? '#2ab77d' : '#dc3545',
            fontWeight: 'bold',
            marginLeft: '8px'
          }}>
            {tarea.estado_display || tarea.estado}
          </span>
        </div>
        
        {tarea.fecha_limite && (
          <div style={styles.detailItem}>
            <strong>Fecha Límite:</strong> 
            <span style={{ marginLeft: '8px' }}>
              {new Date(tarea.fecha_limite).toLocaleDateString('es-ES')}
            </span>
          </div>
        )}
        
        {tarea.residencia && (
          <div style={styles.detailItem}>
            <strong>Residencia:</strong> 
            <span style={{ marginLeft: '8px' }}>{tarea.residencia.unidad_codigo}</span>
          </div>
        )}
        
        {tarea.area_comun && (
          <div style={styles.detailItem}>
            <strong>Área Común:</strong> 
            <span style={{ marginLeft: '8px' }}>{tarea.area_comun.nombre}</span>
          </div>
        )}
      </div>
      
      <div style={styles.cardActions}>
        {esDisponible ? (
          <button
            onClick={() => handleTomarTarea(tarea)}
            style={styles.primaryButton}
          >
            Tomar Tarea
          </button>
        ) : tarea.estado === 'en_progreso' ? (
          <button
            onClick={() => handleCompletarTarea(tarea)}
            style={styles.successButton}
          >
            Marcar como Completada
          </button>
        ) : null}
      </div>
    </div>
  );

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: 'Segoe UI, sans-serif',
      color: '#333',
    },
    header: {
      marginBottom: '40px',
      textAlign: 'center',
    },
    title: {
      fontSize: '2rem',
      marginBottom: '0.5rem',
    },
    subtitle: {
      fontSize: '1rem',
      color: '#666',
    },
    tabs: {
      display: 'flex',
      marginBottom: '30px',
      borderBottom: '2px solid #eee',
    },
    tab: {
      padding: '12px 24px',
      background: 'none',
      border: 'none',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      borderBottom: '3px solid transparent',
      transition: 'all 0.3s ease',
    },
    activeTab: {
      borderBottomColor: '#2ab77d',
      color: '#2ab77d',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '20px',
    },
    card: {
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      border: '1px solid #eee',
      transition: 'transform 0.2s ease',
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px',
    },
    cardTitle: {
      margin: '0',
      fontSize: '18px',
      fontWeight: '600',
      flex: 1,
      marginRight: '12px',
    },
    badges: {
      display: 'flex',
      gap: '8px',
      flexShrink: 0,
    },
    badge: {
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '11px',
      color: 'white',
      fontWeight: '600',
    },
    cardDescription: {
      color: '#666',
      fontSize: '14px',
      lineHeight: '1.4',
      marginBottom: '16px',
    },
    cardDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      marginBottom: '16px',
    },
    detailItem: {
      fontSize: '14px',
      display: 'flex',
    },
    cardActions: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    primaryButton: {
      padding: '8px 16px',
      background: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '14px',
    },
    successButton: {
      padding: '8px 16px',
      background: '#2ab77d',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '14px',
    },
    loading: {
      textAlign: 'center',
      padding: '40px',
      fontSize: '18px',
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px',
      color: '#666',
    }
  };

  if (loading) {
    return <div style={styles.loading}>Cargando tareas...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Panel de Tareas</h1>
        <p style={styles.subtitle}>Gestiona tus tareas asignadas y disponibles</p>
      </div>

      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'mis-tareas' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('mis-tareas')}
        >
          Mis Tareas ({misTareas.length})
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'disponibles' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('disponibles')}
        >
          Tareas Disponibles ({tareasDisponibles.length})
        </button>
      </div>

      {activeTab === 'mis-tareas' && (
        <div style={styles.grid}>
          {misTareas.length > 0 ? (
            misTareas.map(tarea => (
              <TareaCard key={tarea.id} tarea={tarea} />
            ))
          ) : (
            <div style={styles.emptyState}>
              <p>No tienes tareas asignadas actualmente.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'disponibles' && (
        <div style={styles.grid}>
          {tareasDisponibles.length > 0 ? (
            tareasDisponibles.map(tarea => (
              <TareaCard key={tarea.id} tarea={tarea} esDisponible={true} />
            ))
          ) : (
            <div style={styles.emptyState}>
              <p>No hay tareas disponibles para tu rol en este momento.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PersonalDashboard;