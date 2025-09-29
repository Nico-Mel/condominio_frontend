// src/pages/admin/DetallesCuotaManagementPage.jsx
import { useState, useEffect, useMemo } from 'react';
import { detalleCuotaService } from '../../services/detalleCuotaService';
import { expensaService } from '../../services/expensaService';
import { cuotaService } from '../../services/cuotaService';
import Modal from '../../components/shared/Modal';
import DataTable from '../../components/shared/DataTable';

// --- Definición de Estilos (Mismo estilo limpio) ---
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
    borderBottom: '1px solid #eee',
    paddingBottom: '15px'
  },
  title: {
    fontSize: '2rem',
    marginBottom: '0.3rem',
    color: '#007bff'
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
    transition: 'background 0.3s',
  },
  buttonPrimary: {
    padding: '10px 20px',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  buttonSecondary: {
    padding: '10px 20px',
    background: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  errorBox: {
    background: '#f8d7da',
    color: '#721c24',
    padding: '15px',
    borderRadius: '5px',
    marginBottom: '20px',
  }
};

// --- Componente Principal ---
const DetallesCuotaManagementPage = () => {
  const [detalles, setDetalles] = useState([]);
  const [expensas, setExpensas] = useState([]);
  const [cuotas, setCuotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingDetalle, setEditingDetalle] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  // --- Lógica de Carga y Mapeo de Datos (AJUSTADA) ---
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [detallesData, expensasData, cuotasData] = await Promise.all([
        detalleCuotaService.getAll(),
        expensaService.getAll(),
        cuotaService.getAll()
      ]);

      const expensasMap = new Map((Array.isArray(expensasData) ? expensasData : []).map(exp => [exp.id, exp]));

      // Asociar solo la Expensa (que es la que usaremos en la tabla)
      const mappedDetalles = (Array.isArray(detallesData) ? detallesData : []).map(detalle => {
        const expensaId = detalle.expensa_id || detalle.expensa;
        const expensa = expensasMap.get(expensaId);

        return {
          ...detalle,
          expensa: expensa, // Objeto asociado para renderizado
          expensa_id: expensaId, // ID para el formulario
          expensa_nombre: expensa?.nombre || 'N/A', // Nombre plano para la tabla
          cuota_id: detalle.cuota_id || detalle.cuota, // ID de cuota necesario para el formulario
        };
      });
      
      setDetalles(mappedDetalles);
      setExpensas(Array.isArray(expensasData) ? expensasData : []);
      setCuotas(Array.isArray(cuotasData) ? cuotasData : []);
      
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Error al cargar los datos: ' + (error.message || 'Error desconocido'));
      setDetalles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingDetalle(null);
    setShowModal(true);
  };

  const handleEdit = (detalle) => {
    setEditingDetalle(detalle);
    setShowModal(true);
  };

  const handleDelete = async (detalle) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el detalle de ${detalle.expensa_nombre}?`)) {
      try {
        await detalleCuotaService.delete(detalle.id);
        loadData();
        alert('Detalle eliminado correctamente.');
      } catch (error) {
        console.error('Error deleting detalle:', error);
        alert('Error al eliminar el detalle: ' + error.message);
      }
    }
  };

  const handleSubmit = async (formData) => {
    // El payload sigue siendo el mismo para el backend
    const payload = {
      cuota_id: formData.cuota,
      expensa_id: formData.expensa,
      monto: parseFloat(formData.monto),
      descripcion: formData.descripcion,
      referencia: formData.referencia,
      fecha_vencimiento: formData.fecha_vencimiento || null,
    };
    
    try {
      if (editingDetalle) {
        await detalleCuotaService.update(editingDetalle.id, payload);
        alert('Detalle actualizado correctamente.');
      } else {
        await detalleCuotaService.create(payload);
        alert('Detalle creado correctamente.');
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      console.error('Error saving detalle:', error);
      alert('Error al guardar el detalle: ' + error.message);
    }
  };

  // Columnas para DataTable (SIMPLIFICADAS)
  const columns = useMemo(() => [
    { 
      key: 'expensa_info', 
      header: 'Expensa / Tipo',
      render: (detalle) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{detalle.expensa_nombre}</div>
          <small style={{ color: '#666' }}>
            {detalle.expensa?.tipo ? detalle.expensa.tipo.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'N/A'}
          </small>
        </div>
      )
    },
    { 
      key: 'cuota_id', 
      header: 'ID de Cuota',
      render: (detalle) => `#${detalle.cuota_id || 'N/A'}`
    },
    { 
      key: 'monto', 
      header: 'Monto',
      render: (detalle) => <span style={{ color: '#2ab77d', fontWeight: 'bold' }}>${parseFloat(detalle.monto).toFixed(2)}</span>
    },
    { 
      key: 'vencimiento', 
      header: 'Vencimiento',
      render: (detalle) => {
        if (!detalle.fecha_vencimiento) return 'No definido';
        const fecha = new Date(detalle.fecha_vencimiento);
        return fecha.toLocaleDateString('es-ES');
      }
    },
    { key: 'descripcion', header: 'Descripción' },
  ], []); 

  // --- Renderizado de UI ---
  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando detalles de cuota...</div>;
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>
          <strong>Error:</strong> {error}
        </div>
        <button onClick={loadData} style={styles.buttonPrimary}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Gestión de Componentes de Cuota</h1>
          <p style={styles.subtitle}>Administra los ítems de expensas que componen cada cuota generada.</p>
        </div>
        <button
          onClick={handleCreate}
          style={styles.addButton}
        >
          + Crear Nuevo Detalle
        </button>
      </div>

      {detalles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#666', border: '1px dashed #ddd', borderRadius: '8px' }}>
          <p style={{ fontSize: '1.1em', marginBottom: '20px' }}>No hay componentes de cuota registrados.</p>
          <button onClick={handleCreate} style={styles.buttonPrimary}>
            Crear el primer detalle
          </button>
        </div>
      ) : (
        <DataTable
          data={detalles}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          showActions
        />
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingDetalle ? 'Editar Detalle de Cuota' : 'Crear Detalle de Cuota'}
      >
        <DetalleCuotaForm
          detalle={editingDetalle}
          expensas={expensas}
          cuotas={cuotas}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
          buttonStyles={{ primary: styles.buttonPrimary, secondary: styles.buttonSecondary }}
        />
      </Modal>
    </div>
  );
};

