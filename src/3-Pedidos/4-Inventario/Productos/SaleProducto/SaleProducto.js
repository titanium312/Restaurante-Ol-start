import React, { useState } from 'react';
import api from '../../../../api';  
import { useEffect, useRef } from 'react';

const SaleProducto = () => {
  // Estado para manejar la lista de productos
  const [productos, setProductos] = useState([
    { id_producto: '', cantidad: '' },
  ]);
  const [fechaEmision, setFechaEmision] = useState('2025-01-03');

  // Función para agregar un nuevo producto
  const agregarProducto = () => {
    setProductos([...productos, { id_producto: '', cantidad: '' }]);
  };

  // Función para eliminar un producto de la lista
  const eliminarProducto = (index) => {
    const productosActualizados = productos.filter((_, i) => i !== index);
    setProductos(productosActualizados);
  };

  // Función para manejar el cambio de los inputs de los productos
  const handleChange = (index, field, value) => {
    const productosActualizados = [...productos];
    productosActualizados[index][field] = value;
    setProductos(productosActualizados);
  };

  // Función para realizar la venta
// Función para realizar la venta
const realizarVenta = (e) => {
  e.preventDefault();

  // Configuración fija
  const tipoFactura = 2;
  const descuento = 0;
  const adelanto = 0;

  // Crear el objeto para enviar
  const data = {
    productos: productos,
    tipoFactura: tipoFactura,
    descuento: descuento,
    adelanto: adelanto,
    fechaEmision: fechaEmision,
  };

  // Usar la función api.obtenerDatos en lugar de fetch
  api.obtenerDatos('/Hotel/producto/sale', data, 'POST')
    .then((data) => {
      if (data.message) {
        alert(
          `Venta procesada exitosamente.\nFactura ID: ${data.idFactura}\nTotal Venta: ${data.totalVenta}`
        );
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Error al procesar la solicitud. Por favor, intente más tarde.');
    });
};






  return (
    <div>
      <h1>Realizar Venta</h1>

      <form onSubmit={realizarVenta}>
        {/* Mostrar los productos dinámicamente */}
        {productos.map((producto, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <label htmlFor={`producto${index}`}>Producto {index + 1} ID:</label>
            <input
              type="number"
              id={`producto${index}`}
              value={producto.id_producto}
              onChange={(e) =>
                handleChange(index, 'id_producto', e.target.value)
              }
              required
            />
            <br />

            <label htmlFor={`cantidad${index}`}>Cantidad Producto {index + 1}:</label>
            <input
              type="number"
              id={`cantidad${index}`}
              value={producto.cantidad}
              onChange={(e) =>
                handleChange(index, 'cantidad', e.target.value)
              }
              required
            />
            <br />

            {/* Botón para eliminar el producto */}
            <button
              type="button"
              onClick={() => eliminarProducto(index)}
              style={{ marginTop: '10px' }}
            >
              Eliminar Producto
            </button>
            <br />
          </div>
        ))}

        {/* Botón para agregar un nuevo producto */}
        <button
          type="button"
          onClick={agregarProducto}
          style={{ marginTop: '10px' }}
        >
          Agregar Producto
        </button>
        <br />
        <br />

        <label htmlFor="fechaEmision">Fecha de Emisión:</label>
        <input
          type="date"
          id="fechaEmision"
          value={fechaEmision}
          onChange={(e) => setFechaEmision(e.target.value)}
          required
        />
        <br />
        <br />

        <button type="submit">Procesar Venta</button>
      </form>
    </div>
  );
};


export default SaleProducto;
