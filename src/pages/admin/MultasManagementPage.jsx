// src/pages/admin/MultasManagementPage.jsx

import { useState, useEffect } from 'react';

import { multaService } from '../../services/multaService';

import Modal from '../../components/shared/Modal';

import DataTable from '../../components/shared/DataTable';



const MultasManagementPage = () => {

  const [multas, setMultas] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [editingMulta, setEditingMulta] = useState(null);



  useEffect(() => {

    loadMultas();

  }, []);



  const loadMultas = async () => {

    try {

      setLoading(true);

      setError(null);

     

      const multasData = await multaService.getAll();

      setMultas(Array.isArray(multasData) ? multasData : []);

     

    } catch (error) {

      console.error('❌ Error loading multas:', error);

      setError('Error al cargar las multas');

      setMultas([]);

    } finally {

      setLoading(false);

    }

  };



  const handleCreate = () => {

    setEditingMulta(null);

    setShowModal(true);

  };



  const handleEdit = (multa) => {

    setEditingMulta(multa);

    setShowModal(true);

  };



  const handleDelete = async (multa) => {

    if (window.confirm('¿Estás seguro de que quieres eliminar esta multa?')) {

      try {

        await multaService.delete(multa.id);

        loadMultas();

      } catch (error) {

        console.error('Error deleting multa:', error);

        alert('Error al eliminar la multa');

      }

    }

  };



  const handleConvertirACuota = async (multa) => {

    if (window.confirm('¿Convertir esta multa en detalle de cuota?')) {

      try {

        await multaService.convertirACuota(multa.id);

        alert('Multa convertida exitosamente');

        loadMultas();

      } catch (error) {

        console.error('Error converting multa:', error);

        alert('Error al convertir la multa');

      }

    }

  };



  const handleSubmit = async (formData) => {

    try {

      if (editingMulta) {

        await multaService.update(editingMulta.id, formData);

      } else {

        // Obtener el usuario actual del localStorage

        const user = JSON.parse(localStorage.getItem('user') || '{}');

        formData.creado_por = user.id;

       

        await multaService.create(formData);

      }

      setShowModal(false);

      loadMultas();

    } catch (error) {

      console.error('Error saving multa:', error);

      alert('Error al guardar la multa');

    }

  };



  const getEstadoColor = (estado) => {

    const colors = {

      pendiente: '#dc3545',

      pagado: '#28a745',

      parcial: '#ffc107'

    };

    return colors[estado] || '#6c757d';

  };



  // Columnas para DataTable

  const columns = [

    {

      key: 'residencia',

      label: 'Residencia',

      format: (value) => {

        // Si value es un objeto (cuando viene nested), usar su código

        if (value && typeof value === 'object') {

          return value.codigo || `Residencia ${value.id}`;

        }

        // Si es solo el ID, mostrar el ID

        return `Residencia ${value}`;

      }

    },

    {

      key: 'monto',

      label: 'Monto',

      format: (value) => `$${parseFloat(value).toFixed(2)}`

    },

    {

      key: 'motivo',

      label: 'Motivo',

      format: (value) => value.length > 50 ? `${value.substring(0, 50)}...` : value

    },

    {

      key: 'fecha_incidente',

      label: 'Fecha Incidente',

      format: (value) => value ? new Date(value).toLocaleDateString() : 'N/A'

    },

    {

      key: 'estado',

      label: 'Estado',

      format: (value) => (

        <span style={{

          padding: '4px 8px',

          borderRadius: '12px',

          fontSize: '12px',

          backgroundColor: getEstadoColor(value),

          color: 'white'

        }}>

          {value === 'pendiente' ? 'Pendiente' :

           value === 'pagado' ? 'Pagado' :

           value === 'parcial' ? 'Parcial' : value}

        </span>

      )

    },

    {

      key: 'detalle_cuota',

      label: 'En Cuota',

      format: (value) => value ? '✅' : '❌'

    }

  ];



  if (loading) {

    return (

      <div style={{ padding: '20px', textAlign: 'center' }}>

        <div>Cargando multas...</div>

      </div>

    );

  }



  if (error) {

    return (

      <div style={{ padding: '20px', textAlign: 'center' }}>

        <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>

        <button

          onClick={loadMultas}

          style={{

            padding: '10px 20px',

            background: '#007bff',

            color: 'white',

            border: 'none',

            borderRadius: '4px',

            cursor: 'pointer'

          }}

        >

          Reintentar

        </button>

      </div>

    );

  }



  return (

    <div style={{ padding: '20px' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>

        <h1>Gestión de Multas</h1>

        <button

          onClick={handleCreate}

          style={{

            padding: '8px 16px',

            background: '#dc3545',

            color: 'white',

            border: 'none',

            borderRadius: '4px',

            cursor: 'pointer'

          }}

        >

          Crear Multa

        </button>

      </div>



      {multas.length === 0 ? (

        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>

          <p>No hay multas registradas.</p>

          <button

            onClick={handleCreate}

            style={{

              padding: '10px 20px',

              background: '#dc3545',

              color: 'white',

              border: 'none',

              borderRadius: '4px',

              cursor: 'pointer',

              marginTop: '10px'

            }}

          >

            Crear la primera multa

          </button>

        </div>

      ) : (

        <DataTable

          data={multas}

          columns={columns}

          onEdit={handleEdit}

          onDelete={handleDelete}

          actions={[

            {

              label: 'Convertir a Cuota',

              action: handleConvertirACuota,

              color: '#28a745',

              condition: (item) => !item.detalle_cuota

            }

          ]}

        />

      )}



      <Modal

        isOpen={showModal}

        onClose={() => setShowModal(false)}

        title={editingMulta ? 'Editar Multa' : 'Crear Multa'}

        size="large"

      >

        <MultaForm

          multa={editingMulta}

          onSubmit={handleSubmit}

          onCancel={() => setShowModal(false)}

        />

      </Modal>

    </div>

  );

};



// Componente Form para Multa (simplificado)

const MultaForm = ({ multa, onSubmit, onCancel }) => {

  const [formData, setFormData] = useState({

    residencia: '',

    monto: '',

    motivo: '',

    descripcion: '',

    fecha_incidente: new Date().toISOString().split('T')[0]

  });



  useEffect(() => {

    if (multa) {

      setFormData({

        residencia: multa.residencia?.id || multa.residencia || '',

        monto: multa.monto || '',

        motivo: multa.motivo || '',

        descripcion: multa.descripcion || '',

        fecha_incidente: multa.fecha_incidente || new Date().toISOString().split('T')[0]

      });

    }

  }, [multa]);



  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData(prev => ({

      ...prev,

      [name]: value

    }));

  };



  const handleSubmit = (e) => {

    e.preventDefault();

    onSubmit(formData);

  };



  return (

    <form onSubmit={handleSubmit} style={{ width: '500px', padding: '20px' }}>

      <div style={{ marginBottom: '15px' }}>

        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>

          ID de Residencia *

        </label>

        <input

          type="number"

          name="residencia"

          value={formData.residencia}

          onChange={handleChange}

          required

          placeholder="Ej: 1, 2, 3..."

          style={{

            width: '100%',

            padding: '8px',

            border: '1px solid #ddd',

            borderRadius: '4px'

          }}

        />

        <small style={{ color: '#666', fontSize: '12px' }}>

          Ingresa el ID numérico de la residencia

        </small>

      </div>



      <div style={{ marginBottom: '15px' }}>

        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>

          Monto de la Multa *

        </label>

        <input

          type="number"

          name="monto"

          value={formData.monto}

          onChange={handleChange}

          step="0.01"

          min="0"

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

          Motivo *

        </label>

        <input

          type="text"

          name="motivo"

          value={formData.motivo}

          onChange={handleChange}

          required

          placeholder="Ej: Ruido excesivo, Daño a propiedad común..."

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

          Fecha del Incidente *

        </label>

        <input

          type="date"

          name="fecha_incidente"

          value={formData.fecha_incidente}

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



      <div style={{ marginBottom: '20px' }}>

        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>

          Descripción Detallada *

        </label>

        <textarea

          name="descripcion"

          value={formData.descripcion}

          onChange={handleChange}

          rows="4"

          required

          placeholder="Describa en detalle la infracción cometida..."

          style={{

            width: '100%',

            padding: '8px',

            border: '1px solid #ddd',

            borderRadius: '4px',

            resize: 'vertical'

          }}

        />

      </div>



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

            background: '#dc3545',

            color: 'white',

            border: 'none',

            borderRadius: '4px',

            cursor: 'pointer'

          }}

        >

          {multa ? 'Actualizar' : 'Crear'} Multa

        </button>

      </div>

    </form>

  );

};



export default MultasManagementPage;