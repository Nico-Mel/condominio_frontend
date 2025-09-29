// src/components/admin/UnidadForm.jsx - ARREGLAR SCROLL
import { useState, useEffect } from 'react';

const UnidadForm = ({ unidad, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    tipo_unidad: '',
    codigo: '',
    nombre: '',
    edificio: '',
    piso: '',
    numero: '',
    dimensiones: '',
    habitaciones: 1,
    banios: 1,
    precio_venta: '',
    precio_alquiler: '',
    ubicacion: '',
    caracteristicas: '',
    estado: 'disponible',
    foto_url: ''
  });

  const [showEdificioFields, setShowEdificioFields] = useState(false);

  useEffect(() => {
    if (unidad) {
      setFormData({
        tipo_unidad: unidad.tipo_unidad || '',
        codigo: unidad.codigo || '',
        nombre: unidad.nombre || '',
        edificio: unidad.edificio || '',
        piso: unidad.piso || '',
        numero: unidad.numero || '',
        dimensiones: unidad.dimensiones || '',
        habitaciones: unidad.habitaciones || 1,
        banios: unidad.banios || 1,
        precio_venta: unidad.precio_venta || '',
        precio_alquiler: unidad.precio_alquiler || '',
        ubicacion: unidad.ubicacion || '',
        caracteristicas: unidad.caracteristicas || '',
        estado: unidad.estado || 'disponible',
        foto_url: unidad.foto_url || ''
      });
      
      setShowEdificioFields(['departamento', 'local', 'oficina'].includes(unidad.tipo_unidad));
    }
  }, [unidad]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (name === 'tipo_unidad') {
      setShowEdificioFields(['departamento', 'local', 'oficina'].includes(value));
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Limpiar campos de edificio si no son necesarios
    const cleanedData = { ...formData };
    if (!showEdificioFields) {
      cleanedData.edificio = '';
      cleanedData.piso = '';
      cleanedData.numero = '';
    }
    
    onSubmit(cleanedData);
  };

  return (
    // QUITAR maxHeight y overflowY del form para evitar scroll doble
    <form onSubmit={handleSubmit} style={{ width: '500px' }}>
      {/* Tipo de Unidad */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Tipo de Unidad *
        </label>
        <select
          name="tipo_unidad"
          value={formData.tipo_unidad}
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
          <option value="casa">Casa</option>
          <option value="departamento">Departamento</option>
          <option value="local">Local Comercial</option>
          <option value="oficina">Oficina</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      {/* Código y Nombre */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Código *
          </label>
          <input
            type="text"
            name="codigo"
            value={formData.codigo}
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
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Nombre
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
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

      {/* Campos de Edificio (condicionales) */}
      {showEdificioFields && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <div style={{ flex: 2 }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Edificio *
            </label>
            <input
              type="text"
              name="edificio"
              value={formData.edificio}
              onChange={handleChange}
              required={showEdificioFields}
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
              Piso
            </label>
            <input
              type="text"
              name="piso"
              value={formData.piso}
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
              Número *
            </label>
            <input
              type="text"
              name="numero"
              value={formData.numero}
              onChange={handleChange}
              required={showEdificioFields}
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

      {/* Dimensiones y Habitaciones */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Dimensiones *
          </label>
          <input
            type="text"
            name="dimensiones"
            value={formData.dimensiones}
            onChange={handleChange}
            required
            placeholder="Ej: 120m², 3x4m"
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
            Habitaciones
          </label>
          <input
            type="number"
            name="habitaciones"
            value={formData.habitaciones}
            onChange={handleChange}
            min="1"
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
            Baños
          </label>
          <input
            type="number"
            name="banios"
            value={formData.banios}
            onChange={handleChange}
            min="1"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
      </div>

      {/* Precios */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Precio Venta ($)
          </label>
          <input
            type="number"
            name="precio_venta"
            value={formData.precio_venta}
            onChange={handleChange}
            step="0.01"
            min="0"
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
            Precio Alquiler ($)
          </label>
          <input
            type="number"
            name="precio_alquiler"
            value={formData.precio_alquiler}
            onChange={handleChange}
            step="0.01"
            min="0"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
      </div>

      {/* Estado */}
      <div style={{ marginBottom: '15px' }}>
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
          <option value="ocupada">Ocupada</option>
          <option value="mantenimiento">En Mantenimiento</option>
          <option value="reservada">Reservada</option>
        </select>
      </div>

      {/* Ubicación */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Ubicación *
        </label>
        <textarea
          name="ubicacion"
          value={formData.ubicacion}
          onChange={handleChange}
          required
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

      {/* Características */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Características
        </label>
        <textarea
          name="caracteristicas"
          value={formData.caracteristicas}
          onChange={handleChange}
          rows="3"
          placeholder="Amenidades, características especiales..."
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            resize: 'vertical'
          }}
        />
      </div>

      {/* URL de Foto */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          URL de Foto
        </label>
        <input
          type="url"
          name="foto_url"
          value={formData.foto_url}
          onChange={handleChange}
          placeholder="https://ejemplo.com/foto.jpg"
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
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
          {unidad ? 'Actualizar' : 'Crear'} Unidad
        </button>
      </div>
    </form>
  );
};

export default UnidadForm;