// Componente Form para DetalleCuota
const DetalleCuotaForm = ({ detalle, expensas, cuotas, onSubmit, onCancel, buttonStyles }) => {
  
  const initialFormData = {
    cuota: '',
    expensa: '',
    monto: '',
    descripcion: '',
    referencia: '',
    fecha_vencimiento: ''
  };
  
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (detalle) {
      setFormData({
        cuota: detalle.cuota_id || '',
        expensa: detalle.expensa_id || '',
        monto: detalle.monto || '',
        descripcion: detalle.descripcion || '',
        referencia: detalle.referencia || '',
        fecha_vencimiento: detalle.fecha_vencimiento ? new Date(detalle.fecha_vencimiento).toISOString().substring(0, 10) : ''
      });
    } else {
      setFormData(initialFormData);
    }
  }, [detalle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const formStyles = {
    label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
    input: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' },
    select: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' },
    textarea: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical', boxSizing: 'border-box' },
    group: { marginBottom: '20px' }
  };


  return (
    <form onSubmit={handleSubmit} style={{ width: '500px', padding: '20px' }}>
      <div style={formStyles.group}>
        <label style={formStyles.label}>Cuota</label>
        <select
          name="cuota"
          value={formData.cuota}
          onChange={handleChange}
          required
          style={formStyles.select}
        >
          <option value="">Seleccionar cuota</option>
          {cuotas.map(cuota => (
            <option key={cuota.id} value={cuota.id}>
              {cuota.residencia || `ID ${cuota.id}`} ({cuota.periodo || 'Sin Período'})
            </option>
          ))}
        </select>
      </div>

      <div style={formStyles.group}>
        <label style={formStyles.label}>Expensa</label>
        <select
          name="expensa"
          value={formData.expensa}
          onChange={handleChange}
          required
          style={formStyles.select}
        >
          <option value="">Seleccionar expensa</option>
          {expensas.filter(exp => exp.es_activo).map(expensa => (
            <option key={expensa.id} value={expensa.id}>
              {expensa.nombre} - ({expensa.tipo ? expensa.tipo.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'N/A'})
            </option>
          ))}
        </select>
      </div>

      <div style={formStyles.group}>
        <label style={formStyles.label}>Monto</label>
        <input
          type="number"
          name="monto"
          value={formData.monto}
          onChange={handleChange}
          step="0.01"
          min="0"
          required
          style={formStyles.input}
        />
      </div>

      <div style={formStyles.group}>
        <label style={formStyles.label}>Fecha de Vencimiento (Opcional)</label>
        <input
          type="date"
          name="fecha_vencimiento"
          value={formData.fecha_vencimiento}
          onChange={handleChange}
          style={formStyles.input}
        />
      </div>

      <div style={formStyles.group}>
        <label style={formStyles.label}>Descripción</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows="3"
          style={formStyles.textarea}
        />
        <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>Detalles adicionales sobre este componente de la cuota.</small>
      </div>

      <div style={formStyles.group}>
        <label style={formStyles.label}>Referencia (Opcional)</label>
        <input
          type="text"
          name="referencia"
          value={formData.referencia}
          onChange={handleChange}
          style={formStyles.input}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '15px', borderTop: '1px solid #eee' }}>
        <button
          type="button"
          onClick={onCancel}
          style={buttonStyles.secondary}
        >
          Cancelar
        </button>
        <button
          type="submit"
          style={buttonStyles.primary}
        >
          {detalle ? 'Actualizar' : 'Crear'} Detalle
        </button>
      </div>
    </form>
  );
};

export default DetallesCuotaManagementPage;