// src/pages/admin/ExpensasManagementPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { expensaService } from '../../services/expensaService';
import ExpensaCard from '../../components/admin/ExpensaCard';
import ExpensaForm from '../../components/admin/ExpensaForm';
import Modal from '../../components/shared/Modal';
import DataTable from '../../components/shared/DataTable';

// PALETA DE COLORES ARMONIZADA (Adaptada para Expensas, manteniendo la base)
const PRIMARY_COLOR = '#007bff'; // Azul principal (manteniendo el azul original para el "Crear")
const HOVER_COLOR = '#0056b3'; // Azul de hover
const BACKGROUND_COLOR = '#fcfcfc'; // Fondo de la página (casi blanco, muy sutil)
const CONTENT_BG_COLOR = '#ffffff'; // Fondo del contenido principal (blanco puro)
const TEXT_COLOR = '#333333'; // Texto principal
const LIGHT_TEXT_COLOR = '#666666'; // Texto secundario
const BORDER_COLOR = '#eeeeee'; // Borde ligero, más sutil
const SHADOW_COLOR = 'rgba(0,0,0,0.05)'; // Sombra ligera
const SECONDARY_COLOR = '#6c757d'; // Gris para el botón de vista
const SUCCESS_COLOR = '#28a745'; // Verde para Cuotas
const WARNING_COLOR = '#ffc107'; // Amarillo para Detalles Cuota
const DANGER_COLOR = '#dc3545'; // Rojo para Multas

const actionButtonStyle = (bgColor, isHover = false) => ({
    padding: '10px 20px', 
    background: isHover ? HOVER_COLOR : bgColor,
    color: 'white',
    border: 'none',
    borderRadius: '6px', 
    cursor: 'pointer',
    fontSize: '1rem', 
    transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
    fontWeight: '600',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)' 
});

// Estilo base para botones de navegación rápida
const navButtonStyle = (bgColor) => ({
    padding: '10px 16px',
    background: bgColor,
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s ease',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)' 
});

