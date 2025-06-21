import React, { useState } from 'react';
import styles from './InsertarPedido.module.css';
import BuscadorServicio from './BuscadorServicio/BuscardorServicio';
import api from '../../api';

function InsertarPedido() {
  const [idServicio, setIdServicio] = useState('');
  const [nombreProducto, setNombreProducto] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precio, setPrecio] = useState('');
  const [mesa, setMesa] = useState('');
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [facturaId, setFacturaId] = useState('');
  const [facturaBuscada, setFacturaBuscada] = useState(false);
  const [message, setMessage] = useState('');
  const [fechaEmision, setFechaEmision] = useState('');

  
  const role = localStorage.getItem('role');
  const userID = localStorage.getItem('userId');


  const verificarEstadoCaja = async () => {
    const hoy = new Date().toISOString().split('T')[0];
    try {
      const data = await api.obtenerDatos(`/hotel/restaurante/CajaEstado?fecha=${hoy}`, {});
      if (!Array.isArray(data) || data.length === 0) {
        alert('La caja todavía no ha sido abierta hoy.');
        return false;
      }
      const ultimoEstado = data.sort((a, b) => new Date(b.Fecha) - new Date(a.Fecha))[0];
      if (ultimoEstado.Descripcion.toLowerCase() === 'cerrada') {
        alert('La caja está cerrada. No puedes insertar pedidos.');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error al verificar estado de caja:', error);
      alert('Error al verificar el estado de la caja');
      return false;
    }
  };

  const buscarFactura = async () => {
    if (!facturaId) return alert('Ingresa un ID de factura');
    try {
      const data = await api.obtenerDatos(`/Hotel/restaurante/servicio/Recepcion-ServiciosList?idFactura=${facturaId}`);
      const productos = (data.Bar || []).map(p => ({
        idServicio: p.ID_Servicio,
        nombreProducto: p.Nombre_Servicio,
        cantidad: p.Cantidad,
        precio: p.Precio_Unitario,
        mesa: p.mesa,
      }));
      setItems(productos);
      setMesa(productos[0]?.mesa || '');
      setFacturaBuscada(true);
    } catch {
      alert('No se pudo obtener la factura');
      setItems([]);
      setMesa('');
      setFacturaBuscada(false);
    }
  };

  const handleServiceSelect = service => {
    if (items.some(it => it.idServicio === service.ID_Servicio)) {
      return alert('Ya agregaste este servicio');
    }
    setIdServicio(service.ID_Servicio);
    setNombreProducto(service.Nombre);
    setPrecio(service.Precio);
  };

  const agregarItem = () => {
    if (!idServicio || !nombreProducto || !cantidad || cantidad <= 0 || !precio) {
      return alert('Completa todos los campos válidos');
    }
    const newItem = { idServicio, nombreProducto, cantidad, precio };
    setItems([...items, newItem]);
    setIdServicio('');
    setNombreProducto('');
    setCantidad('');
    setPrecio('');
    setSearchTerm('');
  };

  const quitarItem = idx => setItems(items.filter((_, i) => i !== idx));

  const handleItemChange = (idx, value) => {
    const updated = [...items];
    updated[idx].cantidad = value;
    setItems(updated);
  };

  const calcularTotal = () => {
    return items.reduce((acc, it) => acc + (parseFloat(it.precio) * parseFloat(it.cantidad || 0)), 0).toFixed(2);
  };

  const handleSubmit = async () => {
    const cajaAbierta = await verificarEstadoCaja();
    if (!cajaAbierta) return;

    if (!mesa) return alert('Ingresa mesa');
    if (items.length === 0) return alert('Ingresa al menos un pedido');

    const payload = {
      ID_usuario: userID,
      ID_Factura: facturaBuscada ? Number(facturaId) : undefined,
      orders: items.map(it => ({
        ID_Servicio: it.idServicio,
        Cantidad: Number(it.cantidad),
        mesa,
      })),
      in: facturaBuscada,
    };

    if (!facturaBuscada && fechaEmision) {
      payload.Fecha_Emision = fechaEmision;
    }

    try {
      const res = await api.obtenerDatos('/Hotel/restaurante/recibir-pedido', payload);
      const msg = res.message || 'Guardado con éxito';
      setMessage(msg);
      alert(msg);
      if (!facturaBuscada && res.facturaId) {
        setFacturaId(res.facturaId);
        setFacturaBuscada(true);
      }
    } catch {
      alert('Error en el servidor');
    }
  };

  return (
    <div className={styles.formularioContenedor}>
      <h1 className={styles.tituloFormulario}>Pedido / Actualizar Factura</h1>
      {(role === 'Administrador' || role === 'Editor') && (
        <div className={styles.grillaCampos}>
          <input
            type="text"
            placeholder="ID Factura"
            value={facturaId}
            onChange={e => setFacturaId(e.target.value)}
          />
          <button onClick={buscarFactura}>Buscar</button>
          {!facturaBuscada && (
            <input
              type="date"
              value={fechaEmision}
              onChange={e => setFechaEmision(e.target.value)}
            />
          )}
        </div>
      )}

      <div className={styles.grillaCampos}>
        <BuscadorServicio
          onSelect={handleServiceSelect}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <input type="text" placeholder="Nombre Producto" value={nombreProducto} readOnly />
        <input type="text" placeholder="Mesa" value={mesa} onChange={e => setMesa(e.target.value)} />
      </div>

      <div className={styles.grillaCampos}>
        <input
          type="number"
          placeholder="Cantidad"
          value={cantidad}
          onChange={e => setCantidad(e.target.value)}
        />
        <input type="text" placeholder="Precio" value={precio} readOnly />
        <button onClick={agregarItem}>Agregar</button>
      </div>

      <table className={styles.tablaProductos}>
        <thead>
          <tr>
            <th>ID Servicio</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Quitar</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr><td colSpan="5">Vacío</td></tr>
          ) : (
            items.map((it, idx) => (
              <tr key={idx}>
                <td>{it.idServicio}</td>
                <td>{it.nombreProducto}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={it.cantidad}
                    onChange={e => handleItemChange(idx, e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={it.precio}
                    readOnly
                    style={{ backgroundColor: '#f0f0f0', border: 'none' }}
                  />
                </td>
                <td><button onClick={() => quitarItem(idx)}>Quitar</button></td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {items.length > 0 && (
        <p className={styles.totalInfo}>Total: ${calcularTotal()}</p>
      )}

      <div className={styles.grupoBotonesAccion}>
        <button onClick={handleSubmit}>
          {facturaBuscada ? 'Actualizar Factura' : 'Crear Factura'}
        </button>
      </div>

      {message && <p className={styles.mensajeAlerta}>{message}</p>}
    </div>
  );
}

export default InsertarPedido;
