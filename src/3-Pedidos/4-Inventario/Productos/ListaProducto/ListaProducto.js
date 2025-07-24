import React, { useEffect, useState } from 'react';
import api from '../../../../api'; // Importa la API

const ListaProducto = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);

  // Función para obtener los productos desde la API
  const obtenerProductos = async () => {
    try {
      const data = await api.obtenerDatos('/Hotel/productos-Optener');
      setProductos(data);
    } catch (error) {
      setError('Hubo un error al cargar los productos.');
      console.error('Error al obtener los productos:', error);
    }
  };

  // Cargar productos cuando el componente se monta
  useEffect(() => {
    obtenerProductos();
  }, []);


  return (
    <div className="container">
      <h1>Lista de Productos</h1>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', backgroundColor: '#4CAF50', color: 'white' }}>ID Producto</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', backgroundColor: '#4CAF50', color: 'white' }}>Nombre</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', backgroundColor: '#4CAF50', color: 'white' }}>Descripción</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', backgroundColor: '#4CAF50', color: 'white' }}>Stock</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', backgroundColor: '#4CAF50', color: 'white' }}>Categoría</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', backgroundColor: '#4CAF50', color: 'white' }}>Precio Compra</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', backgroundColor: '#4CAF50', color: 'white' }}>Precio Venta</th>
          </tr>
        </thead>
        <tbody>
          {productos.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No se encontraron productos</td>
            </tr>
          ) : (
            productos.map((producto) => (
              <tr key={producto.ID_Producto} style={{ cursor: 'pointer' }}>
                <td style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{producto.ID_Producto}</td>
                <td style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{producto.Nombre}</td>
                <td style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{producto.Descripcion_Producto}</td>
                <td style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{producto.Stock}</td>
                <td style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                  {producto.Categoria || 'No asignada'}
                </td>
                <td style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                  {producto.Precio_Compra ? `$${producto.Precio_Compra}` : 'No disponible'}
                </td>
                <td style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                  {producto.Precio_Venta ? `$${producto.Precio_Venta}` : 'No disponible'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListaProducto;
