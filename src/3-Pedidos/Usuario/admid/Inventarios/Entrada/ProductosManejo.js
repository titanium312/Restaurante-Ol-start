import React, { useState } from 'react';
import styles from './ProductosManejo.module.css';
import BuscadorProducto from '../../BuscadorProducto/BuscadorProducto';
import api from '../../../../../api';  
function ProductosManejo({ provedores = [], metodosPago = [] }) {
  const [modoOperacion, setModoOperacion] = useState('compra');
  const [searchTerm, setSearchTerm] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const [idProducto, setIdProducto] = useState('');
  const [nombreProducto, setNombreProducto] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precioCompra, setPrecioCompra] = useState('');
  const [proveedorId, setProveedorId] = useState('');
  const [metodoPago, setMetodoPago] = useState('1');
  const [descuento, setDescuento] = useState('0');
  const [adelanto, setAdelanto] = useState('0');

  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');

  const agregarItem = () => {
    const idProdNum = Number(idProducto);
    const cantNum = Number(cantidad);
    const precioNum = parseFloat(precioCompra);

    if (!idProdNum || idProdNum <= 0) {
      return alert('Selecciona un producto válido');
    }
    if (!cantNum || cantNum <= 0) {
      return alert('Ingresa una cantidad válida');
    }
    if (!precioNum || precioNum <= 0) {
      return alert('Ingresa un precio válido');
    }

    const existe = items.find(item => item.idProducto === idProdNum);
    if (existe) {
      return alert('Este producto ya fue agregado');
    }

    const nuevoItem = {
      idProducto: idProdNum,
      cantidad: cantNum,
      precioCompra: precioNum,
    };

    setItems([...items, nuevoItem]);

    // Limpiar campos después de agregar el producto
    setProductoSeleccionado(null);
    setIdProducto('');
    setNombreProducto('');
    setCantidad('');
    setPrecioCompra('');
    setSearchTerm('');
  };

  const quitarItem = idx => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const calcularTotal = () => {
    return items.reduce((acc, item) => acc + item.cantidad * item.precioCompra, 0).toFixed(2);
  };

