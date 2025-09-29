// src/components/admin/ExpensaForm.jsx
import { useState, useEffect } from 'react';

const ExpensaForm = ({ expensa, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    descripcion: '',
    es_activo: true
  });

  useEffect(() => {
    if (expensa) {
      setFormData({
        nombre: expensa.nombre || '',
        tipo: expensa.tipo || '',
        descripcion: expensa.descripcion || '',
        es_activo: expensa.es_activo !== undefined ? expensa.es_activo : true
      });
    }
  }, [expensa]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '500px' }}>
      {/* Nombre */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Nombre de la Expensa *
        </label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </div>

      {/* Tipo de Expensa */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Tipo de Expensa *
        </label>
        <select
          name="tipo"
          value={formData.tipo}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        >
          <option value="">Seleccionar tipo</option>
          <option value="alquiler">Alquiler</option>
          <option value="reserva_area">Reserva de Área Común</option>
          <option value="expensa_ordinaria">Expensa Ordinaria</option>
          <option value="multa">Multa</option>
          <option value="servicio">Servicio</option>
        </select>
      </div>

      {/* Descripción */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Descripción
        </label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows="3"
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            resize: 'vertical'
          }}
        />
      </div>

      {/* Estado activo */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            name="es_activo"
            checked={formData.es_activo}
            onChange={handleChange}
          />
          <span style={{ fontWeight: 'bold' }}>Expensa activa</span>
        </label>
      </div>

      {/* Botones */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '10px 20px',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {expensa ? 'Actualizar' : 'Crear'} Expensa
        </button>
      </div>
    </form>
  );
};

export default ExpensaForm;