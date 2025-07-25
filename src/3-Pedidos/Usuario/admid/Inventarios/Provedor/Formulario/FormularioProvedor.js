import React, { useState, useEffect } from 'react';
import api from '../../../../../../api'; // Ensure correct path
import styles from './FormularioProveedor.module.css'; // Ensure correct path
import TablaProvedores from '../Tabla/TablaProvedores';


export default function FormularioProveedor({ proveedorEditado, setProveedorEditado }) {
  const [ID_Provedor, setID_Provedor] = useState('');
  const [Nombre, setNombre] = useState('');
  const [Telefono, setTelefono] = useState('');
  const [Correo, setCorreo] = useState('');
  const [Direccion, setDireccion] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (proveedorEditado) {
      setID_Provedor(proveedorEditado.ID_Provedor);
      setNombre(proveedorEditado.Nombre);
      setTelefono(proveedorEditado.Telefono);
      setCorreo(proveedorEditado.Correo);
      setDireccion(proveedorEditado.Direccion);
    }
  }, [proveedorEditado]);

  const limpiarFormulario = () => {
    setID_Provedor('');
    setNombre('');
    setTelefono('');
    setCorreo('');
    setDireccion('');
    setProveedorEditado(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setRespuesta('');

    const data = {
      ID_Provedor: parseInt(ID_Provedor),
      Nombre,
      Telefono,
      Correo,
      Direccion,
    };

    try {
      const endpoint = proveedorEditado
        ? `/Hotel/Productos/Actualizarprovedor/${ID_Provedor}` // If editing
        : `/Hotel/Productos/Crearprovedores`; // If creating

      const method = proveedorEditado ? 'PUT' : 'POST'; // PUT for editing, POST for creating

      const result = await api.obtenerDatos(endpoint, data, method);

      setRespuesta(result.message || 'Operación exitosa.');

      setTimeout(() => {
        limpiarFormulario();
        setRespuesta('');
      }, 3000);

    } catch (err) {
      console.error('Error:', err);
      setRespuesta('Error: ' + err.message);
    } finally {
      setCargando(false);
    }
  };

  const handleCancelar = () => {
    limpiarFormulario();
    setRespuesta('');
  };

  return (
    <div className={`${styles.fp_formulario} ${cargando ? styles.CARGANDO : ''}`}>
      <h1 className={styles.fp_titulo}>{proveedorEditado ? 'Editar Proveedor' : 'Crear Proveedor'}</h1>

      <form id="proveedorForm" onSubmit={handleSubmit} className={styles.fp_grid}>
        {/* Fila 1 */}
        <div className={styles.fp_field}>
          <label htmlFor="ID_Provedor" className={styles.fp_label}>ID Proveedor:</label>
          <input
            type="number"
            id="ID_Provedor"
            value={ID_Provedor}
            onChange={(e) => setID_Provedor(e.target.value)}
            required
            disabled={cargando}
            placeholder="Ingrese el ID del proveedor"
            className={styles.fp_input}
          />
        </div>

        <div className={styles.fp_field}>
          <label htmlFor="Nombre" className={styles.fp_label}>Nombre:</label>
          <input
            type="text"
            id="Nombre"
            value={Nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            disabled={cargando}
            placeholder="Ingrese el nombre del proveedor"
            className={styles.fp_input}
          />
        </div>

        {/* Fila 2 */}
        <div className={styles.fp_field}>
          <label htmlFor="Telefono" className={styles.fp_label}>Teléfono:</label>
          <input
            type="tel"
            id="Telefono"
            value={Telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
            disabled={cargando}
            placeholder="Ingrese el número de teléfono"
            className={styles.fp_input}
          />
        </div>

        <div className={styles.fp_field}>
          <label htmlFor="Correo" className={styles.fp_label}>Correo:</label>
          <input
            type="email"
            id="Correo"
            value={Correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            disabled={cargando}
            placeholder="correo@ejemplo.com"
            className={styles.fp_input}
          />
        </div>

        {/* Fila 3: Dirección ocupa toda la fila */}
        <div className={`${styles.fp_field} ${styles.fp_fullWidth}`}>
          <label htmlFor="Direccion" className={styles.fp_label}>Dirección:</label>
          <input
            type="text"
            id="Direccion"
            value={Direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
            disabled={cargando}
            placeholder="Ingrese la dirección completa"
            className={styles.fp_input}
          />
        </div>

        {/* Fila 4: Botones ocupan toda la fila */}
        <div className={`${styles.fp_botonSubmit} ${styles.fp_fullWidth}`}>
          <button type="submit" disabled={cargando}>
            {cargando ? 'Procesando...' : (proveedorEditado ? 'Actualizar' : 'Crear Proveedor')}
          </button>

          {proveedorEditado && (
            <button
              type="button"
              onClick={handleCancelar}
              disabled={cargando}
              className={styles.fp_botonCancelar}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <TablaProvedores setProveedorEditado={setProveedorEditado} proveedorEditado={proveedorEditado} />
      {respuesta && (
        <div className={`${styles.fp_mensaje} ${respuesta.startsWith('Error') ? styles.error : styles.exito}`}>
          {respuesta}
        </div>
      )}
    </div>
  );
}