const handleSubmit = async () => {
  if (modoOperacion === 'compra') {
    if (!proveedorId || proveedorId <= 0) {
      return alert('Ingresa un ID de proveedor válido');
    }
  }

  if (items.length === 0) {
    return alert('Agrega al menos un producto');
  }

  const payload = {
    productos: items.map(({ idProducto, cantidad, precioCompra }) => ({
      idProducto,
      cantidad,
      precioCompra,
    })),
    tipoFactura: modoOperacion === 'compra' ? 1 : 2,
    metodoPago: Number(metodoPago),
    descuento: parseFloat(descuento),
    adelanto: parseFloat(adelanto),
    ...(modoOperacion === 'compra' && { proveedorId: Number(proveedorId) }),
  };

  try {
    const res = await api.obtenerDatos('/Hotel/Productos/productos/entrada', payload, 'POST');

    // Si la respuesta contiene un mensaje de éxito
    setItems([]);
    setProveedorId('');
    setDescuento('0');
    setAdelanto('0');
    setMetodoPago('1');
    setMessage(modoOperacion === 'compra' ? 'Compra registrada con éxito' : 'Venta registrada con éxito');
    alert(modoOperacion === 'compra' ? 'Compra registrada con éxito' : 'Venta registrada con éxito');
  } catch (error) {
    alert('Error al registrar la operación');
    console.error(error);
  }
};


  return (
    <div className={styles.pm_formularioContenedor}>
      <h1 className={styles.pm_tituloFormulario}>
        Gestión de Productos - {modoOperacion === 'compra' ? 'Compra' : 'Venta'}
      </h1>

      <div className={styles.pm_grillaCampos}>
        <label>
          <input
            type="radio"
            name="modo"
            value="compra"
            checked={modoOperacion === 'compra'}
            onChange={() => setModoOperacion('compra')}
          />
          Compra
        </label>
        <label>
          <input
            type="radio"
            name="modo"
            value="venta"
            checked={modoOperacion === 'venta'}
            onChange={() => setModoOperacion('venta')}
          />
          Venta
        </label>
      </div>

      <div className={styles.pm_grillaCampos}>
        <BuscadorProducto
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSelect={(producto) => {
            setProductoSeleccionado(producto);
            setIdProducto(producto?.ID?.toString() ?? '');
            setNombreProducto(producto?.Nombre ?? '');
            setPrecioCompra(producto?.Precio_Unitario?.toString() ?? '');
            setSearchTerm(producto?.ID?.toString() ?? '');
          }}
        />

        {productoSeleccionado && (
          <p>Producto seleccionado: <strong>{productoSeleccionado.Nombre}</strong></p>
        )}

        <input
          type="text"
          placeholder="ID Producto"
          value={idProducto ?? ''}
          readOnly
          className={styles.pm_input}
        />

        <input
          type="number"
          placeholder="Cantidad"
          min="1"
          value={cantidad ?? ''}
          onChange={e => setCantidad(e.target.value)}
          className={styles.pm_input}
        />

        <input
          type="number"
          placeholder="Precio Compra"
          min="0"
          step="0.01"
          value={precioCompra ?? ''}
          onChange={e => setPrecioCompra(e.target.value)}
          className={styles.pm_input}
        />

        <button className={styles.pm_buttonP} onClick={agregarItem}>Agregar Producto</button>
      </div>

      {items.length > 0 && (
        <table className={styles.pm_tablaProductos}>
          <thead>
            <tr>
              <th>ID Producto</th>
              <th>Cantidad</th>
              <th>Precio Compra</th>
              <th>Quitar</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td>{item.idProducto}</td>
                <td>{item.cantidad}</td>
                <td>{item.precioCompra.toFixed(2)}</td>
                <td>
                  <button
                    className={styles.pm_botonQuitarItem}
                    onClick={() => quitarItem(idx)}
                  >
                    Quitar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className={styles.pm_grillaCampos}>
        {modoOperacion === 'compra' && (
          <select
            value={proveedorId ?? ''}
            onChange={(e) => setProveedorId(e.target.value)}
            className={styles.pm_select}
          >
            <option value="">-- Selecciona un proveedor --</option>
            {provedores.map((p) => (
              <option key={p.ID_Provedor} value={p.ID_Provedor.toString()}>
                {p.Nombre}
              </option>
            ))}
          </select>
        )}

        <label className={styles.pm_label}>
          Método de Pago:
          <select
            value={metodoPago ?? ''}
            onChange={e => setMetodoPago(e.target.value)}
            required
            className={styles.pm_select}
          >
            <option value="">-- Seleccione --</option>
            {metodosPago.map((m) => (
              <option key={m.ID_MetodoPago} value={m.ID_MetodoPago.toString()}>
                {m.Descripcion}
              </option>
            ))}
          </select>
        </label>

        <input
          type="number"
          placeholder="Descuento"
          min="0"
          step="0.01"
          value={descuento ?? ''}
          onChange={e => setDescuento(e.target.value)}
          className={styles.pm_input}
        />
        <input
          type="number"
          placeholder="Adelanto"
          min="0"
          step="0.01"
          value={adelanto ?? ''}
          onChange={e => setAdelanto(e.target.value)}
          className={styles.pm_input}
        />
      </div>

      {items.length > 0 && (
        <p className={styles.pm_totalInfo}>Total: ${calcularTotal()}</p>
      )}

      <button className={styles.pm_buttonP} onClick={handleSubmit}>
        {modoOperacion === 'compra' ? 'Registrar Compra' : 'Registrar Venta'}
      </button>

      {message && <p className={styles.pm_mensajeAlerta}>{message}</p>}
    </div>
  );
}

export default ProductosManejo;
