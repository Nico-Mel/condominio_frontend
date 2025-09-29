// src/pages/admin/UnidadesManagementPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/shared/Modal';
import UnidadForm from '../../components/admin/UnidadForm';
import UnidadCard from '../../components/admin/UnidadCard';
import { unidadService } from '../../services/unidadService';

// PALETA DE COLORES MINIMALISTA AJUSTADA
const PRIMARY_COLOR = '#2ab77d'; // Verde principal
const HOVER_COLOR = '#239a67'; // Verde de hover
const BACKGROUND_COLOR = '#fcfcfc'; // Fondo de la página (casi blanco, muy sutil)
const CONTENT_BG_COLOR = '#ffffff'; // Fondo del contenido principal (blanco puro)
const TEXT_COLOR = '#333333'; // Texto principal
const LIGHT_TEXT_COLOR = '#666666'; // Texto secundario
const BORDER_COLOR = '#eeeeee'; // Borde ligero, más sutil
const SHADOW_COLOR = 'rgba(0,0,0,0.03)'; // Sombra más ligera

const UnidadesManagementPage = () => {
    const [unidades, setUnidades] = useState([]);
    const [filteredUnidades, setFilteredUnidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingUnidad, setEditingUnidad] = useState(null);
    const [filters, setFilters] = useState({
        tipo_unidad: '',
        estado: '',
        edificio: ''
    });
    const [viewMode, setViewMode] = useState('cards');
    const navigate = useNavigate();

    // Lógica de carga, filtrado, y manejo de acciones (sin cambios)
    useEffect(() => { loadUnidades(); }, []);
    useEffect(() => { filterUnidades(); }, [unidades, filters]);

    const loadUnidades = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await unidadService.getUnidades();
            const unidadesData = Array.isArray(data) ? data : [];
            setUnidades(unidadesData);
        } catch (error) {
            setError('Error al cargar las unidades: ' + (error.message || 'Error desconocido'));
            setUnidades([]);
        } finally {
            setLoading(false);
        }
    };

    const filterUnidades = () => {
        if (!unidades || !Array.isArray(unidades)) {
            setFilteredUnidades([]);
            return;
        }
        let filtered = [...unidades];
        if (filters.tipo_unidad) {
            filtered = filtered.filter(u => u.tipo_unidad === filters.tipo_unidad);
        }
        if (filters.estado) {
            filtered = filtered.filter(u => u.estado === filters.estado);
        }
        if (filters.edificio) {
            filtered = filtered.filter(u =>
                u.edificio && u.edificio.toLowerCase().includes(filters.edificio.toLowerCase())
            );
        }
        setFilteredUnidades(filtered);
    };

    const handleCreateUnidad = () => { setEditingUnidad(null); setShowModal(true); };
    const handleEdit = (unidad) => { setEditingUnidad(unidad); setShowModal(true); };
    const handleDelete = async (unidad) => {
        const action = unidad.esta_activa ? 'desactivar' : 'activar';
        if (window.confirm(`¿Estás seguro de ${action} la unidad ${unidad.codigo}?`)) {
            try {
                await unidadService.toggleUnidadActiva(unidad.id);
                alert(`Unidad ${action === 'activar' ? 'activada' : 'desactivada'} correctamente`);
                loadUnidades();
            } catch (error) {
                alert(`Error al ${action} la unidad: ${error.message}`);
            }
        }
    };
    const handleSubmitUnidad = async (unidadData) => {
        try {
            if (editingUnidad) {
                await unidadService.updateUnidad(editingUnidad.id, unidadData);
                alert('Unidad actualizada correctamente');
            } else {
                await unidadService.createUnidad(unidadData);
                alert('Unidad creada correctamente');
            }
            setShowModal(false);
            loadUnidades();
        } catch (error) {
            alert('Error al guardar la unidad: ' + error.message);
        }
    };
    const handleViewDetails = (unidad) => { console.log('Ver detalles:', unidad); };
    const handleFilterChange = (key, value) => { setFilters(prev => ({ ...prev, [key]: value })); };

    // Estilos para botones de acción uniformes
    const actionButtonStyle = (bgColor, isHover = false) => ({
        padding: '8px 15px', 
        background: isHover ? HOVER_COLOR : bgColor,
        color: 'white',
        border: 'none',
        borderRadius: '6px', 
        cursor: 'pointer',
        fontSize: '0.9rem', 
        transition: 'background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
        fontWeight: '600',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)' 
    });

    // Estilo uniforme para los elementos de filtro (select, input)
    const filterElementStyle = {
        padding: '10px 12px',
        borderRadius: '6px', 
        border: `1px solid ${BORDER_COLOR}`,
        minWidth: '150px',
        color: TEXT_COLOR,
        backgroundColor: CONTENT_BG_COLOR,
        boxShadow: `inset 0 1px 2px ${SHADOW_COLOR}`
    };

    // --- Módulos de Estado y Error ---
    if (loading) {
        return (
            <div style={{
                backgroundColor: BACKGROUND_COLOR, 
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '1.2rem',
                color: LIGHT_TEXT_COLOR
            }}>
                Cargando unidades...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                backgroundColor: BACKGROUND_COLOR, 
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px'
            }}>
                <div style={{
                    maxWidth: '800px',
                    width: '100%',
                    backgroundColor: CONTENT_BG_COLOR, 
                    borderRadius: '10px',
                    boxShadow: `0 4px 15px ${SHADOW_COLOR}`,
                    padding: '30px',
                    textAlign: 'center'
                }}>
                    <div style={{
                        background: '#f8d7da',
                        color: '#721c24',
                        padding: '15px',
                        borderRadius: '5px',
                        marginBottom: '25px',
                        border: '1px solid #f5c6cb'
                    }}>
                        <strong>Error:</strong> {error}
                    </div>
                    <button
                        onClick={loadUnidades}
                        style={{ ...actionButtonStyle(PRIMARY_COLOR), padding: '12px 25px', fontSize: '1rem' }}
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    // --- Renderizado principal ---
    return (
        // 1. Contenedor de la página: Permite el scroll nativo. minHeight solo asegura que el fondo cubra la ventana.
        <div style={{ 
            backgroundColor: BACKGROUND_COLOR, 
            minHeight: '100vh', 
            padding: '20px 0', 
            width: '100%' 
        }}> 
            {/* 2. Contenedor centralizado: Se ajusta al tamaño y permite que el contenido crezca. */}
            <div style={{
                maxWidth: '1200px', 
                margin: '0 auto', 
                padding: '20px 40px', // Buen padding lateral para escritorio
                backgroundColor: CONTENT_BG_COLOR, 
                borderRadius: '10px',
                boxShadow: `0 6px 20px ${SHADOW_COLOR}`
                // CRÍTICO: No definir aquí una altura fija (como minHeight: '100vh')
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '30px',
                    borderBottom: `1px solid ${BORDER_COLOR}`,
                    paddingBottom: '20px'
                }}>
                    <div>
                        <h1 style={{ margin: '0 0 8px 0', fontSize: '2.2rem', color: TEXT_COLOR }}>Gestión de Unidades</h1>
                        <p style={{ margin: 0, color: LIGHT_TEXT_COLOR, fontSize: '1rem' }}>Administrar propiedades del condominio</p>
                    </div>
                    <button
                        onClick={handleCreateUnidad}
                        style={{ ...actionButtonStyle(PRIMARY_COLOR), padding: '12px 25px', fontSize: '1rem' }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = HOVER_COLOR}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = PRIMARY_COLOR}
                    >
                        + Nueva Unidad
                    </button>
                </div>

                {/* Filtros */}
                <div style={{
                    display: 'flex',
                    gap: '15px',
                    marginBottom: '25px',
                    padding: '20px',
                    backgroundColor: BACKGROUND_COLOR, 
                    borderRadius: '8px',
                    boxShadow: `0 1px 5px ${SHADOW_COLOR}`,
                    flexWrap: 'wrap',
                    border: `1px solid ${BORDER_COLOR}`
                }}>
                    <select
                        value={filters.tipo_unidad}
                        onChange={(e) => handleFilterChange('tipo_unidad', e.target.value)}
                        style={{ ...filterElementStyle, flex: '1 1 auto', minWidth: '160px', maxWidth: '220px' }}
                    >
                        <option value="">Todos los tipos</option>
                        <option value="casa">Casa</option>
                        <option value="departamento">Departamento</option>
                        <option value="local">Local</option>
                        <option value="oficina">Oficina</option>
                        <option value="otro">Otro</option>
                    </select>

                    <select
                        value={filters.estado}
                        onChange={(e) => handleFilterChange('estado', e.target.value)}
                        style={{ ...filterElementStyle, flex: '1 1 auto', minWidth: '160px', maxWidth: '220px' }}
                    >
                        <option value="">Todos los estados</option>
                        <option value="disponible">Disponible</option>
                        <option value="ocupada">Ocupada</option>
                        <option value="mantenimiento">Mantenimiento</option>
                        <option value="reservada">Reservada</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Filtrar por edificio..."
                        value={filters.edificio}
                        onChange={(e) => handleFilterChange('edificio', e.target.value)}
                        style={{
                            ...filterElementStyle,
                            flex: '2 1 250px', 
                            minWidth: '200px'
                        }}
                    />

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <button
                            onClick={() => setViewMode('cards')}
                            style={{
                                ...actionButtonStyle(viewMode === 'cards' ? PRIMARY_COLOR : LIGHT_TEXT_COLOR),
                                padding: '10px 15px',
                                boxShadow: viewMode === 'cards' ? `0 3px 8px ${SHADOW_COLOR}` : 'none'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = viewMode === 'cards' ? HOVER_COLOR : LIGHT_TEXT_COLOR}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = viewMode === 'cards' ? PRIMARY_COLOR : LIGHT_TEXT_COLOR}
                        >
                            Cards
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            style={{
                                ...actionButtonStyle(viewMode === 'table' ? PRIMARY_COLOR : LIGHT_TEXT_COLOR),
                                padding: '10px 15px',
                                boxShadow: viewMode === 'table' ? `0 3px 8px ${SHADOW_COLOR}` : 'none'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = viewMode === 'table' ? HOVER_COLOR : LIGHT_TEXT_COLOR}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = viewMode === 'table' ? PRIMARY_COLOR : LIGHT_TEXT_COLOR}
                        >
                            Tabla
                        </button>
                    </div>
                </div>
                {/* Vista de Cards */}
                {viewMode === 'cards' && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
                        gap: '30px', 
                        paddingBottom: '20px'
                    }}>
                        {(filteredUnidades?.length === 0) ? (
                            <div style={{
                                gridColumn: '1 / -1',
                                textAlign: 'center',
                                padding: '60px 40px',
                                color: LIGHT_TEXT_COLOR,
                                backgroundColor: BACKGROUND_COLOR, 
                                borderRadius: '8px',
                                boxShadow: `0 2px 4px ${SHADOW_COLOR}`
                            }}>
                                {(unidades?.length === 0) ? 'No hay unidades registradas.' : 'No se encontraron unidades con los filtros aplicados.'}
                            </div>
                        ) : (
                            filteredUnidades?.map(unidad => (
                                <UnidadCard
                                    key={unidad.id}
                                    unidad={unidad}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onViewDetails={handleViewDetails}
                                />
                            ))
                        )}
                    </div>
                )}

                {/* Vista de Tabla */}
                {viewMode === 'table' && (
                    <div style={{
                        background: BACKGROUND_COLOR, 
                        borderRadius: '8px',
                        overflowX: 'auto',
                        boxShadow: `0 2px 8px ${SHADOW_COLOR}`,
                        border: `1px solid ${BORDER_COLOR}`
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f5f5f5', borderBottom: `2px solid ${BORDER_COLOR}` }}>
                                    <th style={{ padding: '15px', textAlign: 'left', color: TEXT_COLOR, fontWeight: '700' }}>Código / Nombre</th>
                                    <th style={{ padding: '15px', textAlign: 'left', color: TEXT_COLOR, fontWeight: '700' }}>Tipo</th>
                                    <th style={{ padding: '15px', textAlign: 'left', color: TEXT_COLOR, fontWeight: '700' }}>Edificio</th>
                                    <th style={{ padding: '15px', textAlign: 'left', color: TEXT_COLOR, fontWeight: '700' }}>Estado</th>
                                    <th style={{ padding: '15px', textAlign: 'left', color: TEXT_COLOR, fontWeight: '700' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUnidades?.map(unidad => (
                                    <tr
                                        key={unidad.id}
                                        style={{ borderBottom: `1px solid ${BORDER_COLOR}`, transition: 'background-color 0.2s ease' }}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <td style={{ padding: '15px' }}>
                                            <div style={{ fontWeight: '600', color: TEXT_COLOR }}>{unidad.codigo}</div>
                                            {unidad.nombre && <small style={{ color: LIGHT_TEXT_COLOR, fontSize: '0.85rem' }}>{unidad.nombre}</small>}
                                        </td>
                                        <td style={{ padding: '15px', color: TEXT_COLOR }}>
                                            {unidad.tipo_unidad || '-'}
                                        </td>
                                        <td style={{ padding: '15px', color: TEXT_COLOR }}>
                                            {unidad.edificio || '-'}
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            <span style={{
                                                padding: '5px 10px',
                                                borderRadius: '20px',
                                                fontSize: '11px',
                                                fontWeight: '600',
                                                textTransform: 'capitalize',
                                                backgroundColor:
                                                    unidad.estado === 'disponible' ? PRIMARY_COLOR :
                                                    unidad.estado === 'ocupada' ? '#dc3545' :
                                                    unidad.estado === 'mantenimiento' ? '#ffc107' : '#17a2b8',
                                                color: 'white'
                                            }}>
                                                {unidad.estado}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <button
                                                    onClick={() => handleEdit(unidad)}
                                                    style={actionButtonStyle('#007bff')} 
                                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0069d9'}
                                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(unidad)}
                                                    style={actionButtonStyle(unidad.esta_activa ? '#dc3545' : PRIMARY_COLOR)} 
                                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = unidad.esta_activa ? '#c82333' : HOVER_COLOR}
                                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = unidad.esta_activa ? '#dc3545' : PRIMARY_COLOR}
                                                >
                                                    {unidad.esta_activa ? 'Desactivar' : 'Activar'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {(filteredUnidades?.length === 0) && (
                            <div style={{ textAlign: 'center', padding: '40px', color: LIGHT_TEXT_COLOR }}>
                                {(unidades?.length === 0) ? 'No hay unidades registradas.' : 'No se encontraron unidades con los filtros aplicados.'}
                            </div>
                        )}
                    </div>
                )}

                {/* Modal */}
                <Modal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    title={editingUnidad ? 'Editar Unidad' : 'Crear Unidad'}
                >
                    <UnidadForm
                        unidad={editingUnidad}
                        onSubmit={handleSubmitUnidad}
                        onCancel={() => setShowModal(false)}
                    />
                </Modal>
            </div>
        </div>
    );
};

export default UnidadesManagementPage;