// src/components/admin/residenteForm.jsx - VERSIÓN SIMPLE Y FUNCIONAL
import { useState, useEffect } from 'react';

const ResidenteForm = ({ residente, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    tipo: '',
    telefono: '',
    contacto_emergencia_personal_nombre: '',
    contacto_emergencia_personal_telefono: '',
    contacto_emergencia_personal_parentesco: '',
    tiene_vehiculo: false,
    detalle_vehiculos: '',
    tiene_mascota: false,
    detalle_mascotas: '',
    fecha_ingreso: '',
    observaciones: ''
  });

  const [showVehiculoDetalle, setShowVehiculoDetalle] = useState(false);
  const [showMascotaDetalle, setShowMascotaDetalle] = useState(false);

  // ✅ SIMPLE Y FUNCIONAL: Cargar datos solo si residente existe
  useEffect(() => {
    if (residente) {
      console.log('📥 Cargando datos del residente:', residente);
      
      const fechaIngreso = residente.fecha_ingreso 
        ? residente.fecha_ingreso.split('T')[0]
        : '';
      
      setFormData({
        tipo: residente.tipo || '',
        telefono: residente.telefono || '',
        contacto_emergencia_personal_nombre: residente.contacto_emergencia_personal_nombre || '',
        contacto_emergencia_personal_telefono: residente.contacto_emergencia_personal_telefono || '',
        contacto_emergencia_personal_parentesco: residente.contacto_emergencia_personal_parentesco || '',
        tiene_vehiculo: residente.tiene_vehiculo || false,
        detalle_vehiculos: residente.detalle_vehiculos || '',
        tiene_mascota: residente.tiene_mascota || false,
        detalle_mascotas: residente.detalle_mascotas || '',
        fecha_ingreso: fechaIngreso,
        observaciones: residente.observaciones || ''
      });

      setShowVehiculoDetalle(residente.tiene_vehiculo || false);
      setShowMascotaDetalle(residente.tiene_mascota || false);
    } else {
      // ✅ IMPORTANTE: Resetear formulario para creación
      console.log('🆕 Inicializando formulario para nuevo residente');
      setFormData({
        tipo: '',
        telefono: '',
        contacto_emergencia_personal_nombre: '',
        contacto_emergencia_personal_telefono: '',
        contacto_emergencia_personal_parentesco: '',
        tiene_vehiculo: false,
        detalle_vehiculos: '',
        tiene_mascota: false,
        detalle_mascotas: '',
        fecha_ingreso: '',
        observaciones: ''
      });
      setShowVehiculoDetalle(false);
      setShowMascotaDetalle(false);
    }
  }, [residente]); // ✅ Solo dependencia de residente

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'tiene_vehiculo') {
      setShowVehiculoDetalle(checked);
    }
    
    if (name === 'tiene_mascota') {
      setShowMascotaDetalle(checked);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('📤 Enviando datos de residente:', formData);
    
    const cleanedData = { ...formData };
    
    if (!cleanedData.tiene_vehiculo) {
      cleanedData.detalle_vehiculos = '';
    }
    
    if (!cleanedData.tiene_mascota) {
      cleanedData.detalle_mascotas = '';
    }
    
    onSubmit(cleanedData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
      {/* Tipo de Residente */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Tipo de Residente *
        </label>
        <div style={{ display: 'flex', gap: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <input
              type="radio"
              name="tipo"
              value="copropietario"
              checked={formData.tipo === 'copropietario'}
              onChange={handleChange}
              required
            />
            Copropietario
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <input
              type="radio"
              name="tipo"
              value="inquilino"
              checked={formData.tipo === 'inquilino'}
              onChange={handleChange}
              required
            />
            Inquilino
          </label>
        </div>
      </div>

      {/* Teléfono */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Teléfono
        </label>
        <input
          type="text"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </div>

      {/* Contacto de Emergencia */}
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #eee', borderRadius: '5px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>
          CONTACTO DE EMERGENCIA
        </h4>
        
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Nombre
          </label>
          <input
            type="text"
            name="contacto_emergencia_personal_nombre"
            value={formData.contacto_emergencia_personal_nombre}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Teléfono
          </label>
          <input
            type="text"
            name="contacto_emergencia_personal_telefono"
            value={formData.contacto_emergencia_personal_telefono}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Parentesco
          </label>
          <input
            type="text"
            name="contacto_emergencia_personal_parentesco"
            value={formData.contacto_emergencia_personal_parentesco}
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

      {/* Vehículo */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <input
            type="checkbox"
            name="tiene_vehiculo"
            checked={formData.tiene_vehiculo}
            onChange={handleChange}
          />
          <span style={{ fontWeight: 'bold' }}>Tiene vehículo</span>
        </label>
        
        {showVehiculoDetalle && (
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Detalles del vehículo
            </label>
            <input
              type="text"
              name="detalle_vehiculos"
              value={formData.detalle_vehiculos}
              onChange={handleChange}
              placeholder="Modelo, color, patente"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>
        )}
      </div>

      {/* Mascota */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <input
            type="checkbox"
            name="tiene_mascota"
            checked={formData.tiene_mascota}
            onChange={handleChange}
          />
          <span style={{ fontWeight: 'bold' }}>Tiene mascota</span>
        </label>
        
        {showMascotaDetalle && (
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Detalles de la mascota
            </label>
            <input
              type="text"
              name="detalle_mascotas"
              value={formData.detalle_mascotas}
              onChange={handleChange}
              placeholder="Tipo, raza, nombre"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>
        )}
      </div>

      {/* Fecha de ingreso */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Fecha de ingreso
        </label>
        <input
          type="date"
          name="fecha_ingreso"
          value={formData.fecha_ingreso}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </div>

      {/* Observaciones */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Observaciones
        </label>
        <textarea
          name="observaciones"
          value={formData.observaciones}
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
          {residente ? 'Actualizar' : 'Completar'} Perfil
        </button>
      </div>
    </form>
  );
};

export default ResidenteForm;