const ExpensasManagementPage = () => {
    const navigate = useNavigate();
    const [expensas, setExpensas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingExpensa, setEditingExpensa] = useState(null);
    const [view, setView] = useState('cards'); // 'cards' or 'table'

    useEffect(() => {
        loadExpensas();
    }, []);

    const loadExpensas = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await expensaService.getAll();
            console.log('📊 Expensas cargadas:', data);
            setExpensas(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('❌ Error loading expensas:', error);
            setError('Error al cargar las expensas');
            setExpensas([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingExpensa(null);
        setShowModal(true);
    };

    const handleEdit = (expensa) => {
        setEditingExpensa(expensa);
        setShowModal(true);
    };

    const handleDelete = async (expensa) => {
        const action = expensa.es_activo ? 'desactivar' : 'activar';
        if (window.confirm(`¿Estás seguro de que quieres ${action} esta expensa?`)) {
            try {
                if (expensa.es_activo) {
                    await expensaService.delete(expensa.id);
                } else {
                    await expensaService.activate(expensa.id);
                }
                loadExpensas();
            } catch (error) {
                console.error('Error updating expensa:', error);
                alert('Error al actualizar la expensa');
            }
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (editingExpensa) {
                await expensaService.update(editingExpensa.id, formData);
            } else {
                await expensaService.create(formData);
            }
            setShowModal(false);
            loadExpensas();
        } catch (error) {
            console.error('Error saving expensa:', error);
            alert('Error al guardar la expensa');
        }
    };

    const handleViewDetails = (expensa) => {
        console.log('View details:', expensa);
    };

    // Helper para formatear el tipo
    const formatTipo = (value) => {
        const tipos = {
            'alquiler': 'Alquiler',
            'reserva_area': 'Reserva de Área Común',
            'expensa_ordinaria': 'Expensa Ordinaria',
            'multa': 'Multa',
            'servicio': 'Servicio'
        };
        return tipos[value] || value;
    };

    // Columnas para DataTable
    const columns = [
        { key: 'nombre', label: 'Nombre' },
        { 
            key: 'tipo', 
            label: 'Tipo',
            format: formatTipo
        },
        { 
            key: 'es_activo', 
            label: 'Estado', 
            format: (value) => (
                <span style={{
                    padding: '5px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '600',
                    textTransform: 'capitalize',
                    backgroundColor: value ? SUCCESS_COLOR : DANGER_COLOR,
                    color: 'white'
                }}>
                    {value ? 'Activo' : 'Inactivo'}
                </span>
            )
        }
    ];

    // --- Módulos de Estado y Error ---
    if (loading) {
        return (
            <div style={{ 
                backgroundColor: BACKGROUND_COLOR, 
                padding: '40px',
                minHeight: '100vh',
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                fontSize: '1.2rem', 
                color: LIGHT_TEXT_COLOR 
            }}>
                Cargando expensas...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ 
                backgroundColor: BACKGROUND_COLOR, 
                padding: '40px',
                minHeight: '100vh',
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center' 
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
                    <div style={{ color: DANGER_COLOR, marginBottom: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>{error}</div>
                    <button 
                        onClick={loadExpensas}
                        style={actionButtonStyle(PRIMARY_COLOR)}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = HOVER_COLOR}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = PRIMARY_COLOR}
                    >
                        🔄 Reintentar
                    </button>
                </div>
            </div>
        );
    }

    // --- Renderizado Principal ---
    return (
        <div style={{ backgroundColor: BACKGROUND_COLOR, minHeight: '100vh', padding: '20px 0', width: '100%' }}> 
            <div style={{
                maxWidth: '1200px', 
                margin: '0 auto',
                padding: '20px 40px',
                backgroundColor: CONTENT_BG_COLOR, 
                borderRadius: '10px',
                boxShadow: `0 6px 20px ${SHADOW_COLOR}`
            }}>
                
                {/* Navegación Rápida */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap', paddingBottom: '20px', borderBottom: `1px solid ${BORDER_COLOR}` }}>
                    <button
                        onClick={() => navigate('/admin/cuotas')}
                        style={navButtonStyle(SUCCESS_COLOR)}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e7e34'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = SUCCESS_COLOR}
                    >
                        📊 Ir a Cuotas
                    </button>
                    <button
                        onClick={() => navigate('/admin/detalles-cuota')}
                        style={navButtonStyle(WARNING_COLOR)}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d39e00'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = WARNING_COLOR}
                    >
                        📝 Ir a Detalles
                    </button>
                    <button
                        onClick={() => navigate('/admin/multas')}
                        style={navButtonStyle(DANGER_COLOR)}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#bd2130'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = DANGER_COLOR}
                    >
                        ⚠️ Ir a Multas
                    </button>
                </div>

                {/* Header y Controles */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '20px' }}>
                    <div>
                        <h1 style={{ margin: '0 0 8px 0', fontSize: '2.2rem', color: TEXT_COLOR }}>Gestión de Expensas</h1>
                        <p style={{ margin: 0, color: LIGHT_TEXT_COLOR, fontSize: '1rem' }}>Administrar los tipos de expensas del condominio.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        {/* Botón de Vista */}
                        <button
                            onClick={() => setView(view === 'cards' ? 'table' : 'cards')}
                            style={{ 
                                ...actionButtonStyle(SECONDARY_COLOR), 
                                padding: '10px 15px' 
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5a6268'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = SECONDARY_COLOR}
                        >
                            {view === 'cards' ? 'Vista Tabla' : 'Vista Tarjetas'}
                        </button>
                        
                        {/* Botón de Creación */}
                        <button
                            onClick={handleCreate}
                            style={actionButtonStyle(PRIMARY_COLOR)}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = HOVER_COLOR}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = PRIMARY_COLOR}
                        >
                            + Crear Expensa
                        </button>
                    </div>
                </div>

                {/* Contenido (Tarjetas/Tabla) */}
                {expensas.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 40px', color: LIGHT_TEXT_COLOR, backgroundColor: BACKGROUND_COLOR, borderRadius: '8px', boxShadow: `0 2px 4px ${SHADOW_COLOR}` }}>
                        <p style={{fontSize: '1.1rem', marginBottom: '20px'}}>No hay expensas registradas.</p>
                        <button
                            onClick={handleCreate}
                            style={actionButtonStyle(PRIMARY_COLOR)}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = HOVER_COLOR}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = PRIMARY_COLOR}
                        >
                            Crear la primera expensa
                        </button>
                    </div>
                ) : view === 'cards' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px', paddingBottom: '20px' }}>
                        {expensas.map(expensa => (
                            // Asumiendo que ExpensaCard tiene estilos similares a AreaComunCard
                            <ExpensaCard
                                key={expensa.id}
                                expensa={expensa}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onViewDetails={handleViewDetails}
                            />
                        ))}
                    </div>
                ) : (
                    // Vista de Tabla
                    <div style={{
                        background: CONTENT_BG_COLOR, 
                        borderRadius: '8px',
                        overflowX: 'auto',
                        boxShadow: `0 2px 8px ${SHADOW_COLOR}`,
                        border: `1px solid ${BORDER_COLOR}`
                    }}>
                        <DataTable
                            data={expensas}
                            columns={columns}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onView={handleViewDetails}
                            // Asumiendo que DataTable usa estilos de tabla profesionales por defecto
                            // Si no, necesitarías implementar la tabla con estilos manuales como en AreasComunesManagementPage
                        />
                    </div>
                )}

                {/* Modal */}
                <Modal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    title={editingExpensa ? 'Editar Expensa' : 'Crear Expensa'}
                >
                    <ExpensaForm
                        expensa={editingExpensa}
                        onSubmit={handleSubmit}
                        onCancel={() => setShowModal(false)}
                    />
                </Modal>
            </div>
        </div>
    );
};

export default ExpensasManagementPage;