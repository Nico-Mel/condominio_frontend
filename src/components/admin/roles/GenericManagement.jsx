// src/components/admin/roles/GenericManagement.jsx
import { useState, useEffect } from 'react';
import DataTable from '../../shared/DataTable';
import Modal from '../../shared/Modal';
import GenericForm from './GenericForm';

const GenericManagement = ({ 
  title, 
  service, 
  columns, 
  formFields,
  emptyForm,
  dynamicDataLoader,
  isRolPermiso = false,
  rolesPermisosService // ✅ Nuevo: pasar el servicio
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [dynamicOptions, setDynamicOptions] = useState({});

  useEffect(() => {
    loadData();
    if (dynamicDataLoader) {
      loadDynamicOptions();
    }
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      let response = await service.get();
      
      // ✅ Si es RolPermiso, enriquecer los datos con nombres
      if (isRolPermiso && rolesPermisosService) {
        response = await enrichRolPermisoData(response);
      }
      
      setData(response);
    } catch (error) {
      console.error(`Error cargando ${title}:`, error);
      alert(`Error al cargar ${title}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Función: Enriquecer datos de RolPermiso con nombres
  const enrichRolPermisoData = async (rolPermisos) => {
    try {
      console.log('🔄 Enriqueciendo datos RolPermiso...', rolPermisos);
      
      const [rolesResponse, permisosResponse] = await Promise.all([
        rolesPermisosService.getRoles(),
        rolesPermisosService.getPermisos()
      ]);

      console.log('📊 Roles cargados:', rolesResponse);
      console.log('📊 Permisos cargados:', permisosResponse);

      // Crear mapas para búsqueda rápida
      const rolesMap = {};
      const permisosMap = {};
      
      rolesResponse.forEach(rol => {
        rolesMap[rol.id] = rol;
      });
      
      permisosResponse.forEach(permiso => {
        permisosMap[permiso.id] = permiso;
      });

      console.log('🗺️ Mapa de roles:', rolesMap);
      console.log('🗺️ Mapa de permisos:', permisosMap);

      // Enriquecer cada RolPermiso con nombres
      const enrichedData = rolPermisos.map(item => {
        const enriched = {
          ...item,
          rol_nombre: rolesMap[item.rol]?.nombre || 'N/A',
          permiso_nombre: permisosMap[item.permiso]?.nombre || 'N/A',
          rol: rolesMap[item.rol] || { nombre: 'N/A', id: item.rol },
          permiso: permisosMap[item.permiso] || { nombre: 'N/A', id: item.permiso }
        };
        console.log(`🔍 Item ${item.id}:`, item, '->', enriched);
        return enriched;
      });

      console.log('✅ Datos enriquecidos:', enrichedData);
      return enrichedData;
    } catch (error) {
      console.error('❌ Error enriqueciendo datos RolPermiso:', error);
      return rolPermisos;
    }
  };

  // ✅ Cargar opciones dinámicas para selects
  const loadDynamicOptions = async () => {
    if (dynamicDataLoader) {
      try {
        const options = await dynamicDataLoader();
        setDynamicOptions(options);
      } catch (error) {
        console.error(`Error cargando opciones para ${title}:`, error);
      }
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm(`¿Estás seguro de eliminar este ${title.toLowerCase()}?`)) {
      try {
        await service.delete(item.id);
        alert(`${title} eliminado correctamente`);
        loadData();
      } catch (error) {
        console.error(`Error eliminando ${title}:`, error);
        alert(`Error al eliminar ${title}`);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingItem) {
        await service.update(editingItem.id, formData);
        alert(`${title} actualizado correctamente`);
      } else {
        await service.create(formData);
        alert(`${title} creado correctamente`);
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      console.error(`Error guardando ${title}:`, error);
      alert(`Error al guardar ${title}`);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>{title}</h2>
        <button onClick={handleCreate} style={{ padding: '8px 16px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
          + Agregar {title}
        </button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingItem ? `Editar ${title}` : `Crear ${title}`}
      >
        <GenericForm
          item={editingItem}
          formFields={formFields}
          emptyForm={emptyForm}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
          dynamicOptions={dynamicOptions}
        />
      </Modal>
    </div>
  );
};

export default GenericManagement;