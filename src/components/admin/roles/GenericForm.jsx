// src/components/admin/roles/GenericForm.jsx
import { useState, useEffect } from 'react';

const GenericForm = ({ 
  item, 
  formFields, 
  emptyForm, 
  onSubmit, 
  onCancel,
  dynamicOptions = {} 
}) => {
  const [formData, setFormData] = useState(emptyForm);
  const [enhancedFormFields, setEnhancedFormFields] = useState(formFields);

  useEffect(() => {
    if (item) {
      setFormData({ ...emptyForm, ...item });
    } else {
      setFormData(emptyForm);
    }
  }, [item, emptyForm]);

  // Cargar opciones dinámicas
  useEffect(() => {
    const updatedFields = formFields.map(field => {
      if (field.name in dynamicOptions) {
        return {
          ...field,
          options: dynamicOptions[field.name]
        };
      }
      return field;
    });
    setEnhancedFormFields(updatedFields);
  }, [formFields, dynamicOptions]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const cleanedData = { ...formData };
    Object.keys(cleanedData).forEach(key => {
      if (cleanedData[key] === '' || cleanedData[key] === null) {
        delete cleanedData[key];
      }
    });
    
    onSubmit(cleanedData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {enhancedFormFields.map((field) => (
        <div key={field.name} style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            {field.label}:
          </label>
          {field.type === 'select' ? (
            <select
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              required={field.required}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              <option value="">Seleccionar {field.label}</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : field.type === 'checkbox' ? (
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                name={field.name}
                checked={formData[field.name] || false}
                onChange={handleChange}
              />
              {field.label}
            </label>
          ) : (
            <input
              type={field.type || 'text'}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              required={field.required}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          )}
        </div>
      ))}

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
        <button type="button" onClick={onCancel} style={{ padding: '10px 20px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}>
          Cancelar
        </button>
        <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
          {item ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};

export default GenericForm;