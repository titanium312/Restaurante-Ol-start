import React, { useState, useEffect } from 'react';
import api from '../../../../api';
import styles from './MetodoPago.module.css';

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

  return loading ? (
    <p className={styles.metodoPago__loadingText}>Cargando métodos de pago...</p>
  ) : (
    <div className={styles.metodoPago__container}>
      <label htmlFor="metodo_pago" className={styles.metodoPago__label}>
        Método de Pago
      </label>
      <select
        id="metodo_pago"
        name="metodo_pago"
        onChange={handleSelectTipo}
        className={styles.metodoPago__select}
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
