// src/pages/admin/ResidentesManagementPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/shared/DataTable';
import Modal from '../../components/shared/Modal';
import UserForm from '../../components/admin/UserForm';
import ResidenteForm from '../../components/admin/residenteForm';
import { userService } from '../../services/userService';
import { residenteService } from '../../services/residenteService';
import { rolesPermisosService } from '../../services/rolesPermisosService';

const ResidentesManagementPage = () => {
  const [residentes, setResidentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showResidenteModal, setShowResidenteModal] = useState(false);
  const [editingResidente, setEditingResidente] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [newUserId, setNewUserId] = useState(null);
  const [residenteRolId, setResidenteRolId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadResidentes();
    loadResidenteRolId();
  }, []);

  const loadResidenteRolId = async () => {
    try {
      const roles = await rolesPermisosService.getRoles();
      const residenteRol = roles.find(rol => rol.nombre === 'Residente');
      if (residenteRol) {
        setResidenteRolId(residenteRol.id);
      }
    } catch (error) {
      console.error('Error cargando rol Residente:', error);
    }
  };

  const loadResidentes = async () => {
    try {
      setLoading(true);
      const residentesData = await residenteService.getResidentes();
      const residentesEnriquecidos = await Promise.all(
        residentesData.map(async (residente) => {
          try {
            const usuario = await userService.getUserById(residente.usuario);
            return {
              ...residente,
              usuario_data: usuario,
              nombre: usuario.nombre,
              apellido: usuario.apellido,
              correo: usuario.correo,
              ci: usuario.ci,
              esta_activo: usuario.esta_activo
            };
          } catch {
            return {
              ...residente,
              usuario_data: null,
              nombre: 'N/A',
              apellido: 'N/A',
              correo: 'N/A',
              ci: 'N/A',
              esta_activo: false
            };
          }
        })
      );
      setResidentes(residentesEnriquecidos);
    } catch {
      alert('Error al cargar los residentes');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'ci', header: 'CI' },
    { key: 'nombre', header: 'Nombre' },
    { key: 'apellido', header: 'Apellido' },
    { key: 'correo', header: 'Email' },
    {
      key: 'tipo',
      header: 'Tipo',
      render: (residente) => (
        <span style={{
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          backgroundColor: residente.tipo === 'copropietario' ? '#007bff' : '#2ab77d',
          color: 'white'
        }}>
          {residente.tipo === 'copropietario' ? 'Copropietario' : 'Inquilino'}
        </span>
      )
    },
    { key: 'telefono', header: 'Teléfono' },
    {
      key: 'fecha_ingreso',
      header: 'Fecha Ingreso',
      render: (residente) => {
        if (!residente.fecha_ingreso) return 'No especificada';
        const fecha = new Date(residente.fecha_ingreso);
        return fecha.toLocaleDateString('es-ES');
      }
    },
    {
      key: 'esta_activo',
      header: 'Estado',
      render: (residente) => (
        <span style={{
          color: residente.esta_activo ? '#2ab77d' : '#dc3545',
          fontWeight: 'bold'
        }}>
          {residente.esta_activo ? 'Activo' : 'Inactivo'}
        </span>
      )
    }
  ];

  const handleCreateResidente = () => {
    setEditingResidente(null);
    setEditingUser(null);
    setShowUserModal(true);
  };

  const handleEdit = async (residente) => {
    try {
      setEditingResidente(residente);
      const usuarioData = await userService.getUserById(residente.usuario);
      setEditingUser(usuarioData);
      setShowUserModal(true);
    } catch {
      alert('Error al cargar datos del residente');
    }
  };

  const handleSubmitUser = async (userData) => {
    try {
      if (editingUser) {
        await userService.updateUser(editingUser.id, userData);
        if (editingResidente) {
          setShowUserModal(false);
          setShowResidenteModal(true);
        } else {
          alert('Usuario actualizado correctamente');
          setShowUserModal(false);
          loadResidentes();
        }
      } else {
        const userDataConRol = { ...userData, rol: residenteRolId };
        const response = await userService.createUser(userDataConRol);
        setNewUserId(response.id);
        setShowUserModal(false);
        setShowResidenteModal(true);
      }
    } catch (error) {
      alert('Error al guardar el usuario: ' + error.message);
    }
  };

  const handleSubmitResidente = async (residenteData) => {
    try {
      if (editingResidente) {
        await residenteService.updateResidente(editingResidente.id, residenteData);
        alert('Residente actualizado correctamente');
      } else {
        const dataConUsuario = { ...residenteData, usuario: newUserId };
        await residenteService.createResidente(dataConUsuario);
        alert('Residente creado correctamente');
      }
      setShowResidenteModal(false);
      setEditingResidente(null);
      setNewUserId(null);
      loadResidentes();
    } catch (error) {
      alert('Error al guardar el residente: ' + error.message);
    }
  };

  const handleToggleStatus = async (residente) => {
    const action = residente.esta_activo ? 'desactivar' : 'activar';
    if (window.confirm(`¿Estás seguro de ${action} a ${residente.nombre} ${residente.apellido}?`)) {
      try {
        await userService.softDeleteUser(residente.usuario);
        alert(`Residente ${action === 'activar' ? 'activado' : 'desactivado'} correctamente`);
        loadResidentes();
      } catch {
        alert(`Error al ${action} el residente`);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingResidente(null);
    setEditingUser(null);
    setNewUserId(null);
  };

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
    },
    title: {
      fontSize: '2rem',
      marginBottom: '0.3rem',
    },
    subtitle: {
      fontSize: '1rem',
      color: '#666',
    },
    addButton: {
      padding: '0.8rem 1.5rem',
      background: '#2ab77d',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    addButtonHover: {
      background: '#239a67',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 15px rgba(42, 183, 125, 0.35)',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Gestión de Residentes</h1>
          <p style={styles.subtitle}>Administrar copropietarios e inquilinos del condominio</p>
        </div>
        <button
          onClick={handleCreateResidente}
          style={styles.addButton}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.addButtonHover)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.addButton)}
        >
          + Nuevo Residente
        </button>
      </div>

      <DataTable
        data={residentes}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleToggleStatus}
        loading={loading}
      />

      <Modal
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          handleCancelEdit();
        }}
        title={editingUser ? 'Editar Datos de Usuario - Paso 1 de 2' : 'Crear Residente - Paso 1 de 2'}
      >
        <UserForm
          user={editingUser}
          onSubmit={handleSubmitUser}
          onCancel={() => {
            setShowUserModal(false);
            handleCancelEdit();
          }}
          forceRol="Residente"
        />
      </Modal>

      <Modal
        isOpen={showResidenteModal}
        onClose={() => {
          setShowResidenteModal(false);
          handleCancelEdit();
        }}
        title={editingResidente ? 'Editar Perfil de Residente - Paso 2 de 2' : 'Completar Perfil de Residente - Paso 2 de 2'}
      >
        <ResidenteForm
          residente={editingResidente}
          onSubmit={handleSubmitResidente}
          onCancel={() => {
            setShowResidenteModal(false);
            handleCancelEdit();
          }}
        />
      </Modal>
    </div>
  );
};

export default ResidentesManagementPage;
