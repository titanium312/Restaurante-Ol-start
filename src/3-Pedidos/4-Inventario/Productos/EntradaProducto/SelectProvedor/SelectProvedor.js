import React, { useEffect, useState } from 'react';
import styles from './SelectProveedor.module.css'; // Suponiendo que tienes estilos para el select
import api from '../../../../../api'; // Asegúrate de que el path a 'api' es correcto

const SelectProveedor = ({ valueProveedor, onChangeProveedor }) => {
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    // Obtener los proveedores desde el servidor utilizando el objeto 'api'
    api.obtenerDatos('/Hotel/productos/proveedores')
      .then((data) => {
        setProveedores(data.data);  // Suponiendo que la respuesta tiene la estructura { data: [...] }
      })
      .catch((error) => {
        console.error("Error al obtener los proveedores:", error);
      });
  }, []);

  return (
    <div className={styles.selectContainer}>
      {/* Select de Proveedor */}
      <label className={styles.label}>Proveedor:</label>
      <select
        name="idProveedor"
        value={valueProveedor}  // El valor del select se enlaza con el estado valueProveedor
        onChange={onChangeProveedor}  // Enlazamos el evento onChange con el handler para el proveedor
        className={styles.select}
      >
        <option value="">Selecciona un proveedor</option>
        {proveedores.map((proveedor) => (
          <option key={proveedor.ID_Provedor} value={proveedor.ID_Provedor}>
            {proveedor.Nombre} - {proveedor.Telefono} {/* O cualquier detalle adicional que quieras mostrar */}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectProveedor;
