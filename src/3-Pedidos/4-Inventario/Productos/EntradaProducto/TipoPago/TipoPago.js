import React, { useEffect, useState } from "react";
import styles from './TipoPago.module.css';
import api from '../../../../../api'; // Importa la API

const TipoPago = ({ value, onChange }) => {
  const [tiposPago, setTiposPago] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Usamos la API para obtener los tipos de pago
    api.obtenerDatos('/Hotel/metodos-pago')
      .then((data) => {
        setTiposPago(data); // Actualizamos el estado con los tipos de pago
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener los tipos de pago:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.selectContainer}>
      <label className={styles.label}>Método de Pago:</label>
      <select
        name="metodoPago"
        value={value}  // El valor está vinculado al estado de EntradaProducto
        onChange={onChange}  // Actualiza el estado cuando el valor cambia
        className={styles.select}
      >
        <option value="">Selecciona un Tipo de Pago</option>
        {loading ? (
          <option disabled>Cargando...</option>
        ) : (
          tiposPago.map((tipo) => (
            <option key={tipo.ID_MetodoPago} value={tipo.ID_MetodoPago}>
              {tipo.Descripcion}
            </option>
          ))
        )}
      </select>
    </div>
  );
};

export default TipoPago;
