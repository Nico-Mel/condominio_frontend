// src/components/admin/ResidenciaForm.jsx - VERSIÓN COMPLETA Y CORREGIDA
import { useState, useEffect } from 'react';
import { unidadService } from '../../services/unidadService';
import { residenteService } from '../../services/residenteService';
import { residenciaService } from '../../services/residenciaService';
import { userService } from '../../services/userService';

const ResidenciaForm = ({ residencia, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    residente: '',
    unidad: '',
    tipo_contrato: 'propiedad',
    fecha_inicio: '',
    fecha_fin: '',
    esta_activa: true
  });

  const [unidades, setUnidades] = useState([]);
  const [residentes, setResidentes] = useState([]);
  const [filteredUnidades, setFilteredUnidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (residencia) {
      setFormData({
        residente: residencia.residente?.id || residencia.residente,
        unidad: residencia.unidad?.id || residencia.unidad,
        tipo_contrato: residencia.tipo_contrato || 'propiedad',
        fecha_inicio: residencia.fecha_inicio || '',
        fecha_fin: residencia.fecha_fin || '',
        esta_activa: residencia.esta_activa !== undefined ? residencia.esta_activa : true
      });
    }
  }, [residencia]);

  const loadData = async () => {
  try {
    setLoading(true);
    
    console.log('🔄 Cargando datos para formulario de residencia...');
    
    // Cargar unidades disponibles
    const unidadesData = await unidadService.getUnidades();
    const unidadesDisponibles = unidadesData.filter(u => 
      u.estado === 'disponible' && u.esta_activa
    );
    setUnidades(unidadesData);
    setFilteredUnidades(unidadesDisponibles);

    // Cargar residentes activos
    const residentesData = await residenteService.getResidentes();
    const residenciasData = await residenciaService.getResidencias();
    
    // Obtener IDs de residentes que YA tienen residencia activa
    const idsConResidencia = residenciasData
      .filter(r => r.esta_activa)
      .map(r => r.residente);
    
    console.log('🔒 IDs/UUIDs con residencia:', idsConResidencia);
    console.log('👥 Residentes crudos:', residentesData);
    
    // CARGAR INFORMACIÓN DE USUARIO PARA CADA RESIDENTE
    const residentesConUsuarioData = await Promise.all(
      residentesData.map(async (residente) => {
        try {
          // Cargar datos del usuario para este residente
          const usuarioData = await userService.getUserById(residente.usuario);
          console.log(`📊 Usuario data para residente ${residente.id}:`, usuarioData);
          
          return {
            ...residente,
            usuario_data: usuarioData
          };
        } catch (error) {
          console.error(`❌ Error cargando usuario para residente ${residente.id}:`, error);
          return residente; // Devolver residente sin usuario_data si hay error
        }
      })
    );
    
    console.log('👤 Residentes con usuario_data:', residentesConUsuarioData);
    
    // Filtrar residentes: activos (en usuario_data) Y sin residencia (por ID/UUID)
    const residentesDisponibles = residentesConUsuarioData.filter(r => {
      // El esta_activo está en usuario_data
      const usuarioActivo = r.usuario_data?.esta_activo !== false;
      
      // Verificar si este ID/UUID ya tiene residencia
      const tieneResidencia = idsConResidencia.includes(r.id);
      
      console.log(`👤 Residente ${r.id}:`, {
        nombre: `${r.usuario_data?.nombre} ${r.usuario_data?.apellido}`,
        ci: r.usuario_data?.ci,
        usuarioActivo: usuarioActivo,
        tieneResidencia: tieneResidencia,
        disponible: usuarioActivo && !tieneResidencia
      });
      
      return usuarioActivo && !tieneResidencia;
    });
    
    console.log('✅ Residentes disponibles (sin residencia):', residentesDisponibles);
    setResidentes(residentesDisponibles);

  } catch (error) {
    console.error('❌ Error cargando datos:', error);
    alert('Error al cargar los datos necesarios: ' + error.message);
  } finally {
    setLoading(false);
  }
};
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'tipo_contrato' && value === 'propiedad') {
      setFormData(prev => ({ ...prev, fecha_fin: '' }));
    }
  };

  const handleUnidadChange = (e) => {
    const unidadId = e.target.value;
    setFormData(prev => ({ ...prev, unidad: unidadId }));

    if (unidadId) {
      const unidadSeleccionada = unidades.find(u => u.id == unidadId);
      if (unidadSeleccionada && unidadSeleccionada.estado !== 'disponible') {
        alert('Esta unidad no está disponible. Por favor seleccione otra.');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.residente || !formData.unidad) {
      alert('Debe seleccionar residente y unidad');
      return;
    }

    if (!formData.fecha_inicio) {
      alert('La fecha de inicio es obligatoria');
      return;
    }

    if (formData.tipo_contrato !== 'propiedad' && !formData.fecha_fin) {
      alert('La fecha de fin es obligatoria para alquiler y comodato');
      return;
    }

    if (formData.fecha_fin && new Date(formData.fecha_fin) <= new Date(formData.fecha_inicio)) {
      alert('La fecha de fin debe ser posterior a la fecha de inicio');
      return;
    }

    // Preparar datos para enviar
    const datosParaEnviar = {
      residente: formData.residente,
      unidad: formData.unidad,
      tipo_contrato: formData.tipo_contrato,
      fecha_inicio: formData.fecha_inicio,
      fecha_fin: formData.fecha_fin || null, // Para propiedad, enviar null
      esta_activa: formData.esta_activa
    };

    console.log('📤 Enviando datos de residencia:', datosParaEnviar);
    onSubmit(datosParaEnviar);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div>Cargando datos...</div>
        <small>Espere mientras se cargan residentes y unidades</small>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
      {/* Residente */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Residente *
        </label>
<select
  name="residente"
  value={formData.residente}
  onChange={handleChange}
  required
  style={{
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px'
  }}
>
  <option value="">Seleccionar residente</option>
  {residentes.map(residente => {
    const nombre = residente.usuario_data?.nombre || 'N/A';
    const apellido = residente.usuario_data?.apellido || '';
    const ci = residente.usuario_data?.ci || 'Sin CI';
    
    return (
      <option key={residente.id} value={residente.id}>
      {apellido} - CI: {ci}
      </option>
    );
  })}
</select>
        {residentes.length === 0 ? (
          <small style={{ color: '#dc3545', display: 'block', marginTop: '5px' }}>
            No hay residentes activos disponibles sin residencia asignada.
          </small>
        ) : (
          <small style={{ color: '#28a745', display: 'block', marginTop: '5px' }}>
            {residentes.length} residente(s) disponible(s)
          </small>
        )}
      </div>

      {/* Unidad */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Unidad *
        </label>
        <select
          name="unidad"
          value={formData.unidad}
          onChange={handleUnidadChange}
          required
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        >
          <option value="">Seleccionar unidad</option>
          {filteredUnidades.map(unidad => (
            <option key={unidad.id} value={unidad.id}>
              {unidad.codigo} - {unidad.nombre || unidad.tipo_unidad_display} 
              {unidad.edificio && ` (${unidad.edificio})`}
            </option>
          ))}
        </select>
        {filteredUnidades.length === 0 ? (
          <small style={{ color: '#dc3545', display: 'block', marginTop: '5px' }}>
            No hay unidades disponibles. Primero debe crear unidades con estado "disponible".
          </small>
        ) : (
          <small style={{ color: '#28a745', display: 'block', marginTop: '5px' }}>
            {filteredUnidades.length} unidad(es) disponible(s)
          </small>
        )}
      </div>

      {/* Tipo de Contrato */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Tipo de Contrato *
        </label>
        <select
          name="tipo_contrato"
          value={formData.tipo_contrato}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        >
          <option value="propiedad">Propiedad</option>
          <option value="alquiler">Alquiler</option>
          <option value="comodato">Comodato</option>
        </select>
        <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
          {formData.tipo_contrato === 'propiedad' 
            ? 'Propiedad: Sin fecha de finalización' 
            : formData.tipo_contrato === 'alquiler' 
            ? 'Alquiler: Requiere fecha de finalización'
            : 'Comodato: Requiere fecha de finalización'}
        </small>
      </div>

      {/* Fechas */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Fecha Inicio *
          </label>
          <input
            type="date"
            name="fecha_inicio"
            value={formData.fecha_inicio}
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
        
        {formData.tipo_contrato !== 'propiedad' && (
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Fecha Fin *
            </label>
            <input
              type="date"
              name="fecha_fin"
              value={formData.fecha_fin}
              onChange={handleChange}
              required={formData.tipo_contrato !== 'propiedad'}
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

      {/* Estado */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            name="esta_activa"
            checked={formData.esta_activa}
            onChange={handleChange}
          />
          Residencia activa
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
          disabled={residentes.length === 0 || filteredUnidades.length === 0}
          style={{
            padding: '10px 20px',
            background: (residentes.length === 0 || filteredUnidades.length === 0) ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: (residentes.length === 0 || filteredUnidades.length === 0) ? 'not-allowed' : 'pointer'
          }}
        >
          {residencia ? 'Actualizar' : 'Crear'} Residencia
        </button>
      </div>
    </form>
  );
};

export default ResidenciaForm;