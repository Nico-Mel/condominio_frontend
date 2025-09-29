// src/components/admin/ExpensaCard.jsx
const ExpensaCard = ({ expensa, onEdit, onDelete, onViewDetails }) => {
  const getTipoColor = (tipo) => {
    const colors = {
      alquiler: '#007bff',
      reserva_area: '#28a745',
      expensa_ordinaria: '#6c757d',
      multa: '#dc3545',
      servicio: '#ffc107'
    };
    return colors[tipo] || '#6c757d';
  };

  const getTipoIcon = (tipo) => {
    const icons = {
      alquiler: '🏠',
      reserva_area: '🏊',
      expensa_ordinaria: '💰',
      multa: '⚠️',
      servicio: '🔧'
    };
    return icons[tipo] || '💰';
  };

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '10px',
      padding: '15px',
      margin: '10px',
      width: '280px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s',
      cursor: 'pointer',
      backgroundColor: 'white'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    onClick={onViewDetails}
    >
      {/* Header con nombre y estado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
        <h4 style={{ margin: 0, fontSize: '16px' }}>{expensa.nombre}</h4>
        <span style={{
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '10px',
          backgroundColor: expensa.es_activo ? '#28a745' : '#6c757d',
          color: 'white'
        }}>
          {expensa.es_activo ? 'Activo' : 'Inactivo'}
        </span>
      </div>

      {/* Tipo de expensa */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <span style={{ fontSize: '20px' }}>{getTipoIcon(expensa.tipo)}</span>
        <span style={{
          padding: '2px 6px',
          borderRadius: '8px',
          fontSize: '11px',
          backgroundColor: getTipoColor(expensa.tipo),
          color: 'white'
        }}>
          {expensa.tipo_display || expensa.tipo}
        </span>
      </div>

      {/* Descripción */}
      {expensa.descripcion && (
        <p style={{ 
          margin: '5px 0', 
          fontSize: '12px', 
          color: '#666',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {expensa.descripcion}
        </p>
      )}

      {/* Botones de acción */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(expensa);
          }}
          style={{
            flex: 1,
            padding: '6px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Editar
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(expensa);
          }}
          style={{
            flex: 1,
            padding: '6px',
            background: expensa.es_activo ? '#dc3545' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          {expensa.es_activo ? 'Desactivar' : 'Activar'}
        </button>
      </div>
    </div>
  );
};

export default ExpensaCard;