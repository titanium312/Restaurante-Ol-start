import React, { useState, useEffect } from 'react';
import './TablaProvedores.css';
import api from '../../../../../../api'; // Usar axios de esta manera

export default function TablaProvedores({ setProveedorEditado, refresh }) {
  const [provedores, setProvedores] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [mensajeVisible, setMensajeVisible] = useState(false); // Controlar la visibilidad del mensaje
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null); // Estado para el proveedor seleccionado
  const [refreshTabla, setRefreshTabla] = useState(false);

  // Obtener los datos de los proveedores de la API usando axios
  useEffect(() => {
    api.obtenerDatos('/Hotel/Productos/provedores-productos')
      .then(data => setProvedores(data.data))
      .catch(err => console.error('Error al obtener los datos:', err));
  }, [refresh]);

  const handleEliminarProveedor = async (idProveedor) => {
    try {
      const result = await api.obtenerDatos(`/Hotel/Productos/Eliminarprovedor/${idProveedor}`, null, 'POST');

      if (result.message) {
        setProvedores(prevProvedores => prevProvedores.filter(proveedor => proveedor.ID_Provedor !== idProveedor));
        setMensaje(result.message);
        setMensajeVisible(true);
      } else if (result.error) {
        setMensaje(result.error);
        setMensajeVisible(true);
      } else {
        setMensaje('Error inesperado al intentar eliminar el proveedor.');
        setMensajeVisible(true);
      }
    } catch (error) {
      setMensaje('Hubo un error al conectar con el servidor.');
      setMensajeVisible(true);
    }
  };

  const handleMostrarProductos = (proveedor) => {
    // Si el proveedor ya está seleccionado, lo deseleccionamos (ocultamos productos)
    if (proveedorSeleccionado?.ID_Provedor === proveedor.ID_Provedor) {
      setProveedorSeleccionado(null);
    } else {
      setProveedorSeleccionado(proveedor);
    }
  };

  return (
    <div className="tabla-provedores">
      <h2>Proveedores y Productos</h2>
      <div id="mensaje" className={`message ${mensajeVisible ? 'visible' : ''}`}>
        {mensaje}
      </div>

      <table>
        <thead>
          <tr>
            <th>ID Proveedor</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Dirección</th>
            <th>Productos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {provedores.map(proveedor => (
            <React.Fragment key={proveedor.ID_Provedor}>
              <tr>
                <td>{proveedor.ID_Provedor}</td>
                <td>{proveedor.Nombre}</td>
                <td>{proveedor.Telefono}</td>
                <td>{proveedor.Correo}</td>
                <td>{proveedor.Direccion}</td>
                <td>{proveedor.Productos.length}</td>
                <td>
                  <button onClick={() => setProveedorEditado(proveedor)}>
                    Editar
                  </button>
                  <button onClick={() => handleEliminarProveedor(proveedor.ID_Provedor)}>
                    Eliminar
                  </button>
                  <button onClick={() => handleMostrarProductos(proveedor)}>
                    {proveedorSeleccionado?.ID_Provedor === proveedor.ID_Provedor ? 'Ocultar Productos' : 'Mostrar Productos'}
                  </button>
                </td>
              </tr>

              {/* Mostrar productos solo si el proveedor está seleccionado */}
              {proveedorSeleccionado?.ID_Provedor === proveedor.ID_Provedor && proveedor.Productos.length > 0 && (
                <tr>
                  <td colSpan="7">
                    <ul>
                      {proveedor.Productos.map(producto => (
                        <li key={producto.ID_Producto}>
                          <strong>{producto.Nombre}</strong>: {producto.Descripcion}, Precio: {producto.Precio_Unitario}, Stock: {producto.Stock}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
