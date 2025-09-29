// src/components/admin/AreaComunCard.jsx (VERSION FINAL Y CORREGIDA DEL ERROR)

// 1. IMPORTAR/DEFINIR CONSTANTES DE COLOR
const PRIMARY_COLOR = '#2ab77d';
const HOVER_COLOR = '#239a67';
const TEXT_COLOR = '#333333';
const LIGHT_TEXT_COLOR = '#666666';
const BORDER_COLOR = '#eeeeee';
const INFO_COLOR = '#007bff'; // Azul para info como costo
const BACKGROUND_COLOR = '#fcfcfc'; // <<-- ESTA FALTABA Y CAUSABA EL ERROR

const AreaComunCard = ({ area, onEdit, onDelete, onViewDetails }) => {
  
  const getEstadoColor = (estado) => {
    const colors = {
      disponible: PRIMARY_COLOR,     
      mantenimiento: '#ffc107',      
    };
    return colors[estado] || '#6c757d';
  };

  const getTipoIcon = (tipo) => {
    const icons = {
      piscina: '🏊',
      salon_eventos: '🎉',
      gimnasio: '💪',
      parrilla: '🍖',
      cancha: '⚽',
      meeting: '💼',
      study: '📚',
      otro: '🏢'
    };
    return icons[tipo] || '🏢';
  };

  const formatHorario = (apertura, cierre) => {
    const cleanTime = (time) => time ? time.substring(0, 5) : '--:--';
    return `${cleanTime(apertura)} - ${cleanTime(cierre)}`;
  };

  const formatCosto = (costo) => {
    return `$${parseFloat(costo).toFixed(2)}`;
  };
  
  const cardStyle = {
    border: `1px solid ${BORDER_COLOR}`,
    borderRadius: '10px',
    padding: '0', 
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
    backgroundColor: 'white',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
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
      onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.05)';
      }}
      onClick={onViewDetails}
    >
      {/* 1. Icono del tipo de área */}
      <div style={{
        height: '80px',
        backgroundColor: BACKGROUND_COLOR, // <<-- AHORA ESTÁ DEFINIDO
        borderRadius: '10px 10px 0 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '48px',
        borderBottom: `1px solid ${BORDER_COLOR}`
      }}>
        {getTipoIcon(area.tipo)}
      </div>

      {/* 2. Información y contenido */}
      <div style={{ padding: '15px' }}> 
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
          <h4 style={{ margin: 0, fontSize: '1.2rem', color: TEXT_COLOR }}>{area.nombre}</h4>
          <span style={{
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 'bold',
            backgroundColor: getEstadoColor(area.estado),
            color: 'white',
            textTransform: 'uppercase'
          }}>
            {area.estado_display || area.estado}
          </span>
        </div>

        <p style={{ margin: '5px 0 10px 0', color: LIGHT_TEXT_COLOR, fontSize: '0.9rem' }}>
          **Tipo:** {area.tipo_display || area.tipo}
        </p>

        {area.descripcion && (
          <p style={{ 
            margin: '5px 0', 
            fontSize: '14px', 
            color: LIGHT_TEXT_COLOR,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical',
          }}>
            {area.descripcion}
          </p>
        )}
        
        {/* Detalles */}
        <div style={{ fontSize: '0.9rem', color: TEXT_COLOR, marginTop: '10px', borderTop: `1px dashed ${BORDER_COLOR}`, paddingTop: '10px' }}>
            <p style={{ margin: '3px 0' }}>
                **Capacidad:** {area.capacidad} personas
            </p>
            <p style={{ margin: '3px 0' }}>
                **Horario:** {formatHorario(area.hora_apertura, area.hora_cierre)}
            </p>
            <p style={{ margin: '3px 0' }}>
                **Acceso:** {area.permitido_para_inquilinos ? '✅ Inquilinos' : '❌ Solo Adm.'}
            </p>
        </div>

        {/* Costo */}
        <div style={{ marginTop: '10px' }}>
            {area.tiene_costo ? (
                <div style={{fontSize: '0.95rem', color: INFO_COLOR, fontWeight: '500'}}>
                    <p style={{ margin: '3px 0' }}>
                        **Costo Normal:** {formatCosto(area.costo_normal)}
                    </p>
                    <p style={{ margin: '3px 0' }}>
                        **Costo FDS:** {formatCosto(area.costo_fin_semana)}
                    </p>
                </div>
            ) : (
                <p style={{ margin: '5px 0', fontSize: '0.95rem', color: PRIMARY_COLOR, fontWeight: '600' }}>
                    Gratuita
                </p>
            )}
        </div>


        {/* Botones de acción */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(area); }}
            style={{
              ...buttonBaseStyle,
              flex: 1,
              background: INFO_COLOR,
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = INFO_COLOR}
          >
            Editar
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(area); }}
            style={{
              ...buttonBaseStyle,
              flex: 1,
              background: area.esta_activa ? '#dc3545' : PRIMARY_COLOR,
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = area.esta_activa ? '#c82333' : HOVER_COLOR}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = area.esta_activa ? '#dc3545' : PRIMARY_COLOR}
          >
            {area.esta_activa ? 'Desactivar' : 'Activar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AreaComunCard;