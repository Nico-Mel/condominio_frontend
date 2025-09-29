// src/pages/admin/UserManagementPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/shared/DataTable';
import Modal from '../../components/shared/Modal';
import UserForm from '../../components/admin/UserForm';
import { userService } from '../../services/userService';
import { rolesPermisosService } from '../../services/rolesPermisosService';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false); 
  const [editingUser, setEditingUser] = useState(null);
  const [residenteRolId, setResidenteRolId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
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

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers(); 
      const usuariosFiltrados = data.filter(user => 
        user.rol_nombre !== 'Residente' && user.rol !== residenteRolId
      );
      setUsers(usuariosFiltrados);
      setFilteredUsers(usuariosFiltrados);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      alert('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (residenteRolId && users.length > 0) {
      const usuariosFiltrados = users.filter(user => 
        user.rol_nombre !== 'Residente' && user.rol !== residenteRolId
      );
      setFilteredUsers(usuariosFiltrados);
    }
  }, [users, residenteRolId]);

  const columns = [
    { key: 'ci', header: 'CI' },
    { key: 'nombre', header: 'Nombre' },
    { key: 'apellido', header: 'Apellido' },
    { key: 'correo', header: 'Email' },
    {
      key: 'rol_nombre',
      header: 'Rol',
      render: (user) => (
        <span style={{
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          backgroundColor: user.rol_nombre === 'Admin' ? '#dc3545' :
                          user.rol_nombre === 'Personal' ? '#ffc107' : '#007bff',
          color: 'white'
        }}>
          {user.rol_nombre}
        </span>
      )
    },
    {
      key: 'esta_activo',
      header: 'Estado',
      render: (user) => (
        <span style={{
          color: user.esta_activo ? '#2ab77d' : '#dc3545',
          fontWeight: 'bold'
        }}>
          {user.esta_activo ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    {
      key: 'fecha_registro',
      header: 'Fecha Registro',
      render: (user) => {
        const fecha = new Date(user.fecha_registro);
        return fecha.toLocaleDateString('es-ES');
      }
    }
  ];

  const handleDelete = async (user) => {
    const action = user.esta_activo ? 'desactivar' : 'activar';
    const actionText = user.esta_activo ? 'desactivar (eliminar)' : 'activar';
    
    if (window.confirm(`¿Estás seguro de ${actionText} a ${user.nombre} ${user.apellido}?`)) {
      try {
        await userService.softDeleteUser(user.id);
        alert(`Usuario ${action === 'activar' ? 'activado' : 'desactivado'} correctamente`);
        loadUsers();
      } catch (error) {
        console.error(`Error al ${action} usuario:`, error);
        alert(`Error al ${action} el usuario`);
      }
    }
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowUserModal(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleSubmitUser = async (userData) => {
    try {
      if (editingUser) {
        await userService.updateUser(editingUser.id, userData);
        alert('Usuario actualizado correctamente');
      } else {
        if (userData.rol === residenteRolId) {
          alert('Error: No se pueden crear residentes en esta sección. Use la gestión de residentes.');
          return;
        }
        await userService.createUser(userData);
        alert('Usuario creado correctamente');
      }
      setShowUserModal(false);
      loadUsers();
    } catch (error) {
      console.error('Error guardando usuario:', error);
      alert('Error al guardar el usuario: ' + error.message);
    }
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
          <h1 style={styles.title}>Gestión de Usuarios</h1>
          <p style={styles.subtitle}>Administra personal administrativo y permisos del sistema</p>
        </div>
        <button
          onClick={handleCreateUser}
          style={styles.addButton}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.addButtonHover)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.addButton)}
        >
          + Agregar Usuario
        </button>
      </div>

      <DataTable
        data={filteredUsers}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title={editingUser ? 'Editar Usuario' : 'Crear Usuario'}
      >
        <UserForm
          user={editingUser}
          onSubmit={handleSubmitUser}
          onCancel={() => setShowUserModal(false)}
          excludeResidenteRole={true}
        />
      </Modal>
    </div>
  );
};

export default UserManagementPage;
