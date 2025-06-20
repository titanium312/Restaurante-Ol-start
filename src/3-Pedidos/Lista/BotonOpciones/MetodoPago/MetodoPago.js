import React, { useState, useEffect } from 'react';
import api from '../../../../api';

const MetodoPago = ({ onTipoSelect }) => {
  const [tiposPago, setTiposPago] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTiposPago = async () => {
      try {
        const data = await api.obtenerDatos('/Hotel/Recepcion/metodos-pago');
        setTiposPago(data);
      } catch (error) {
        console.error('Error al obtener los métodos de pago:', error.message);
        alert('No se pudo cargar la lista de métodos de pago');
      } finally {
        setLoading(false);
      }
    };

    loadTiposPago();
  }, []);

  const handleSelectTipo = (e) => {
    onTipoSelect(e.target.value);
  };

  const styles = {
    container: {
      marginBottom: 20,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    label: {
      display: 'block',
      marginBottom: 8,
      fontWeight: '600',
      color: '#333',
      fontSize: '1rem',
    },
    select: {
      width: '100%',
      padding: '10px 12px',
      borderRadius: '8px',
      border: '1.8px solid #ccc',
      fontSize: '1rem',
      color: '#444',
      outline: 'none',
      transition: 'border-color 0.3s ease',
      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
      cursor: 'pointer',
    },
    selectFocus: {
      borderColor: '#4caf50',
      boxShadow: '0 0 8px #4caf50',
    },
    loadingText: {
      fontStyle: 'italic',
      color: '#666',
    },
  };

  // To add focus style we need a little state
  const [focused, setFocused] = useState(false);

  return loading ? (
    <p style={styles.loadingText}>Cargando métodos de pago...</p>
  ) : (
    <div style={styles.container}>
      <label htmlFor="metodo_pago" style={styles.label}>
        Método de Pago
      </label>
      <select
        id="metodo_pago"
        name="metodo_pago"
        onChange={handleSelectTipo}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...styles.select,
          ...(focused ? styles.selectFocus : {}),
        }}
      >
        <option value="">Selecciona un método de pago</option>
        {tiposPago.length > 0 ? (
          tiposPago.map((tipo) => (
            <option key={tipo.ID_MetodoPago} value={tipo.ID_MetodoPago}>
              {tipo.Descripcion}
            </option>
          ))
        ) : (
          <option value="">No hay métodos de pago disponibles</option>
        )}
      </select>
    </div>
  );
};

export default MetodoPago;
