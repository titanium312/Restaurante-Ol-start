import React, { useState } from 'react';
import styles from './InsertarPedido.module.css';
import BuscadorServicio from './BuscadorServicio/BuscardorServicio';
import api from '../../api'; // Ajusta esta ruta según la ubicación real del archivo api.js

function InsertarPedido({ onSubmit, mensaje }) {
  const [idServicio, setIdServicio] = useState('');
  const [nombreProducto, setNombreProducto] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precio, setPrecio] = useState('');
  const [mesa, setMesa] = useState('');
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [facturaId, setFacturaId] = useState(null);
  const [message, setMessage] = useState('');

  const userID = localStorage.getItem('userId');
  const username = localStorage.getItem('username');

  const handleServiceSelect = (service) => {
    setIdServicio(service.ID_Servicio);
    setNombreProducto(service.Nombre);
    setPrecio(service.Precio);
  };

  const agregarItem = () => {
    if (items.some(item => item.idServicio === idServicio)) {
      alert("Este servicio ya ha sido agregado.");
      return;
    }

    if (!idServicio || !nombreProducto || !cantidad || !precio || cantidad <= 0) {
      alert("Por favor complete todos los campos con valores válidos.");
      return;
    }

    const newItem = { idServicio, nombreProducto, cantidad, precio };
    setItems([...items, newItem]);

    setIdServicio('');
    setNombreProducto('');
    setCantidad('');
    setPrecio('');
    setSearchTerm('');
  };

  const quitarItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleSubmit = async () => {
    if (!mesa) {
      alert('Por favor, ingrese una mesa válida');
      return;
    }

    const orders = items.map(item => ({
      ID_Servicio: item.idServicio,
      Cantidad: item.cantidad,
      mesa: mesa,
    }));

    try {
      const data = await api.obtenerDatos('/Hotel/restaurante/recibir-pedido', {
        orders,
        ID_usuario: userID,
      });

      if (data.message) {
        setMessage(data.message);
        setFacturaId(data.facturaId);
        alert(`Pedido recibido y procesado correctamente. ID Factura: ${data.facturaId}`);

        setItems([]);
        setIdServicio('');
        setNombreProducto('');
        setCantidad('');
        setPrecio('');
        setMesa('');
        setSearchTerm('');
      } else {
        alert('Error al insertar el pedido');
      }
    } catch (error) {
      console.error('Error al enviar el pedido:', error.message);
      alert('Hubo un problema al enviar el pedido');
    }
  };

  return (
    <div className={styles.formularioContenedor}>
      <h1 className={styles.tituloFormulario}>Formulario de Pedido</h1>

      <div className={styles.grillaCampos}>
        <BuscadorServicio 
          onSelect={handleServiceSelect} 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <input
          id="nombreProducto"
          type="text"
          className={styles.campoEntrada}
          placeholder="Nombre Producto"
          value={nombreProducto}
          onChange={(e) => setNombreProducto(e.target.value)}
        />
        <button className={styles.botonAccion} onClick={agregarItem}>Agregar</button>
      </div>

      <div className={styles.grillaCampos}>
        <input
          id="cantidad"
          type="number"
          className={styles.campoEntrada}
          placeholder="Cantidad"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
        />
        <input
          id="precio"
          type="text"
          className={styles.campoEntrada}
          placeholder="Precio"
          value={precio}
          readOnly
        />
        <input
          id="mesa"
          type="text"
          className={styles.campoEntrada}
          placeholder="Mesa"
          value={mesa}
          onChange={(e) => setMesa(e.target.value)}
        />
      </div>

      <div className={styles.tablaItemsScroll}>
        <table className={styles.tablaProductos}>
          <thead>
            <tr>
              <th className={styles.thTabla}>ID Servicio</th>
              <th className={styles.thTabla}>Nombre Producto</th>
              <th className={styles.thTabla}>Cantidad</th>
              <th className={styles.thTabla}>Precio</th>
              <th className={styles.thTabla}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>Vacío</td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={index}>
                  <td className={styles.tdTabla}>{item.idServicio}</td>
                  <td className={styles.tdTabla}>{item.nombreProducto}</td>
                  <td className={styles.tdTabla}>{item.cantidad}</td>
                  <td className={styles.tdTabla}>{item.precio}</td>
                  <td><button className={styles.botonQuitarItem} onClick={() => quitarItem(index)}>Quitar</button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.grupoBotonesAccion}>
        <button className={styles.botonAccion} onClick={handleSubmit}>Insertar</button>
        <button className={styles.botonAccion}>Calcular</button>
      </div>

      {facturaId && (
        <div className={styles.informacionFactura}>
          <p>Factura ID: {facturaId}</p>
        </div>
      )}

      {message && <div className={styles.mensajeAlerta}>{message}</div>}
    </div>
  );
}

export default InsertarPedido;
