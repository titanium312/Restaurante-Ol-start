import React, { useState, useEffect } from 'react';
import './TablaProductos.css';

const TablaProductos = ({ productos }) => {
  // Estado para almacenar los filtros aplicados
  const [filters, setFilters] = useState({
    codigo: '',
    producto: '',
    descripcion: '',
    fecha: '',
    stockInicial: '',
    entradas: '',
    salidas: '',
    total: '',
  });

  // Estado para manejar la visibilidad de los selects
  const [showFilters, setShowFilters] = useState({
    codigo: false,
    producto: false,
    descripcion: false,
    fecha: false,
    stockInicial: false,
    entradas: false,
    salidas: false,
    total: false,
  });

  // Función para manejar el cambio de filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Filtrar productos según los filtros seleccionados
  const filterProductos = () => {
    return productos.filter((producto) => {
      return (
        (filters.codigo === '' || producto.codigo === filters.codigo) &&
        (filters.producto === '' || producto.producto.includes(filters.producto)) &&
        (filters.descripcion === '' || producto.descripcion.includes(filters.descripcion)) &&
        (filters.fecha === '' || producto.fecha === filters.fecha) &&
        (filters.stockInicial === '' || producto.stockInicial === parseInt(filters.stockInicial)) &&
        (filters.entradas === '' || producto.entradas === parseInt(filters.entradas)) &&
        (filters.salidas === '' || producto.salidas === parseInt(filters.salidas)) &&
        (filters.total === '' || producto.total === parseInt(filters.total))
      );
    });
  };

  // Función para alternar la visibilidad de los selects (al hacer doble clic en las cabeceras)
  const toggleFilterVisibility = (column) => {
    setShowFilters((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  // Obtener los productos filtrados
  const productosFiltrados = filterProductos();

  // Obtener los valores únicos para los filtros basados en los productos filtrados
  const getUniqueValues = (key) => {
    const uniqueValues = [...new Set(productosFiltrados.map((producto) => producto[key]))];
    return uniqueValues.map((value) => ({
      value: value.toString(),
      label: value.toString(),
    }));
  };

  return (
    <div className="tabla-productos-container">
      <h2>Productos Registrados</h2>

      {/* Tabla de Productos Filtrados */}
      <table className="tabla-productos">
        <thead>
          <tr>
            <th onDoubleClick={() => toggleFilterVisibility('codigo')}>
              Código
              {showFilters.codigo && (
                <select name="codigo" value={filters.codigo} onChange={handleFilterChange}>
                  <option value="">Seleccionar</option>
                  {getUniqueValues('codigo').map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </th>
            <th onDoubleClick={() => toggleFilterVisibility('producto')}>
              Producto
              {showFilters.producto && (
                <select name="producto" value={filters.producto} onChange={handleFilterChange}>
                  <option value="">Seleccionar</option>
                  {getUniqueValues('producto').map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </th>
            <th onDoubleClick={() => toggleFilterVisibility('descripcion')}>
              Descripción
              {showFilters.descripcion && (
                <select name="descripcion" value={filters.descripcion} onChange={handleFilterChange}>
                  <option value="">Seleccionar</option>
                  {getUniqueValues('descripcion').map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </th>
            <th onDoubleClick={() => toggleFilterVisibility('fecha')}>
              Fecha
              {showFilters.fecha && (
                <select name="fecha" value={filters.fecha} onChange={handleFilterChange}>
                  <option value="">Seleccionar</option>
                  {getUniqueValues('fecha').map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </th>
            <th onDoubleClick={() => toggleFilterVisibility('stockInicial')}>
              Stock Inicial
              {showFilters.stockInicial && (
                <select name="stockInicial" value={filters.stockInicial} onChange={handleFilterChange}>
                  <option value="">Seleccionar</option>
                  {getUniqueValues('stockInicial').map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </th>
            <th onDoubleClick={() => toggleFilterVisibility('entradas')}>
              Entradas
              {showFilters.entradas && (
                <select name="entradas" value={filters.entradas} onChange={handleFilterChange}>
                  <option value="">Seleccionar</option>
                  {getUniqueValues('entradas').map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </th>
            <th onDoubleClick={() => toggleFilterVisibility('salidas')}>
              Salidas
              {showFilters.salidas && (
                <select name="salidas" value={filters.salidas} onChange={handleFilterChange}>
                  <option value="">Seleccionar</option>
                  {getUniqueValues('salidas').map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </th>
            <th onDoubleClick={() => toggleFilterVisibility('total')}>
              Total
              {showFilters.total && (
                <select name="total" value={filters.total} onChange={handleFilterChange}>
                  <option value="">Seleccionar</option>
                  {getUniqueValues('total').map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map((producto, index) => (
            <tr key={index}>
              <td>{producto.codigo}</td>
              <td>{producto.producto}</td>
              <td>{producto.descripcion}</td>
              <td>{producto.fecha}</td>
              <td>{producto.stockInicial}</td>
              <td>{producto.entradas}</td>
              <td>{producto.salidas}</td>
              <td>{producto.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaProductos;
