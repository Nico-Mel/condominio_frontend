// src/components/admin/TareaForm.jsx
import { useState, useEffect } from 'react';

const TareaForm = ({ tarea, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    tipo: 'extraordinaria',
    asignado_rol: '',
    prioridad: 'media',
    fecha_limite: '',
    residencia: '',
    area_comun: '',
  });

  const [residencias, setResidencias] = useState([]);
  const [areasComunes, setAreasComunes] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tarea) {
      setFormData({
        titulo: tarea.titulo || '',
        descripcion: tarea.descripcion || '',
        tipo: tarea.tipo || 'extraordinaria',
        asignado_rol: tarea.asignado_rol?.id || '',
        prioridad: tarea.prioridad || 'media',
        fecha_limite: tarea.fecha_limite || '',
        residencia: tarea.residencia?.id || '',
        area_comun: tarea.area_comun?.id || '',
      });
    }
    // En una implementación real, cargarías residencias, áreas comunes y roles desde APIs
    loadDatosAdicionales();
  }, [tarea]);

  const loadDatosAdicionales = async () => {
    // Simulación de carga de datos
    setRoles([
      { id: 1, nombre: 'Limpieza' },
      { id: 2, nombre: 'Mantenimiento' },
      { id: 3, nombre: 'Seguridad' },
      { id: 4, nombre: 'Administración' },
    ]);
    
    setResidencias([
      { id: 1, unidad_codigo: 'A-101' },
      { id: 2, unidad_codigo: 'A-102' },
      { id: 3, unidad_codigo: 'B-201' },
    ]);

    setAreasComunes([
      { id: 1, nombre: 'Piscina' },
      { id: 2, nombre: 'Gimnasio' },
      { id: 3, nombre: 'Salón Social' },
      { id: 4, nombre: 'Estacionamiento' },
    ]);
  };

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

  const styles = {
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    label: {
      fontWeight: '600',
      color: '#333',
      fontSize: '14px',
    },
    input: {
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '14px',
      transition: 'border-color 0.3s ease',
    },
    textarea: {
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '14px',
      minHeight: '100px',
      resize: 'vertical',
      fontFamily: 'inherit',
    },
    select: {
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '14px',
      backgroundColor: 'white',
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
      marginTop: '20px',
    },
    submitButton: {
      padding: '12px 24px',
      background: '#2ab77d',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    cancelButton: {
      padding: '12px 24px',
      background: '#6c757d',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Título *</label>
        <input
          type="text"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          style={styles.input}
          required
          placeholder="Ingrese el título de la tarea"
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Descripción *</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          style={styles.textarea}
          required
          placeholder="Describa la tarea en detalle..."
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Tipo</label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="ordinaria">Ordinaria</option>
            <option value="extraordinaria">Extraordinaria</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Rol Asignado *</label>
          <select
            name="asignado_rol"
            value={formData.asignado_rol}
            onChange={handleChange}
            style={styles.select}
            required
          >
            <option value="">Seleccione un rol</option>
            {roles.map(rol => (
              <option key={rol.id} value={rol.id}>
                {rol.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Prioridad</label>
          <select
            name="prioridad"
            value={formData.prioridad}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
            <option value="urgente">Urgente</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Fecha Límite</label>
          <input
            type="date"
            name="fecha_limite"
            value={formData.fecha_limite}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Residencia (Opcional)</label>
          <select
            name="residencia"
            value={formData.residencia}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="">Seleccione una residencia</option>
            {residencias.map(residencia => (
              <option key={residencia.id} value={residencia.id}>
                {residencia.unidad_codigo}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Área Común (Opcional)</label>
          <select
            name="area_comun"
            value={formData.area_comun}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="">Seleccione un área común</option>
            {areasComunes.map(area => (
              <option key={area.id} value={area.id}>
                {area.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={styles.buttonGroup}>
        <button
          type="button"
          onClick={onCancel}
          style={styles.cancelButton}
        >
          Cancelar
        </button>
        <button
          type="submit"
          style={styles.submitButton}
        >
          {tarea ? 'Actualizar' : 'Crear'} Tarea
        </button>
      </div>
    </form>
  );
};

export default TareaForm;