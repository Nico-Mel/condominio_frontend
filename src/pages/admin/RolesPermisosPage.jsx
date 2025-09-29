// src/pages/admin/RolesPermisosPage.jsx
import { useState } from 'react';
import GenericManagement from '../../components/admin/roles/GenericManagement';
import { rolesPermisosService } from '../../services/rolesPermisosService';

const RolesPermisosPage = () => {
  const [activeTab, setActiveTab] = useState('roles');

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: 'Segoe UI, sans-serif',
      color: '#333',
    },
    header: {
      marginBottom: '40px',
    },
    title: {
      fontSize: '2rem',
      marginBottom: '0.3rem',
    },
    subtitle: {
      fontSize: '1rem',
      color: '#666',
    },
    tabs: {
      display: 'flex',
      borderBottom: '1px solid #ccc',
      marginBottom: '30px',
    },
    tabButton: (active) => ({
      padding: '10px 20px',
      background: active ? '#2ab77d' : 'transparent',
      color: active ? 'white' : '#333',
      border: 'none',
      borderBottom: active ? '3px solid #2ab77d' : 'none',
      marginRight: '10px',
      cursor: 'pointer',
      fontWeight: active ? '600' : 'normal',
      transition: 'all 0.3s ease',
    }),
  };

  const rolesColumns = [
    { key: 'nombre', header: 'Nombre' },
    { key: 'descripcion', header: 'Descripción' }
  ];

  const rolesFormFields = [
    { name: 'nombre', label: 'Nombre del Rol', type: 'text', required: true },
    { name: 'descripcion', label: 'Descripción', type: 'text', required: false }
  ];

  const permisosColumns = [
    { key: 'nombre', header: 'Nombre' }
  ];

  const permisosFormFields = [
    { name: 'nombre', label: 'Nombre del Permiso', type: 'text', required: true }
  ];

  const rolPermisoColumns = [
    { key: 'rol_nombre', header: 'Rol' },
    { key: 'permiso_nombre', header: 'Permiso' }
  ];

  const rolPermisoFormFields = [
    {
      name: 'rol',
      label: 'Rol',
      type: 'select',
      required: true,
      options: []
    },
    {
      name: 'permiso',
      label: 'Permiso',
      type: 'select',
      required: true,
      options: []
    }
  ];

  const loadRolPermisoOptions = async () => {
    try {
      const [rolesResponse, permisosResponse] = await Promise.all([
        rolesPermisosService.getRoles(),
        rolesPermisosService.getPermisos()
      ]);

      return {
        rol: rolesResponse.map(rol => ({
          value: rol.id,
          label: rol.nombre
        })),
        permiso: permisosResponse.map(permiso => ({
          value: permiso.id,
          label: permiso.nombre
        }))
      };
    } catch (error) {
      console.error('Error cargando opciones para RolPermiso:', error);
      return { rol: [], permiso: [] };
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Gestión de Roles y Permisos</h1>
        <p style={styles.subtitle}>Administra roles, permisos y sus asignaciones en el sistema</p>
      </div>

      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('roles')}
          style={styles.tabButton(activeTab === 'roles')}
        >
          Roles
        </button>
        <button
          onClick={() => setActiveTab('permisos')}
          style={styles.tabButton(activeTab === 'permisos')}
        >
          Permisos
        </button>
        <button
          onClick={() => setActiveTab('rolpermisos')}
          style={styles.tabButton(activeTab === 'rolpermisos')}
        >
          Asignaciones
        </button>
      </div>

      <div>
        {activeTab === 'roles' && (
          <GenericManagement
            title="Roles"
            service={{
              get: rolesPermisosService.getRoles,
              create: rolesPermisosService.createRol,
              update: rolesPermisosService.updateRol,
              delete: rolesPermisosService.deleteRol
            }}
            columns={rolesColumns}
            formFields={rolesFormFields}
            emptyForm={{ nombre: '', descripcion: '' }}
          />
        )}

        {activeTab === 'permisos' && (
          <GenericManagement
            title="Permisos"
            service={{
              get: rolesPermisosService.getPermisos,
              create: rolesPermisosService.createPermiso,
              update: rolesPermisosService.updatePermiso,
              delete: rolesPermisosService.deletePermiso
            }}
            columns={permisosColumns}
            formFields={permisosFormFields}
            emptyForm={{ nombre: '', descripcion: '' }}
          />
        )}

        {activeTab === 'rolpermisos' && (
          <GenericManagement
            title="Asignaciones Rol-Permiso"
            service={{
              get: rolesPermisosService.getRolPermisos,
              create: rolesPermisosService.createRolPermiso,
              update: rolesPermisosService.updateRolPermiso,
              delete: rolesPermisosService.deleteRolPermiso
            }}
            columns={rolPermisoColumns}
            formFields={rolPermisoFormFields}
            emptyForm={{ rol: '', permiso: '' }}
            dynamicDataLoader={loadRolPermisoOptions}
            isRolPermiso={true}
            rolesPermisosService={rolesPermisosService}
          />
        )}
      </div>
    </div>
  );
};

export default RolesPermisosPage;
