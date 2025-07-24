import React, { useEffect, useState } from "react";
import api from "../../../../../api"; // Asumiendo que tu módulo está aquí
import './TablaProductos.css';


export default function TablaProductos({ recargarTabla, onEditar }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarProductos = () => {
    setCargando(true);
    api.obtenerDatos("/Hotel/productos/productos-Optener")
      .then((data) => {
        setProductos(data || []);
        setCargando(false);
      })
      .catch((err) => {
        setError("Error al cargar productos");
        console.error(err);
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarProductos();
  }, [recargarTabla]);

  const eliminarProducto = (id) => {
    if (!window.confirm(`¿Estás seguro de eliminar el producto con ID ${id}?`)) return;

    api.obtenerDatos(`/Hotel/Productos/ELIMINARproductos/${id}`, null, "DELETE")
      .then((data) => {
        alert(data.message || "Producto eliminado");
        cargarProductos();
      })
      .catch((err) => {
        alert("Error al eliminar producto");
        console.error(err);
      });
  };

  if (cargando)
    return <p className="fizzbizz-cargando-productos">Cargando productos...</p>;
  if (error)
    return (
      <p className="fizzbizz-error-productos" style={{ color: "red" }}>
        {error}
      </p>
    );

  return (
    <div className="fizzbizz-contenedor-tabla-productos" style={{ marginTop: 30 }}>
      <h2 className="fizzbizz-titulo-tabla">Lista de Productos</h2>
      {productos.length === 0 ? (
        <p className="fizzbizz-no-productos">No hay productos registrados.</p>
      ) : (
        <table
          className="fizzbizz-tabla-productos"
          border="1"
          cellPadding="8"
          cellSpacing="0"
          style={{ width: "100%" }}
        >
          <thead className="fizzbizz-head-tabla">
            <tr className="fizzbizz-fila-header">
              <th className="fizzbizz-th-id">ID</th>
              <th className="fizzbizz-th-nombre">Nombre</th>
              <th className="fizzbizz-th-descripcion">Descripción</th>
              <th className="fizzbizz-th-precio">Precio Unitario</th>
              <th className="fizzbizz-th-stock">Stock</th>
              <th className="fizzbizz-th-proveedor">Proveedor</th>
              <th className="fizzbizz-th-tipo">Tipo</th>
              <th className="fizzbizz-th-unidad">Unidad</th>
              <th className="fizzbizz-th-acciones">Acciones</th>
            </tr>
          </thead>
          <tbody className="fizzbizz-body-tabla">
            {productos.map((p) => (
              <tr key={p.ID} className="fizzbizz-fila-producto">
                <td className="fizzbizz-td-id">{p.ID}</td>
                <td className="fizzbizz-td-nombre">{p.Nombre}</td>
                <td className="fizzbizz-td-descripcion">{p.Descripcion}</td>
                <td className="fizzbizz-td-precio">{p.Precio_Unitario}</td>
                <td className="fizzbizz-td-stock">{p.Stock}</td>
                <td className="fizzbizz-td-proveedor">{p.Proveedor || "—"}</td>
                <td className="fizzbizz-td-tipo">{p.Tipo || "—"}</td>
                <td className="fizzbizz-td-unidad">{p.Unidad || "—"}</td>
                <td className="fizzbizz-td-acciones">
                  <button
                    className="fizzbizz-btn-editar"
                    onClick={() =>
                      onEditar({
                        ID_Producto: p.ID,
                        nombre: p.Nombre,
                        descripcion: p.Descripcion,
                        Precio_Unitario: p.Precio_Unitario,
                        Stock: p.Stock,
                        Proveedor: p.Proveedor,
                        Tipo: p.Tipo,
                        Unidad: p.Unidad,
                      })
                    }
                  >
                    Editar
                  </button>

                  <button
                    className="fizzbizz-btn-eliminar"
                    style={{ marginLeft: 8, backgroundColor: "red", color: "white" }}
                    onClick={() => eliminarProducto(p.ID)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
