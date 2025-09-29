// src/components/admin/AreaComunForm.jsx
import { useState, useEffect } from 'react';

const AreaComunForm = ({ area, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    descripcion: '',
    capacidad: 10,
    hora_apertura: '08:00',
    hora_cierre: '22:00',
    tiene_costo: false,
    costo_normal: '0.00',
    costo_fin_semana: '0.00',
    permitido_para_inquilinos: true,
    estado: 'disponible'
  });

  const [showCostos, setShowCostos] = useState(false);

  useEffect(() => {
    if (area) {
      setFormData({
        nombre: area.nombre || '',
        tipo: area.tipo || '',
        descripcion: area.descripcion || '',
        capacidad: area.capacidad || 10,
        hora_apertura: area.hora_apertura || '08:00',
        hora_cierre: area.hora_cierre || '22:00',
        tiene_costo: area.tiene_costo || false,
        costo_normal: area.costo_normal || '0.00',
        costo_fin_semana: area.costo_fin_semana || '0.00',
        permitido_para_inquilinos: area.permitido_para_inquilinos !== undefined ? area.permitido_para_inquilinos : true,
        estado: area.estado || 'disponible'
      });
      
      setShowCostos(area.tiene_costo || false);
    }
  }, [area]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'tiene_costo') {
      setShowCostos(checked);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Limpiar campos de costo si no tiene costo
    const cleanedData = { ...formData };
    if (!cleanedData.tiene_costo) {
      cleanedData.costo_normal = '0.00';
      cleanedData.costo_fin_semana = '0.00';
    }
    
    onSubmit(cleanedData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '500px' }}>
      {/* Nombre */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Nombre del Área *
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

      {/* Tipo de Área */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Tipo de Área *
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
          <option value="piscina">Piscina</option>
          <option value="salon_eventos">Salón de Eventos</option>
          <option value="gimnasio">Gimnasio</option>
          <option value="parrilla">Quincho/Parrilla</option>
          <option value="cancha">Cancha Deportiva</option>
          <option value="meeting">Meeting Room</option>
          <option value="study">Study Room</option>
          <option value="otro">Otro</option>
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

      {/* Capacidad y Horarios */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Capacidad *
          </label>
          <input
            type="number"
            name="capacidad"
            value={formData.capacidad}
            onChange={handleChange}
            min="1"
            required
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Hora Apertura
          </label>
          <input
            type="time"
            name="hora_apertura"
            value={formData.hora_apertura}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Hora Cierre
          </label>
          <input
            type="time"
            name="hora_cierre"
            value={formData.hora_cierre}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
      </div>

      {/* Sistema de Costos */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            name="tiene_costo"
            checked={formData.tiene_costo}
            onChange={handleChange}
          />
          <span style={{ fontWeight: 'bold' }}>¿Tiene costo de reserva?</span>
        </label>
      </div>

      {showCostos && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Costo Normal ($)
            </label>
            <input
              type="number"
              name="costo_normal"
              value={formData.costo_normal}
              onChange={handleChange}
              step="0.01"
              min="0"
              required={showCostos}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Costo Fin de Semana ($)
            </label>
            <input
              type="number"
              name="costo_fin_semana"
              value={formData.costo_fin_semana}
              onChange={handleChange}
              step="0.01"
              min="0"
              required={showCostos}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>
        </div>
      )}

      {/* Restricciones */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            name="permitido_para_inquilinos"
            checked={formData.permitido_para_inquilinos}
            onChange={handleChange}
          />
          <span style={{ fontWeight: 'bold' }}>Permitido para inquilinos</span>
        </label>
      </div>

      {/* Estado */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Estado
        </label>
        <select
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        >
          <option value="disponible">Disponible</option>
          <option value="mantenimiento">En Mantenimiento</option>
        </select>
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
          {area ? 'Actualizar' : 'Crear'} Área
        </button>
      </div>
    </form>
  );
};

export default AreaComunForm;