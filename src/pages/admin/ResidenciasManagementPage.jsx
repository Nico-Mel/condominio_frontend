// src/pages/admin/ResidenciasManagementPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/shared/DataTable';
import Modal from '../../components/shared/Modal';
import ResidenciaForm from '../../components/admin/ResidenciaForm';
import { residenciaService } from '../../services/residenciaService';

const ResidenciasManagementPage = () => {
  const [residencias, setResidencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingResidencia, setEditingResidencia] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadResidencias();
  }, []);

  const loadResidencias = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await residenciaService.getResidencias();
      setResidencias(data || []);
    } catch (error) {
      setError('Error al cargar las residencias: ' + (error.message || 'Error desconocido'));
      setResidencias([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'unidad_codigo',
      header: 'Unidad',
      render: (residencia) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{residencia.unidad_codigo}</div>
          {residencia.unidad_tipo && (
            <small style={{ color: '#666' }}>{residencia.unidad_tipo}</small>
          )}
        </div>
      )
    },
    {
      key: 'residente_nombre',
      header: 'Residente',
      render: (residencia) => (
        <div>
          <div>{residencia.residente_nombre} {residencia.residente_apellido}</div>
          <small style={{ color: '#666' }}>CI: {residencia.residente_ci}</small>
        </div>
      )
    },
    {
      key: 'tipo_contrato',
      header: 'Contrato',
      render: (residencia) => (
        <span style={{
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          backgroundColor:
            residencia.tipo_contrato === 'propiedad' ? '#2ab77d' :
            residencia.tipo_contrato === 'alquiler' ? '#007bff' : '#6c757d',
          color: 'white'
        }}>
          {residencia.tipo_contrato_display ||
            (residencia.tipo_contrato === 'propiedad' ? 'Propiedad' :
             residencia.tipo_contrato === 'alquiler' ? 'Alquiler' : 'Comodato')}
        </span>
      )
    },
    {
      key: 'fecha_inicio',
      header: 'Fecha Inicio',
      render: (residencia) => {
        if (!residencia.fecha_inicio) return '-';
        const fecha = new Date(residencia.fecha_inicio);
        return fecha.toLocaleDateString('es-ES');
      }
    },
    {
      key: 'fecha_fin',
      header: 'Fecha Fin',
      render: (residencia) => {
        if (!residencia.fecha_fin) return '-';
        const fecha = new Date(residencia.fecha_fin);
        return fecha.toLocaleDateString('es-ES');
      }
    },
    {
      key: 'esta_activa',
      header: 'Estado',
      render: (residencia) => {
        const hoy = new Date();
        const fechaFin = residencia.fecha_fin ? new Date(residencia.fecha_fin) : null;
        let estado = 'Activa';
        let color = '#2ab77d';

        if (!residencia.esta_activa) {
          estado = 'Inactiva';
          color = '#dc3545';
        } else if (fechaFin && fechaFin < hoy) {
          estado = 'Vencida';
          color = '#ffc107';
        }

        return (
          <span style={{ color, fontWeight: 'bold' }}>
            {estado}
          </span>
        );
      }
    }
  ];

  const handleCreateResidencia = () => {
    setEditingResidencia(null);
    setShowModal(true);
  };

  const handleEdit = (residencia) => {
    setEditingResidencia(residencia);
    setShowModal(true);
  };

  const handleDelete = async (residencia) => {
    const action = residencia.esta_activa ? 'desactivar' : 'activar';
    if (window.confirm(`¿Estás seguro de ${action} la residencia de ${residencia.residente_nombre} en ${residencia.unidad_codigo}?`)) {
      try {
        await residenciaService.toggleResidenciaActiva(residencia.id);
        alert(`Residencia ${action === 'activar' ? 'activada' : 'desactivada'} correctamente`);
        loadResidencias();
      } catch (error) {
        alert(`Error al ${action} la residencia: ${error.message}`);
      }
    }
  };

  const handleSubmitResidencia = async (residenciaData) => {
    try {
      if (editingResidencia) {
        await residenciaService.updateResidencia(editingResidencia.id, residenciaData);
        alert('Residencia actualizada correctamente');
      } else {
        await residenciaService.createResidencia(residenciaData);
        alert('Residencia creada correctamente');
      }
      setShowModal(false);
      loadResidencias();
    } catch (error) {
      alert('Error al guardar la residencia: ' + error.message);
    }
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
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando residencias...</div>;
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>
          <strong>Error:</strong> {error}
        </div>
        <button onClick={loadResidencias} style={styles.retryButton}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Gestión de Residencias</h1>
          <p style={styles.subtitle}>Asignar residentes a unidades y gestionar contratos</p>
        </div>
        <button
          onClick={handleCreateResidencia}
          style={styles.addButton}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.addButtonHover)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.addButton)}
        >
          + Nueva Residencia
        </button>
      </div>

      <DataTable
        data={residencias}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingResidencia ? 'Editar Residencia' : 'Crear Residencia'}
      >
        <ResidenciaForm
                    residencia={editingResidencia}
          onSubmit={handleSubmitResidencia}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

export default ResidenciasManagementPage;

