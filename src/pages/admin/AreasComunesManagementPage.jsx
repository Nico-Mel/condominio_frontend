// src/pages/admin/AreasComunesManagementPage.jsx
import { useState, useEffect } from 'react';
import { areaComunService } from '../../services/areaComunService';
import AreaComunCard from '../../components/admin/AreaComunCard';
import AreaComunForm from '../../components/admin/AreaComunForm';
import Modal from '../../components/shared/Modal';
// import DataTable from '../../components/shared/DataTable'; // ❌ Eliminamos la importación

// PALETA DE COLORES ARMONIZADA
const PRIMARY_COLOR = '#2ab77d'; // Verde principal
const HOVER_COLOR = '#239a67'; // Verde de hover
const BACKGROUND_COLOR = '#fcfcfc'; // Fondo de la página (casi blanco, muy sutil)
const CONTENT_BG_COLOR = '#ffffff'; // Fondo del contenido principal (blanco puro)
const TEXT_COLOR = '#333333'; // Texto principal
const LIGHT_TEXT_COLOR = '#666666'; // Texto secundario
const BORDER_COLOR = '#eeeeee'; // Borde ligero, más sutil
const SHADOW_COLOR = 'rgba(0,0,0,0.03)'; // Sombra más ligera
const INFO_COLOR = '#007bff'; // Azul para Editar / Información

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

