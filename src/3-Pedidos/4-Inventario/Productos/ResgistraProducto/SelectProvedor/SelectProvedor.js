import React, { useEffect, useState } from "react";
import api from '../../../../../api'; // Importa la API
import styles from './SelectProveedor.module.css'; // Suponiendo que tienes estilos para el select

const SelectProveedor = ({ valueProveedor, onChangeProveedor }) => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);  // Para mostrar un estado de carga

  useEffect(() => {
    const obtenerProveedores = async () => {
      try {
        const data = await api.obtenerDatos("/Hotel/productos/proveedores");
        setProveedores(data.data);  // Suponiendo que la respuesta tiene la estructura { data: [...] }
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los proveedores:", error);
        setLoading(false);
      }
    };

    obtenerProveedores();
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
