// src/pages/admin/TareasManagementPage.jsx
import { useState, useEffect } from 'react';
import DataTable from '../../components/shared/DataTable';
import Modal from '../../components/shared/Modal';
import TareaForm from '../../components/admin/TareaForm';
import { tareaService } from '../../services/tareaService';

const TareasManagementPage = () => {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTarea, setEditingTarea] = useState(null);

  useEffect(() => {
    loadTareas();
  }, []);

  const loadTareas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tareaService.getTareas();
      setTareas(data || []);
    } catch (error) {
      setError('Error al cargar las tareas: ' + (error.message || 'Error desconocido'));
      setTareas([]);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente': return '#ffc107';
      case 'en_progreso': return '#007bff';
      case 'completada': return '#2ab77d';
      case 'cancelada': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'baja': return '#2ab77d';
      case 'media': return '#007bff';
      case 'alta': return '#ffc107';
      case 'urgente': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getTipoColor = (tipo) => {
    return tipo === 'ordinaria' ? '#007bff' : '#ff6b35';
  };

  const columns = [
    {
      key: 'titulo',
      header: 'Tarea',
      render: (tarea) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{tarea.titulo}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {tarea.descripcion.length > 50 
              ? `${tarea.descripcion.substring(0, 50)}...` 
              : tarea.descripcion}
          </div>
        </div>
      )
    },
    {
      key: 'tipo',
      header: 'Tipo',
      render: (tarea) => (
        <span style={{
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          backgroundColor: getTipoColor(tarea.tipo),
          color: 'white',
          fontWeight: '600'
        }}>
          {tarea.tipo === 'ordinaria' ? 'Ordinaria' : 'Extraordinaria'}
        </span>
      )
    },
    {
      key: 'asignado_rol',
      header: 'Rol Asignado',
      render: (tarea) => (
        <span style={{ fontWeight: '600' }}>
          {tarea.asignado_rol?.nombre || 'No asignado'}
        </span>
      )
    },
    {
      key: 'prioridad',
      header: 'Prioridad',
      render: (tarea) => (
        <span style={{
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          backgroundColor: getPrioridadColor(tarea.prioridad),
          color: 'white',
          fontWeight: '600'
        }}>
          {tarea.prioridad_display || 
            (tarea.prioridad === 'baja' ? 'Baja' :
             tarea.prioridad === 'media' ? 'Media' :
             tarea.prioridad === 'alta' ? 'Alta' : 'Urgente')}
        </span>
      )
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (tarea) => (
        <span style={{
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          backgroundColor: getEstadoColor(tarea.estado),
          color: 'white',
          fontWeight: '600'
        }}>
          {tarea.estado_display || 
            (tarea.estado === 'pendiente' ? 'Pendiente' :
             tarea.estado === 'en_progreso' ? 'En Progreso' :
             tarea.estado === 'completada' ? 'Completada' : 'Cancelada')}
        </span>
      )
    },
    {
      key: 'tomada_por',
      header: 'Asignada a',
      render: (tarea) => (
        <div>
          {tarea.tomada_por ? (
            <div>
              <div style={{ fontWeight: '600' }}>
                {tarea.tomada_por.nombre} {tarea.tomada_por.apellido}
              </div>
              <small style={{ color: '#666' }}>
                {new Date(tarea.fecha_tomada).toLocaleDateString('es-ES')}
              </small>
            </div>
          ) : (
            <span style={{ color: '#666', fontStyle: 'italic' }}>Sin asignar</span>
          )}
        </div>
      )
    },
    {
      key: 'fecha_limite',
      header: 'Fecha Límite',
      render: (tarea) => {
        if (!tarea.fecha_limite) return '-';
        const fecha = new Date(tarea.fecha_limite);
        const hoy = new Date();
        const isVencida = fecha < hoy && tarea.estado !== 'completada';
        
        return (
          <span style={{ 
            color: isVencida ? '#dc3545' : 'inherit',
            fontWeight: isVencida ? 'bold' : 'normal'
          }}>
            {fecha.toLocaleDateString('es-ES')}
            {isVencida && ' ⚠️'}
          </span>
        );
      }
    },
    {
      key: 'ubicacion',
      header: 'Ubicación',
      render: (tarea) => (
        <div style={{ fontSize: '12px' }}>
          {tarea.residencia && (
            <div>Residencia: {tarea.residencia.unidad_codigo}</div>
          )}
          {tarea.area_comun && (
            <div>Área: {tarea.area_comun.nombre}</div>
          )}
          {!tarea.residencia && !tarea.area_comun && (
            <span style={{ color: '#666' }}>General</span>
          )}
        </div>
      )
    }
  ];

  const handleCreateTarea = () => {
    setEditingTarea(null);
    setShowModal(true);
  };

  const handleEdit = (tarea) => {
    setEditingTarea(tarea);
    setShowModal(true);
  };

  const handleDelete = async (tarea) => {
    if (window.confirm(`¿Estás seguro de eliminar la tarea "${tarea.titulo}"?`)) {
      try {
        await tareaService.deleteTarea(tarea.id);
        alert('Tarea eliminada correctamente');
        loadTareas();
      } catch (error) {
        alert(`Error al eliminar la tarea: ${error.message}`);
      }
    }
  };

  const handleSubmitTarea = async (tareaData) => {
    try {
      if (editingTarea) {
        await tareaService.updateTarea(editingTarea.id, tareaData);
        alert('Tarea actualizada correctamente');
      } else {
        await tareaService.createTarea(tareaData);
        alert('Tarea creada correctamente');
      }
      setShowModal(false);
      loadTareas();
    } catch (error) {
      alert('Error al guardar la tarea: ' + error.message);
    }
  };

  const handleTomarTarea = async (tarea) => {
    if (tarea.tomada_por) {
      alert('Esta tarea ya fue tomada por otro usuario');
      return;
    }

    if (window.confirm(`¿Quieres tomar la tarea "${tarea.titulo}"?`)) {
      try {
        await tareaService.tomarTarea(tarea.id);
        alert('Tarea tomada correctamente');
        loadTareas();
      } catch (error) {
        alert(`Error al tomar la tarea: ${error.message}`);
      }
    }
  };

  const handleCompletarTarea = async (tarea) => {
    if (tarea.estado === 'completada') {
      alert('Esta tarea ya está completada');
      return;
    }

    if (window.confirm(`¿Marcar la tarea "${tarea.titulo}" como completada?`)) {
      try {
        await tareaService.completarTarea(tarea.id);
        alert('Tarea completada correctamente');
        loadTareas();
      } catch (error) {
        alert(`Error al completar la tarea: ${error.message}`);
      }
    }
  };

  const styles = {
    container: {
      maxWidth: '1400px',
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
    title: {
      fontSize: '2rem',
      marginBottom: '0.3rem',
    },
    subtitle: {
      fontSize: '1rem',
      color: '#666',
    },
    addButton: {
      padding: '0.8rem 1.5rem',
      background: '#2ab77d',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    addButtonHover: {
      background: '#239a67',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 15px rgba(42, 183, 125, 0.35)',
    },
    errorBox: {
      background: '#f8d7da',
      color: '#721c24',
      padding: '15px',
      borderRadius: '5px',
      marginBottom: '20px',
    },
    retryButton: {
      padding: '0.8rem 1.5rem',
      background: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
    },
    actionButtons: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
    },
    actionButton: {
      padding: '4px 8px',
      border: 'none',
      borderRadius: '4px',
      fontSize: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando tareas...</div>;
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>
          <strong>Error:</strong> {error}
        </div>
        <button onClick={loadTareas} style={styles.retryButton}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Gestión de Tareas</h1>
          <p style={styles.subtitle}>Crear y administrar tareas para el personal</p>
        </div>
        <button
          onClick={handleCreateTarea}
          style={styles.addButton}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.addButtonHover)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.addButton)}
        >
          + Nueva Tarea
        </button>
      </div>

      <DataTable
        data={tareas}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        additionalActions={(tarea) => (
          <div style={styles.actionButtons}>
            {!tarea.tomada_por && (
              <button
                onClick={() => handleTomarTarea(tarea)}
                style={{
                  ...styles.actionButton,
                  background: '#007bff',
                  color: 'white'
                }}
              >
                Tomar
              </button>
            )}
            {tarea.estado !== 'completada' && tarea.tomada_por && (
              <button
                onClick={() => handleCompletarTarea(tarea)}
                style={{
                  ...styles.actionButton,
                  background: '#2ab77d',
                  color: 'white'
                }}
              >
                Completar
              </button>
            )}
          </div>
        )}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingTarea ? 'Editar Tarea' : 'Crear Tarea'}
        size="large"
      >
        <TareaForm
          tarea={editingTarea}
          onSubmit={handleSubmitTarea}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

export default TareasManagementPage;