// src/components/shared/DataTable.jsx
import { useState } from 'react';

const DataTable = ({ 
  data, 
  columns, 
  onEdit, 
  onDelete,
  loading = false 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (loading) {
    return <div>Cargando datos...</div>;
  }

  if (!data || data.length === 0) {
    return <div>No hay datos para mostrar</div>;
  }

  // Calcular datos para la paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div>
      {/* Tabla */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            {columns.map((column, index) => (
              <th 
                key={index}
                style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  borderBottom: '2px solid #ddd',
                  fontWeight: 'bold'
                }}
              >
                {column.header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Acciones</th>
            )}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, rowIndex) => (
            <tr key={rowIndex} style={{ borderBottom: '1px solid #ddd' }}>
              {columns.map((column, colIndex) => (
                <td key={colIndex} style={{ padding: '12px' }}>
                  {column.render ? column.render(item) : item[column.key]}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        style={{
                          padding: '6px 12px',
                          background: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Editar
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        style={{
                          padding: '6px 12px',
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            style={{
              padding: '8px 16px',
              background: currentPage === 1 ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Anterior
          </button>
          
          <span style={{ padding: '8px 16px', alignSelf: 'center' }}>
            Página {currentPage} de {totalPages}
          </span>
          
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            style={{
              padding: '8px 16px',
              background: currentPage === totalPages ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default DataTable;