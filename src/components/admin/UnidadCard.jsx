// src/components/admin/UnidadCard.jsx (VERSION FINAL Y CORREGIDA)
const PRIMARY_COLOR = '#2ab77d';
const HOVER_COLOR = '#239a67';
const TEXT_COLOR = '#333333';
const LIGHT_TEXT_COLOR = '#666666';
const BORDER_COLOR = '#eeeeee';

const UnidadCard = ({ unidad, onEdit, onDelete, onViewDetails }) => {
  
  const getEstadoColor = (estado) => {
    const colors = {
      // Usamos la paleta de colores general para mejor consistencia
      disponible: PRIMARY_COLOR,     // Verde principal
      ocupada: '#dc3545',            // Rojo para ocupada
      mantenimiento: '#ffc107',      // Amarillo para mantenimiento
      reservada: '#17a2b8'           // Azul claro para reservada
    };
    return colors[estado] || '#6c757d';
  };

  const getTipoIcon = (tipo) => {
    const icons = {
      casa: '🏠',
      departamento: '🏢',
      local: '🏪',
      oficina: '🏢',
      otro: '📍'
    };
    return icons[tipo] || '📍';
  };

  const cardStyle = {
    border: `1px solid ${BORDER_COLOR}`,
    borderRadius: '10px',
    padding: '0', // Quitamos el padding del contenedor para ponerlo internamente
    // ❌ CRÍTICO: Eliminamos margin y width. El contenedor padre (Grid) gestiona esto.
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
    backgroundColor: 'white',
    overflow: 'hidden', // Asegura que la imagen no sobresalga
    display: 'flex',
    flexDirection: 'column'
  };

  const cardHoverStyle = {
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 15px rgba(0,0,0,0.1)'
  };

  const buttonBaseStyle = {
    padding: '8px',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'background-color 0.2s ease'
  };

  return (
    <div 
      style={cardStyle}
      onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHoverStyle)}
      onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle)}
      onClick={onViewDetails}
    >
      {/* 1. Imagen de la unidad (Altura reducida a 160px) */}
      <div style={{
        height: '160px', // Altura reducida
        backgroundColor: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {unidad.foto_url ? (
          <img 
            src={unidad.foto_url} 
            alt={unidad.nombre || unidad.codigo}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div style={{ textAlign: 'center', color: LIGHT_TEXT_COLOR }}>
            <div style={{ fontSize: '40px', marginBottom: '4px' }}>
              {getTipoIcon(unidad.tipo_unidad)}
            </div>
            <div style={{ fontSize: '0.9rem' }}>Sin imagen</div>
          </div>
        )}
      </div>

      {/* 2. Información y contenido (Añadimos el padding aquí) */}
      <div style={{ padding: '15px' }}> 
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h4 style={{ margin: 0, fontSize: '1.1rem', color: TEXT_COLOR }}>{unidad.codigo}</h4>
          <span style={{
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 'bold',
            backgroundColor: getEstadoColor(unidad.estado),
            color: 'white',
            textTransform: 'uppercase'
          }}>
            {unidad.estado_display || unidad.estado}
          </span>
        </div>

        {unidad.nombre && (
          <p style={{ margin: '5px 0', fontSize: '14px', fontWeight: 'bold', color: TEXT_COLOR }}>
            {unidad.nombre}
          </p>
        )}

        <p style={{ margin: '5px 0', color: LIGHT_TEXT_COLOR, fontSize: '0.9rem' }}>
          {getTipoIcon(unidad.tipo_unidad)} {unidad.tipo_unidad_display || unidad.tipo_unidad}
          {unidad.edificio && ` · ${unidad.edificio}`}
        </p>
        
        {/* Detalles */}
        <div style={{ fontSize: '0.9rem', color: LIGHT_TEXT_COLOR, marginTop: '10px', borderTop: `1px dashed ${BORDER_COLOR}`, paddingTop: '10px' }}>
            <p style={{ margin: '3px 0' }}>
                Piso/Dim: {unidad.piso || '-'} / {unidad.dimensiones || '-'}
            </p>
            <p style={{ margin: '3px 0' }}>
                Hab/Baños: {unidad.habitaciones || '-'} / {unidad.banios || '-'}
            </p>
        </div>

        {/* Precios */}
        <div style={{ marginTop: '10px' }}>
            {unidad.precio_alquiler && (
                <p style={{ margin: '3px 0', fontSize: '1rem', color: PRIMARY_COLOR }}>
                    **Alquiler:** **{unidad.precio_alquiler_formateado || `$${unidad.precio_alquiler}`}**
                </p>
            )}

            {unidad.precio_venta && (
                <p style={{ margin: '3px 0', fontSize: '1rem', color: '#007bff' }}>
                    **Venta:** **{unidad.precio_venta_formateado || `$${unidad.precio_venta}`}**
                </p>
            )}
        </div>

        {/* Botones de acción */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(unidad);
            }}
            style={{
              ...buttonBaseStyle,
              flex: 1,
              background: '#007bff',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0069d9'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
          >
            Editar
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(unidad);
            }}
            style={{
              ...buttonBaseStyle,
              flex: 1,
              background: unidad.esta_activa ? '#dc3545' : PRIMARY_COLOR,
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = unidad.esta_activa ? '#c82333' : HOVER_COLOR}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = unidad.esta_activa ? '#dc3545' : PRIMARY_COLOR}
          >
            {unidad.esta_activa ? 'Desactivar' : 'Activar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnidadCard;