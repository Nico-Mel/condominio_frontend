// src/pages/admin/CuotasManagementPage.jsx
import { useState, useEffect } from 'react';
// Asumiendo que estos servicios y componentes existen en tu proyecto
import { cuotaService } from '../../services/cuotaService';
import { pagoService } from '../../services/pagoService';
import Modal from '../../components/shared/Modal';

// --- Definición de Estilos (Similar a ResidenciasManagementPage) ---
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: 'Segoe UI, sans-serif',
    color: '#333',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    borderBottom: '1px solid #eee',
    paddingBottom: '15px'
  },
  title: {
    fontSize: '2rem',
    marginBottom: '0.3rem',
    color: '#007bff'
  },
  subtitle: {
    fontSize: '1rem',
    color: '#666',
  },
  addButton: {
    padding: '0.8rem 1.5rem',
    background: '#2ab77d', // Verde limpio para acciones primarias
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  buttonSuccess: {
    background: '#2ab77d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 20px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  buttonSecondary: {
    background: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 20px',
    cursor: 'pointer',
  }
};

// --- Componente Principal ---
const CuotasManagementPage = () => {
  const [cuotas, setCuotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGenerarModal, setShowGenerarModal] = useState(false);
  const [showDetallesModal, setShowDetallesModal] = useState(false);
  const [showPagoModal, setShowPagoModal] = useState(false);
  const [selectedCuota, setSelectedCuota] = useState(null);
  const [periodo, setPeriodo] = useState('');

  useEffect(() => {
    loadCuotas();
  }, []);

  // --- Lógica de Carga de Cuotas ---
  const loadCuotas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cuotaService.getAll();
      const sortedData = Array.isArray(data) ? data.sort((a, b) => (b.periodo || '').localeCompare(a.periodo || '')) : [];
      setCuotas(sortedData);
    } catch (error) {
      console.error('Error loading cuotas:', error);
      setError('Error al cargar las cuotas');
      setCuotas([]);
    } finally {
      setLoading(false);
    }
  };

  // --- Lógica de Generación de Cuotas ---
  const handleGenerarCuotas = async () => {
    if (!periodo || !/^\d{4}-\d{2}$/.test(periodo)) {
      alert('Por favor ingresa un período válido (YYYY-MM).');
      return;
    }

    try {
      await cuotaService.generarMensuales({ periodo });
      alert(`Cuotas para el período ${periodo} generadas exitosamente.`);
      loadCuotas();
      setShowGenerarModal(false);
      setPeriodo('');
    } catch (error) {
      console.error('Error generating cuotas:', error);
      alert('Error al generar las cuotas. Verifica que no existan ya para este período.');
    }
  };

  // --- Lógica para Registrar Pago ---
  const handleRealizarPago = async (pagoData) => {
    try {
      const montoPagado = parseFloat(pagoData.monto_pagado);
      const maxMonto = parseFloat(selectedCuota?.monto_pendiente);
      
      if (isNaN(montoPagado) || montoPagado <= 0) {
        alert('El monto a pagar debe ser un número positivo.');
        return;
      }
      
      // Margen por precisión de float
      if (montoPagado > maxMonto + 0.001) { 
         alert(`El monto a pagar no puede exceder el monto pendiente: $${maxMonto.toFixed(2)}`);
         return;
      }

      const payload = {
        cuota_id: pagoData.cuota,
        residente_uuid: pagoData.residente_uuid,
        monto: montoPagado,
        metodo_pago: pagoData.metodo_pago,
      };
      
      await pagoService.realizarPago(payload);
      alert('Pago registrado exitosamente.');
      setShowPagoModal(false);
      setSelectedCuota(null);
      loadCuotas();
    } catch (error) {
      console.error('Error realizando pago:', error);
      alert(`Error al registrar el pago: ${error.message || 'Error desconocido'}`);
    }
  };

  // --- Función de Estilo para el Estado ---
  const getEstadoStyle = (estado) => {
    const style = {
      padding: '6px 10px',
      borderRadius: '15px',
      fontSize: '12px',
      color: 'white',
      fontWeight: '500',
      textAlign: 'center'
    };
    
    const colors = {
      pendiente: { backgroundColor: '#dc3545' }, // Rojo
      pagado: { backgroundColor: '#2ab77d' }, // Verde similar a los botones
      parcial: { backgroundColor: '#ffc107', color: '#333' } // Amarillo
    };
    return { ...style, ...colors[estado] };
  };

  // --- Carga y Error UI ---
  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando cuotas...</div>;
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={{ background: '#f8d7da', color: '#721c24', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
        </div>
        <button onClick={loadCuotas} style={{...styles.buttonSecondary, background: '#007bff'}}>
          Reintentar
        </button>
      </div>
    );
  }

  // --- Renderizado Principal ---
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Gestión de Cuotas</h1>
          <p style={styles.subtitle}>Listado y generación de cuotas de expensas.</p>
        </div>
        <button
          onClick={() => setShowGenerarModal(true)}
          style={styles.addButton}
        >
          Generar Cuotas Mensuales
        </button>
      </div>

      {cuotas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#666', border: '1px dashed #ddd', borderRadius: '8px' }}>
          <p style={{ fontSize: '1.1em', marginBottom: '20px' }}>No hay cuotas registradas. Use el botón superior para generar el primer período.</p>
          <button
            onClick={() => setShowGenerarModal(true)}
            style={{ ...styles.buttonSuccess, background: '#007bff' }}
          >
            Generar cuotas mensuales
          </button>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', marginTop: '20px' }}>
          {/* Tabla manual de cuotas con mejor estilo */}
          <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'separate', borderSpacing: '0', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <thead>
              <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                <th style={{ padding: '15px', textAlign: 'left' }}>Residencia</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Período</th>
                <th style={{ padding: '15px', textAlign: 'right' }}>Monto Total</th>
                <th style={{ padding: '15px', textAlign: 'right' }}>Monto Pendiente</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Pagos</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Estado</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Fecha Emisión</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cuotas.map((cuota, index) => (
                <tr 
                  key={cuota.id} 
                  style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa' }}
                >
                  <td style={{ padding: '12px 15px', borderBottom: '1px solid #eee' }}>
                    <div style={{ fontWeight: 'bold' }}>{cuota.residencia}</div>
                    <small style={{ color: '#6c757d' }}>{cuota.residente_nombre || 'Sin residente'}</small>
                  </td>
                  <td style={{ padding: '12px 15px', borderBottom: '1px solid #eee' }}>{cuota.periodo}</td>
                  <td style={{ padding: '12px 15px', borderBottom: '1px solid #eee', textAlign: 'right', fontWeight: 'bold' }}>${parseFloat(cuota.monto_total).toFixed(2)}</td>
                  <td style={{ padding: '12px 15px', borderBottom: '1px solid #eee', textAlign: 'right', color: parseFloat(cuota.monto_pendiente) > 0 ? '#dc3545' : '#2ab77d' }}>${parseFloat(cuota.monto_pendiente).toFixed(2)}</td>
                  <td style={{ padding: '12px 15px', borderBottom: '1px solid #eee', textAlign: 'center' }}>{cuota.pagos_realizados || 0}</td>
                  <td style={{ padding: '12px 15px', borderBottom: '1px solid #eee', textAlign: 'center' }}>
                    <span style={getEstadoStyle(cuota.estado)}>
                      {cuota.estado.charAt(0).toUpperCase() + cuota.estado.slice(1)}
                    </span>
                  </td>
                  <td style={{ padding: '12px 15px', borderBottom: '1px solid #eee' }}>
                    {cuota.fecha_emision ? new Date(cuota.fecha_emision).toLocaleDateString('es-ES') : 'N/A'}
                  </td>
                  <td style={{ padding: '12px 15px', borderBottom: '1px solid #eee', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={() => {
                          setSelectedCuota(cuota);
                          setShowDetallesModal(true);
                        }}
                        style={{ padding: '6px 10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}
                      >
                        Detalles
                      </button>
                      {cuota.estado !== 'pagado' && parseFloat(cuota.monto_pendiente) > 0 && (
                        <button
                          onClick={() => {
                            setSelectedCuota(cuota);
                            setShowPagoModal(true);
                          }}
                          style={{ padding: '6px 10px', background: '#2ab77d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}
                        >
                          Pagar
                        </button>
                      )}
                  </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal para generar cuotas */}
      <Modal
        isOpen={showGenerarModal}
        onClose={() => { setShowGenerarModal(false); setPeriodo(''); }}
        title="Generar Cuotas Mensuales"
      >
        <div style={{ padding: '20px', width: '400px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="periodo-input" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Período (YYYY-MM)
            </label>
            <input
              id="periodo-input"
              type="text"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              pattern="\d{4}-\d{2}"
              placeholder="Ej: 2024-01"
              required
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
             <small style={{ color: '#6c757d', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                Formato: Año-Mes (Ej: 2024-01)
             </small>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '15px', borderTop: '1px solid #eee' }}>
            <button
              onClick={() => { setShowGenerarModal(false); setPeriodo(''); }}
              style={styles.buttonSecondary}
            >
              Cancelar
            </button>
            <button
              onClick={handleGenerarCuotas}
              style={styles.buttonSuccess}
            >
              Generar Cuotas
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal para ver detalles */}
      <Modal
        isOpen={showDetallesModal}
        onClose={() => { setShowDetallesModal(false); setSelectedCuota(null); }}
        title={`Detalles de Cuota - ${selectedCuota?.residencia || ''} (${selectedCuota?.periodo || ''})`}
        size="large"
      >
        <div style={{ padding: '20px', minWidth: '700px' }}>
          {selectedCuota && (
            <div style={{ marginBottom: '25px', padding: '15px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #ddd' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
                <div>
                  <strong style={{ color: '#666', display: 'block', marginBottom: '3px' }}>Residente:</strong> 
                  {selectedCuota.residente_nombre || 'N/A'}
                </div>
                <div>
                  <strong style={{ color: '#666', display: 'block', marginBottom: '3px' }}>Monto Total:</strong> 
                  ${parseFloat(selectedCuota.monto_total).toFixed(2)}
                </div>
                <div>
                  <strong style={{ color: '#666', display: 'block', marginBottom: '3px' }}>Monto Pendiente:</strong> 
                  <span style={{ color: parseFloat(selectedCuota.monto_pendiente) > 0 ? '#dc3545' : '#2ab77d', fontWeight: 'bold' }}>${parseFloat(selectedCuota.monto_pendiente).toFixed(2)}</span>
                </div>
                <div>
                  <strong style={{ color: '#666', display: 'block', marginBottom: '3px' }}>Estado:</strong> 
                  <span style={getEstadoStyle(selectedCuota.estado)}>
                    {selectedCuota.estado.charAt(0).toUpperCase() + selectedCuota.estado.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '15px', color: '#333' }}>Componentes de la Cuota</h3>

          {/* Tabla manual de detalles */}
          {selectedCuota?.detalles && selectedCuota.detalles.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '12px', borderBottom: '2px solid #ddd', textAlign: 'left', color: '#007bff' }}>Expensa</th>
                  <th style={{ padding: '12px', borderBottom: '2px solid #ddd', textAlign: 'left', color: '#007bff' }}>Tipo</th>
                  <th style={{ padding: '12px', borderBottom: '2px solid #ddd', textAlign: 'right', color: '#007bff' }}>Monto</th>
                  <th style={{ padding: '12px', borderBottom: '2px solid #ddd', textAlign: 'left', color: '#007bff' }}>Descripción/Referencia</th>
                </tr>
              </thead>
              <tbody>
                {selectedCuota.detalles.map((detalle, index) => (
                  <tr key={detalle.id || index} style={{ borderBottom: '1px solid #eee', backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa' }}>
                    <td style={{ padding: '12px' }}>{detalle.expensa_nombre}</td>
                    <td style={{ padding: '12px' }}>
                      {detalle.expensa_tipo.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: '500' }}>${parseFloat(detalle.monto).toFixed(2)}</td>
                    <td style={{ padding: '12px', color: '#666' }}>
                      {detalle.descripcion || detalle.referencia || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ textAlign: 'center', color: '#856404', padding: '20px', background: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '4px' }}>
              No hay detalles de componentes para esta cuota.
            </p>
          )}
          
          <div style={{ marginTop: '30px', textAlign: 'right', borderTop: '1px solid #eee', paddingTop: '15px' }}>
            <button
              onClick={() => { setShowDetallesModal(false); setSelectedCuota(null); }}
              style={styles.buttonSecondary}
            >
              Cerrar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal para registrar pago */}
      <Modal
        isOpen={showPagoModal}
        onClose={() => { setShowPagoModal(false); setSelectedCuota(null); }}
        title={`Registrar Pago - Cuota ${selectedCuota?.residencia || ''}/${selectedCuota?.periodo || ''}`}
      >
        {selectedCuota && (
          <PagoForm
            cuota={selectedCuota}
            onSubmit={handleRealizarPago}
            onCancel={() => { setShowPagoModal(false); setSelectedCuota(null); }}
            buttonStyles={{ submit: styles.buttonSuccess, cancel: styles.buttonSecondary }}
          />
        )}
      </Modal>
    </div>
  );
};

// --- Componente simple para formulario de pago (Refactorizado) ---
const PagoForm = ({ cuota, onSubmit, onCancel, buttonStyles }) => {
  const maxMonto = parseFloat(cuota?.monto_pendiente || cuota?.monto_total || 0).toFixed(2);

  const [formData, setFormData] = useState({
    monto_pagado: maxMonto,
    metodo_pago: 'transferencia'
  });

  useEffect(() => {
    if (cuota) {
      const newMaxMonto = parseFloat(cuota.monto_pendiente || cuota.monto_total || 0).toFixed(2);
      setFormData(prev => ({
        ...prev,
        monto_pagado: newMaxMonto,
      }));
    }
  }, [cuota]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const montoInput = parseFloat(formData.monto_pagado);
    const maxInput = parseFloat(maxMonto);

    if (isNaN(montoInput) || montoInput <= 0) {
      alert('Por favor, ingrese un monto válido mayor a cero.');
      return;
    }

    if (montoInput > maxInput + 0.001) {
      alert(`El monto a pagar (${montoInput.toFixed(2)}) no puede exceder el monto pendiente: $${maxInput}`);
      return;
    }
    
    onSubmit({
      cuota: cuota.id,
      residente_uuid: cuota.residente_uuid,
      ...formData
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '400px', padding: '20px' }}>
      {cuota && (
        <div style={{ marginBottom: '20px', padding: '15px', background: '#e9ecef', borderRadius: '4px', borderLeft: '3px solid #007bff' }}>
          <p style={{ margin: '5px 0' }}>**Residencia:** {cuota.residencia}</p>
          <p style={{ margin: '5px 0' }}>**Período:** {cuota.periodo}</p>
          <p style={{ margin: '5px 0' }}>**Monto Total:** ${parseFloat(cuota.monto_total).toFixed(2)}</p>
          <p style={{ margin: '5px 0', fontWeight: 'bold' }}>**Monto Pendiente:** ${maxMonto}</p>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="pago-monto" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Monto a Pagar
        </label>
        <input
          id="pago-monto"
          type="number"
          name="monto_pagado"
          value={formData.monto_pagado}
          onChange={handleChange}
          step="0.01"
          min="0.01"
          max={maxMonto}
          required
          style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <small style={{ color: '#6c757d', fontSize: '12px', marginTop: '5px', display: 'block' }}>
          Máximo: ${maxMonto}
        </small>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <label htmlFor="pago-metodo" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Método de Pago
        </label>
        <select
          id="pago-metodo"
          name="metodo_pago"
          value={formData.metodo_pago}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
        >
          <option value="efectivo">Efectivo</option>
          <option value="transferencia">Transferencia</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '1px solid #eee', paddingTop: '15px' }}>
        <button
          type="button"
          onClick={onCancel}
          style={buttonStyles.cancel}
        >
          Cancelar
        </button>
        <button
          type="submit"
          style={buttonStyles.submit}
        >
          Registrar Pago
        </button>
      </div>
    </form>
  );
};

export default CuotasManagementPage;