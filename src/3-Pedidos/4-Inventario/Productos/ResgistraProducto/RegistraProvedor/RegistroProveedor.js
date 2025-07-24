import React, { useState } from 'react';
import api from '../../../../../api'; // Importa la API centralizada
import styles from './RegistroProveedor.module.css';

const RegistroProveedor = () => {
  const [proveedor, setProveedor] = useState({
    ID_Provedor: '',
    Nombre: '',
    Telefono: '',
    Correo: '',
    Direccion: ''
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);  // Para manejar el estado de carga

  // Función para manejar los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProveedor((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // Inicia el estado de carga

    try {
      // Realiza la solicitud POST usando la API centralizada
      const data = await api.obtenerDatos('/Hotel/provedores', proveedor, 'POST');

      if (data.message) {
        setMessage(data.message); // Mensaje de éxito
        setProveedor({ ID_Provedor: '', Nombre: '', Telefono: '', Correo: '', Direccion: '' }); // Limpiar el formulario
      } else {
        setMessage(`Error: ${data.error || 'Error desconocido'}`);
      }
    } catch (error) {
      setMessage(`Error al registrar proveedor: ${error.message}`);
    } finally {
      setLoading(false);  // Termina el estado de carga
    }
  };

  return (
    <div className={styles.registroProveedorContainer}>
      <h1 className={styles.registroProveedorTitulo}>Registrar Proveedor</h1>
      <form onSubmit={handleSubmit} className={styles.registroProveedorForm}>
        <div className={styles.registroProveedorRow}>
          <div className={styles.registroProveedorFormGroup}>
            <label htmlFor="ID_Provedor">ID Proveedor</label>
            <input
              type="text"
              id="ID_Provedor"
              name="ID_Provedor"
              value={proveedor.ID_Provedor}
              onChange={handleChange}
              className={styles.registroProveedorInput}
              required
            />
          </div>

          <div className={styles.registroProveedorFormGroup}>
            <label htmlFor="Nombre">Nombre del Proveedor</label>
            <input
              type="text"
              id="Nombre"
              name="Nombre"
              value={proveedor.Nombre}
              onChange={handleChange}
              className={styles.registroProveedorInput}
              required
            />
          </div>
        </div>

        <div className={styles.registroProveedorRow}>
          <div className={styles.registroProveedorFormGroup}>
            <label htmlFor="Telefono">Teléfono</label>
            <input
              type="text"
              id="Telefono"
              name="Telefono"
              value={proveedor.Telefono}
              onChange={handleChange}
              className={styles.registroProveedorInput}
              required
            />
          </div>

          <div className={styles.registroProveedorFormGroup}>
            <label htmlFor="Correo">Correo</label>
            <input
              type="email"
              id="Correo"
              name="Correo"
              value={proveedor.Correo}
              onChange={handleChange}
              className={styles.registroProveedorInput}
              required
            />
          </div>
        </div>

        <div className={styles.registroProveedorRow}>
          <div className={styles.registroProveedorFormGroup}>
            <label htmlFor="Direccion">Dirección</label>
            <input
              type="text"
              id="Direccion"
              name="Direccion"
              value={proveedor.Direccion}
              onChange={handleChange}
              className={styles.registroProveedorInput}
              required
            />
          </div>
        </div>

        <button type="submit" className={styles.registroProveedorBoton}>Registrar Proveedor</button>
      </form>

      {message && (
        <p className={`${styles.registroProveedorMensaje} ${
          message.includes('Error') 
            ? styles.registroProveedorMensajeError 
            : styles.registroProveedorMensajeExito
        }`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default RegistroProveedor;