const AreasComunesManagementPage = () => {
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingArea, setEditingArea] = useState(null);
    const [view, setView] = useState('cards'); 

    useEffect(() => {
        loadAreas();
    }, []);

    const loadAreas = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await areaComunService.getAll();
            setAreas(data || []); 
        } catch (error) {
            console.error('Error loading areas:', error);
            setError('Error al cargar las áreas comunes');
            setAreas([]); 
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => { setEditingArea(null); setShowModal(true); };
    const handleEdit = (area) => { setEditingArea(area); setShowModal(true); };
    
    const handleDelete = async (area) => {
        const action = area.esta_activa ? 'desactivar' : 'activar';
        if (window.confirm(`¿Estás seguro de que quieres ${action} esta área?`)) {
            try {
                if (area.esta_activa) {
                    await areaComunService.delete(area.id); 
                } else {
                    await areaComunService.activate(area.id); 
                }
                loadAreas();
            } catch (error) {
                console.error('Error updating area:', error);
                alert('Error al actualizar el área');
            }
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (editingArea) {
                await areaComunService.update(editingArea.id, formData);
            } else {
                await areaComunService.create(formData);
            }
            setShowModal(false);
            loadAreas();
        } catch (error) {
            console.error('Error saving area:', error);
            alert('Error al guardar el área');
        }
    };

    const handleViewDetails = (area) => {
        // Implementar vista de detalles si es necesario
        console.log('View details:', area);
    };

    const getTipoDisplay = (tipo) => {
        const tipos = {
            'piscina': 'Piscina',
            'salon_eventos': 'Salón de Eventos',
            'gimnasio': 'Gimnasio',
            'parrilla': 'Quincho/Parrilla',
            'cancha': 'Cancha Deportiva',
            'meeting': 'Meeting Room',
            'study': 'Study Room',
            'otro': 'Otro'
        };
        return tipos[tipo] || tipo;
    };

    // --- Módulos de Estado y Error ---
            // src/pages/admin/AreasComunesManagementPage.jsx
            if (loading) {
            return (
                        // ❌ Antes: minHeight: '100vh'
                        // ✅ Ahora: Usamos solo estilo de centrado. El navegador se encarga del scroll.
            <div style={{ 
                            backgroundColor: BACKGROUND_COLOR, 
                            padding: '40px', // Añadimos padding para que se vea bien
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            fontSize: '1.2rem', 
                            color: LIGHT_TEXT_COLOR 
                        }}>
            Cargando áreas comunes...
            </div>
            );
            }

                if (error) {
            return (
                        // ❌ Antes: minHeight: '100vh'
                        // ✅ Ahora: Usamos solo estilo de centrado.
            <div style={{ 
                            backgroundColor: BACKGROUND_COLOR, 
                            padding: '40px', // Añadimos padding para que se vea bien
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center' 
                        }}>
                            {/* Contenedor interno para que se vea el error bonito */}
            <div style={{ maxWidth: '800px', width: '100%', backgroundColor: CONTENT_BG_COLOR, borderRadius: '10px', boxShadow: `0 4px 15px ${SHADOW_COLOR}`, padding: '30px', textAlign: 'center' }}>
            {/* ... contenido del error ... */}
            </div>
            </div>
            );
            }

    // --- Renderizado Principal (Estructura Corregida) ---
    return (
        // 1. Contenedor de la página: Permite el scroll nativo. minHeight: '100vh' solo para cubrir el fondo.
        <div style={{ backgroundColor: BACKGROUND_COLOR, minHeight: '100vh', padding: '20px 0', width: '100%' }}> 
            {/* 2. Contenedor centralizado: NO tiene altura fija, por lo que crece con el contenido. */}
            <div style={{
                maxWidth: '1200px', 
                margin: '0 auto', // CRÍTICO: Centrado automático
                padding: '20px 40px', // Buen padding lateral para escritorio
                backgroundColor: CONTENT_BG_COLOR, 
                borderRadius: '10px',
                boxShadow: `0 6px 20px ${SHADOW_COLOR}`
            }}>
                
                {/* Header y Controles */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: `1px solid ${BORDER_COLOR}`, paddingBottom: '20px' }}>
                    <div>
                        <h1 style={{ margin: '0 0 8px 0', fontSize: '2.2rem', color: TEXT_COLOR }}>Gestión de Áreas Comunes</h1>
                        <p style={{ margin: 0, color: LIGHT_TEXT_COLOR, fontSize: '1rem' }}>Administrar los espacios compartidos del condominio.</p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '15px' }}>
                        {/* Botón de Vista */}
                        <button
                            onClick={() => setView(view === 'cards' ? 'table' : 'cards')}
                            style={{ 
                                ...actionButtonStyle(view === 'cards' ? LIGHT_TEXT_COLOR : PRIMARY_COLOR), 
                                padding: '10px 15px' 
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = view === 'cards' ? PRIMARY_COLOR : HOVER_COLOR}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = view === 'cards' ? LIGHT_TEXT_COLOR : PRIMARY_COLOR}
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
                            + Crear Área Común
                        </button>
                    </div>
                </div>

                {/* Contenido */}
                {areas.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 40px', color: LIGHT_TEXT_COLOR, backgroundColor: BACKGROUND_COLOR, borderRadius: '8px', boxShadow: `0 2px 4px ${SHADOW_COLOR}` }}>
                        <p style={{fontSize: '1.1rem', marginBottom: '20px'}}>No hay áreas comunes registradas.</p>
                        <button
                            onClick={handleCreate}
                            style={actionButtonStyle(PRIMARY_COLOR)}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = HOVER_COLOR}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = PRIMARY_COLOR}
                        >
                            Crear la primera área común
                        </button>
                    </div>
                ) : view === 'cards' ? (
                    // Vista Cards con Grid
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
                        gap: '30px', 
                        paddingBottom: '20px'
                    }}>
                        {areas.map(area => (
                            <AreaComunCard
                                key={area.id}
                                area={area}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onViewDetails={handleViewDetails}
                            />
                        ))}
                    </div>
                ) : (
                    // ❌ Nueva implementación de la Vista Tabla (solucionando cabecera)
                    <div style={{
                        background: CONTENT_BG_COLOR, 
                        borderRadius: '8px',
                        overflowX: 'auto', // Permite scroll horizontal si la tabla es muy ancha
                        boxShadow: `0 2px 8px ${SHADOW_COLOR}`,
                        border: `1px solid ${BORDER_COLOR}`
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                            <thead>
                                <tr style={{ backgroundColor: BACKGROUND_COLOR, borderBottom: `2px solid ${BORDER_COLOR}` }}>
                                    <th style={{ padding: '15px', textAlign: 'left', color: TEXT_COLOR, fontWeight: '700' }}>Nombre</th>
                                    <th style={{ padding: '15px', textAlign: 'left', color: TEXT_COLOR, fontWeight: '700' }}>Tipo</th>
                                    <th style={{ padding: '15px', textAlign: 'left', color: TEXT_COLOR, fontWeight: '700' }}>Capacidad</th>
                                    <th style={{ padding: '15px', textAlign: 'left', color: TEXT_COLOR, fontWeight: '700' }}>Estado</th>
                                    <th style={{ padding: '15px', textAlign: 'left', color: TEXT_COLOR, fontWeight: '700' }}>Costo</th>
                                    <th style={{ padding: '15px', textAlign: 'left', color: TEXT_COLOR, fontWeight: '700' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {areas.map(area => (
                                    <tr
                                        key={area.id}
                                        style={{ borderBottom: `1px solid ${BORDER_COLOR}`, transition: 'background-color 0.2s ease' }}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <td style={{ padding: '15px', color: TEXT_COLOR, fontWeight: '500' }}>{area.nombre}</td>
                                        <td style={{ padding: '15px', color: LIGHT_TEXT_COLOR }}>{getTipoDisplay(area.tipo)}</td>
                                        <td style={{ padding: '15px', color: LIGHT_TEXT_COLOR }}>{area.capacidad}</td>
                                        <td style={{ padding: '15px' }}>
                                            <span style={{
                                                padding: '5px 10px',
                                                borderRadius: '20px',
                                                fontSize: '11px',
                                                fontWeight: '600',
                                                textTransform: 'capitalize',
                                                backgroundColor: area.estado === 'disponible' ? PRIMARY_COLOR : '#ffc107',
                                                color: 'white'
                                            }}>
                                                {area.estado === 'disponible' ? 'Disponible' : 'Mantenimiento'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px', color: area.tiene_costo ? INFO_COLOR : PRIMARY_COLOR, fontWeight: '600' }}>
                                            {area.tiene_costo ? `$${parseFloat(area.costo_normal).toFixed(2)}` : 'Gratis'}
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <button
                                                    onClick={() => handleEdit(area)}
                                                    style={{ ...actionButtonStyle(INFO_COLOR, false), padding: '8px 12px', fontSize: '0.9rem' }}
                                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = INFO_COLOR}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(area)}
                                                    style={{ ...actionButtonStyle(area.esta_activa ? '#dc3545' : PRIMARY_COLOR, false), padding: '8px 12px', fontSize: '0.9rem' }}
                                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = area.esta_activa ? '#c82333' : HOVER_COLOR}
                                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = area.esta_activa ? '#dc3545' : PRIMARY_COLOR}
                                                >
                                                    {area.esta_activa ? 'Desactivar' : 'Activar'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {(areas.length === 0) && (
                            <div style={{ textAlign: 'center', padding: '40px', color: LIGHT_TEXT_COLOR }}>
                                No hay áreas comunes registradas.
                            </div>
                        )}
                    </div>
                )}

                {/* Modal */}
                <Modal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    title={editingArea ? 'Editar Área Común' : 'Crear Área Común'}
                >
                    <AreaComunForm
                        area={editingArea}
                        onSubmit={handleSubmit}
                        onCancel={() => setShowModal(false)}
                    />
                </Modal>
            </div>
        </div>
    );
};

export default AreasComunesManagementPage;