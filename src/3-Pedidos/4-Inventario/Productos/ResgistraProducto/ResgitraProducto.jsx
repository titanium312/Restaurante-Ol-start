import React, { useState } from 'react';
import styles from './RegistraProducto.module.css';
import SelectProveedor from "./SelectProvedor/SelectProvedor";
import RegistroProveedor from './RegistraProvedor/RegistroProveedor';
import api from '../../../../../api'; // Importar la API centralizada

function RegistraProducto() {
  const [producto, setProducto] = useState({
    ID_Producto: '',
    nombre: '',
    descripcion: '',
    Precio_Unitario: '',
    Stock: '',
    ID_Provedor: '',
    ID_producto_tipo: '',
  });

  const [mensaje, setMensaje] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Función para manejar cambios en los campos de producto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto((prevProducto) => ({
      ...prevProducto,
      [name]: value,
    }));
  };

  // Función para manejar el envío del formulario de producto
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validar que todos los campos requeridos estén llenos
    if (!producto.ID_Producto || !producto.nombre || !producto.descripcion || !producto.ID_producto_tipo) {
      setMensaje('Por favor, complete todos los campos requeridos.');
      return;
    }

    const productData = {
      ID_Producto: producto.ID_Producto,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      Precio_Unitario: parseFloat(producto.Precio_Unitario),
      Stock: parseInt(producto.Stock),
      ID_Provedor: producto.ID_Provedor,
      ID_producto_tipo: producto.ID_producto_tipo,
    };

    try {
      // Enviar los datos del producto utilizando la API
      const response = await api.obtenerDatos('/Hotel/productos', productData, 'POST');
      setMensaje(response.message || 'Producto registrado exitosamente');
    } catch (error) {
      setMensaje('Error al registrar el producto: ' + error.message);
    }
  };

  // Función para abrir el modal de registro de proveedor
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Función para cerrar el modal de registro de proveedor
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles['product-container']}>
      <h1 className={styles['product-heading']}>Formulario para Crear Producto</h1>

      {mensaje && <div className={styles['product-message']}>{mensaje}</div>}

      <form onSubmit={handleSubmit}>
        <div className={styles['product-form-container']}>
          <div className={styles['product-form-group']}>
            <label htmlFor="ID_Producto">ID Producto:</label>
            <input
              type="number"
              id="ID_Producto"
              name="ID_Producto"
              value={producto.ID_Producto}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles['product-form-group']}>
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={producto.nombre}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles['product-form-container']}>
          <div className={styles['product-form-group']}>
            <label htmlFor="descripcion">Descripción:</label>
            <input
              type="text"
              id="descripcion"
              name="descripcion"
              value={producto.descripcion}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles['product-form-group']}>
            <label htmlFor="Precio_Unitario">Precio Unitario:</label>
            <input
              type="number"
              step="0.01"
              id="Precio_Unitario"
              name="Precio_Unitario"
              value={producto.Precio_Unitario}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles['product-form-container']}>
          <div className={styles['product-form-group']}>
            <label htmlFor="Stock">Stock:</label>
            <input
              type="number"
              id="Stock"
              name="Stock"
              value={producto.Stock}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles['product-form-group']}>
            <SelectProveedor
              valueProveedor={producto.ID_Provedor}
              onChangeProveedor={(e) => setProducto({ ...producto, ID_Provedor: e.target.value })}
              className={styles['select']}
            />
          </div>
        </div>

        <div className={styles['product-form-container']}>
          <div className={styles['product-form-group']}>
            <label htmlFor="ID_producto_tipo">ID Tipo Producto:</label>
            <input
              type="number"
              id="ID_producto_tipo"
              name="ID_producto_tipo"
              value={producto.ID_producto_tipo}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className={styles['product-submit-button']}>
          Crear Producto
        </button>

        <button type="button" onClick={openModal} className={styles['product-open-modal-button']}>
          Registrar Proveedor
        </button>
      </form>

      {isModalOpen && (
        <div className={styles['product-modal']}>
          <div className={styles['product-modal-content']}>
            <button onClick={closeModal} className={styles['product-close-modal-button']}>Cerrar</button>
            <RegistroProveedor />
          </div>
        </div>
      )}
    </div>
  );
}

export default RegistraProducto;
