import React, { useState } from 'react';
import styles from './InsertarPedido.module.css';
import BuscadorServicio from './BuscadorServicio/BuscardorServicio';
import api from '../../api';
import ServicioAlerta from './Notificada/Notificasiones';

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
  const [mostrarActualizarFactura, setMostrarActualizarFactura] = useState(false);
  const [loading, setLoading] = useState(false);

  const role = localStorage.getItem('role');
  const userID = parseInt(localStorage.getItem('userId'), 10) || 0;

  const verificarEstadoCaja = async () => {
    const hoy = new Date().toISOString().split('T')[0];
    setLoading(true);
    try {
      const data = await api.obtenerDatos('/Hotel/restaurante/CajaEstado', { fecha: hoy }, 'POST');
      if (!Array.isArray(data) || data.length === 0) {
        setMessage('La caja no ha sido abierta hoy');
        return false;
      }

      const registrosHoy = data
        .filter(reg => new Date(reg.Fecha).toISOString().split('T')[0] === hoy)
        .sort((a, b) => new Date(b.Fecha) - new Date(a.Fecha));

      if (registrosHoy.length === 0 || registrosHoy[0].Descripcion.toLowerCase() === 'cerrada') {
        setMessage('La caja está cerrada. No puedes insertar pedidos.');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error al verificar estado de caja:', error);
      setMessage('Error al verificar el estado de la caja');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const buscarFactura = async () => {
    if (!facturaId || isNaN(facturaId)) {
      setMessage('Ingresa un ID de factura válido');
      return;
    }

    setLoading(true);
    try {
      const data = await api.obtenerDatos(`/Hotel/restaurante/servicio/Recepcion-ServiciosList?idFactura=${facturaId}`);

      if (!data.facturas || data.facturas.length === 0) {
        setMessage('No se encontró la factura');
        setItems([]);
        setMesa('');
        setFacturaBuscada(false);
        return;
      }

      const factura = data.facturas[0];
      const productos = [];

      for (const categoria in factura.Servicios) {
        factura.Servicios[categoria].forEach(servicio => {
          productos.push({
            idServicio: servicio.ID_Servicio,
            nombreProducto: servicio.Nombre_Servicio,
            cantidad: parseInt(servicio.Cantidad, 10),
            precio: parseFloat(servicio.Precio_Unitario),
            mesa: factura.mesa
          });
        });
      }

      setItems(productos);
      setMesa(factura.mesa || '');
      setFacturaBuscada(true);
      setMessage(`Factura #${facturaId} cargada correctamente`);
    } catch (err) {
      console.error(err);
      setMessage('No se pudo obtener la factura');
      setItems([]);
      setMesa('');
      setFacturaBuscada(false);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelect = service => {
    if (items.some(it => it.idServicio === service.ID_Servicio)) {
      setMessage('Ya agregaste este servicio');
      return;
    }
    setIdServicio(service.ID_Servicio);
    setNombreProducto(service.Nombre);
    setPrecio(service.Costo);
  };

  const agregarItem = () => {
    if (!idServicio || !nombreProducto || !cantidad || cantidad <= 0 || !precio) {
      setMessage('Completa todos los campos válidos');
      return;
    }
    const newItem = {
      idServicio,
      nombreProducto,
      cantidad: parseInt(cantidad, 10),
      precio: parseFloat(precio)
    };
    setItems([...items, newItem]);
    setIdServicio('');
    setNombreProducto('');
    setCantidad('');
    setPrecio('');
    setSearchTerm('');
    setMessage('Item agregado correctamente');
  };

  const quitarItem = idx => {
    const nuevosItems = items.filter((_, i) => i !== idx);
    setItems(nuevosItems);
    setMessage('Item eliminado');
  };

  const handleItemChange = (idx, value) => {
    const cantidad = parseInt(value, 10);
    if (isNaN(cantidad)) return;

    const updated = [...items];
    updated[idx].cantidad = cantidad;
    setItems(updated);
  };

  const calcularTotal = () => {
    return items.reduce((acc, it) => acc + (it.precio * it.cantidad), 0).toFixed(2);
  };

  const handleSubmit = async () => {
    if (!mesa) {
      setMessage('Ingresa el número de mesa');
      return;
    }
    if (items.length === 0) {
      setMessage('Ingresa al menos un pedido');
      return;
    }

    const cajaAbierta = await verificarEstadoCaja();
    if (!cajaAbierta) return;

    const servicios = items.map(it => ({
      ID_Servicio: it.idServicio,
      Cantidad: it.cantidad,
      mesa: mesa
    }));

    const now = new Date();
    const fechaActual = fechaEmision || now.toISOString().slice(0, 19).replace('T', ' ');

    const facturaData = {
      ...(facturaBuscada && { ID_Factura: parseInt(facturaId, 10) }),
      Fecha_Emision: fechaActual,
      TipoFactura: 1,
      ID_usuario: userID,
      ID_MetodoPago: 2,
      Descuento: 0,
      Adelanto: 0,
      Descripsion: facturaBuscada ? 'Actualización de pedido desde sistema' : 'Pedido desde sistema',
      servicios
    };

    try {
      setLoading(true);
      const response = await api.obtenerDatos('/Hotel/restaurante/recibir-pedido', facturaData, 'POST');
      if (response && response.ID_Factura) {
        setMessage(`Factura registrada correctamente con ID: ${response.ID_Factura}`);
        setFacturaId(response.ID_Factura);
      }
    } catch (err) {
      console.error(err);
      setMessage('Error al crear o actualizar la factura');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="InsertarPedidoRoot">
      <div className={styles.formularioContenedor}>
        <ServicioAlerta />
        <h1 className={styles.tituloFormulario}>Pedido / Actualizar Factura</h1>

        {message && <div className={styles.mensajeAlerta}>{message}</div>}

        {(role === 'Administrador' || role === 'Editor') && (
          <>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={mostrarActualizarFactura}
                onChange={() => setMostrarActualizarFactura(!mostrarActualizarFactura)}
              />
              ¿Actualizar Factura Existente?
            </label>

            {mostrarActualizarFactura && (
              <div className={styles.grillaCampos}>
                <input
                  type="text"
                  placeholder="ID Factura"
                  value={facturaId}
                  onChange={e => setFacturaId(e.target.value.replace(/\D/g, ''))}
                  disabled={loading}
                />
                <button
                  onClick={buscarFactura}
                  disabled={loading || !facturaId}
                >
                  {loading ? 'Buscando...' : 'Buscar'}
                </button>
                {!facturaBuscada && (
                  <input
                    type="datetime-local"
                    value={fechaEmision}
                    onChange={e => setFechaEmision(e.target.value)}
                    disabled={loading}
                  />
                )}
              </div>
            )}
          </>
        )}

        <div className={styles.grillaCampos}>
          <BuscadorServicio
            onSelect={handleServiceSelect}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Nombre Producto"
            value={nombreProducto}
            readOnly
            className={styles.campoReadonly}
          />
          <input
            type="text"
            placeholder="Mesa"
            value={mesa}
            onChange={e => setMesa(e.target.value.replace(/\D/g, ''))}
            disabled={loading || facturaBuscada}
          />
        </div>

        <div className={styles.grillaCampos}>
          <input
            type="number"
            placeholder="Cantidad"
            min="1"
            value={cantidad}
            onChange={e => setCantidad(e.target.value)}
            disabled={loading || !nombreProducto}
          />
          <input
            type="text"
            placeholder="Precio"
            value={precio}
            readOnly
            className={styles.campoReadonly}
          />
          <button
            onClick={agregarItem}
            disabled={loading || !nombreProducto || !cantidad || !precio}
          >
            Agregar
          </button>
        </div>

        <table className={styles.tablaProductos}>
          <thead>
            <tr>
              <th>ID Servicio</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unit.</th>
              <th>Subtotal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan="6">No hay items agregados</td></tr>
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
                      disabled={loading}
                    />
                  </td>
                  <td>${it.precio.toFixed(2)}</td>
                  <td>${(it.precio * it.cantidad).toFixed(2)}</td>
                  <td>
                    <button
                      onClick={() => quitarItem(idx)}
                      disabled={loading}
                    >
                      Quitar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {items.length > 0 && (
          <div className={styles.totalInfo}>
            <strong>Total:</strong> ${calcularTotal()}
          </div>
        )}

        <div className={styles.grupoBotonesAccion}>
          <button
            onClick={handleSubmit}
            disabled={loading || items.length === 0 || !mesa}
          >
            {loading ? 'Procesando...' : (facturaBuscada ? 'Actualizar Factura' : 'Crear Factura')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default InsertarPedido;
