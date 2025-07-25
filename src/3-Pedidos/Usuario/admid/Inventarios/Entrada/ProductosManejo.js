import React, { useState } from 'react';
import styles from './ProductosManejo.module.css';
import BuscadorProducto from '../../BuscadorProducto/BuscadorProducto';

function ProductosManejo({ provedores = [], metodosPago = [] }) {
  const [modoOperacion, setModoOperacion] = useState('compra');
  const [searchTerm, setSearchTerm] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const [idProducto, setIdProducto] = useState('');
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

    // Aquí crea el payload pero no lo usas, para evitar el warning:
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
      // TODO: implementar llamada API usando 'payload'

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

  // ... resto del componente igual
}

export default ProductosManejo;
