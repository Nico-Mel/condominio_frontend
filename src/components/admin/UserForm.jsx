// src/components/admin/UserForm.jsx
import { useState, useEffect } from 'react';
import { rolesPermisosService } from '../../services/rolesPermisosService';

const UserForm = ({ user, onSubmit, onCancel, excludeResidenteRole = false, forceRol = null }) => {
  const [formData, setFormData] = useState({
    ci: '',
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
    rol: '',
    esta_activo: true
  });
  
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  // Cargar roles al montar el componente
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const rolesData = await rolesPermisosService.getRoles();
        setRoles(rolesData);
        
        // Filtrar roles si es necesario
        let rolesFiltrados = rolesData;
        if (excludeResidenteRole) {
          rolesFiltrados = rolesData.filter(rol => rol.nombre !== 'Residente');
        }
        
        setFilteredRoles(rolesFiltrados);
        
        // Si forceRol está definido, buscar el ID del rol forzado
        if (forceRol && !user) {
          const rolForzado = rolesData.find(r => r.nombre === forceRol);
          if (rolForzado) {
            setFormData(prev => ({
              ...prev,
              rol: rolForzado.id
            }));
          }
        }
      } catch (error) {
        console.error('Error cargando roles:', error);
      } finally {
        setLoadingRoles(false);
      }
    };
    
    loadRoles();
  }, [excludeResidenteRole, forceRol, user]);

  // Cargar datos del usuario cuando estén disponibles
  useEffect(() => {
    if (user && roles.length > 0) {
      setFormData({
        ci: user.ci || '',
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        correo: user.correo || '',
        password: '', // No cargar password en edición
        rol: user.rol || '', // ID del rol
        esta_activo: user.esta_activo !== undefined ? user.esta_activo : true
      });
    }
  }, [user, roles]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Limpiar datos para edición - no enviar password vacío
    const cleanedData = { ...formData };
    if (user && !cleanedData.password) {
      delete cleanedData.password;
    }
    
    onSubmit(cleanedData);
  };

  // Si forceRol está activo, ocultar el selector de roles
  const showRoleSelector = !forceRol;

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          CI:
        </label>
        <input
          type="text"
          name="ci"
          value={formData.ci}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Nombre:
        </label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Apellido:
        </label>
        <input
          type="text"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Email:
        </label>
        <input
          type="email"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Contraseña:
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required={!user}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
        {user && (
          <small style={{ color: '#666' }}>
            Dejar en blanco para mantener la contraseña actual
          </small>
        )}
      </div>

      {showRoleSelector && (
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Rol:
          </label>
          <select
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            required
            disabled={loadingRoles}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: loadingRoles ? '#f5f5f5' : 'white'
            }}
          >
            <option value="">{loadingRoles ? 'Cargando roles...' : 'Seleccionar rol'}</option>
            {filteredRoles.map(rol => (
              <option key={rol.id} value={rol.id}>
                {rol.nombre}
              </option>
            ))}
          </select>
          {excludeResidenteRole && (
            <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
              Nota: Los residentes se gestionan en la sección específica
            </small>
          )}
        </div>
      )}

      {forceRol && (
        <div style={{ 
          marginBottom: '15px', 
          padding: '10px',
          borderRadius: '4px'
        }}>
          <strong>Rol:</strong> {forceRol}
          <input type="hidden" name="rol" value={formData.rol} />
        </div>
      )}


      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '10px 20px',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {user ? 'Actualizar' : 'Crear'} Usuario
        </button>
      </div>
    </form>
  );
};

export default UserForm;