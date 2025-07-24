import React, { useState, useEffect } from "react";
import TablaProductos from "./Tabla/TablaProductos";
import { FormularioProducto } from "./Formulario/FormularioProducto";
import ProductosManejo from "./Entrada/ProductosManejo";
import api from "../../../../api"; // Asegúrate de que esta ruta es correcta
import FormularioProveedor from "./Provedor/Formulario/FormularioProvedor";
import './ContenedorProductos.css'; // Archivo CSS externo

export default function ContenedorProductos() {
  const [productoEditar, setProductoEditar] = useState(null);
  const [recargarTabla, setRecargarTabla] = useState(false);
  const [tiposProducto, setTiposProducto] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [provedores, setProvedores] = useState([]);
  const [metodosPago, setMetodosPago] = useState([]);
  const [vistaActiva, setVistaActiva] = useState("formulario");
  const [cargando, setCargando] = useState(true); // Para el estado de carga
  const [error, setError] = useState(null); // Para manejar errores en las peticiones
  const [refreshTabla, setRefreshTabla] = useState(false);

  const cargarYSetear = async (endpoint, setState) => {
    try {
      setCargando(true);
      const res = await api.obtenerDatos(endpoint);
      setState(res.data || res);
    } catch (err) {
      setError("Hubo un error al cargar los datos.");
      setState([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarYSetear("/Hotel/Productos/producto-tipos", setTiposProducto);
    cargarYSetear("/Hotel/Productos/unidades", setUnidades);
    cargarYSetear("/Hotel/Productos/provedores", setProvedores);
    cargarYSetear("/Hotel/Recepcion/metodos-pago", setMetodosPago);
  }, []);

  const manejarEditar = (producto) => {
    setProductoEditar(producto);
    setVistaActiva("formulario");
  };

  const manejarExito = () => {
    setRecargarTabla((prev) => !prev);
    setProductoEditar(null);
  };

  const manejarCancelar = () => {
    setProductoEditar(null);
  };

  if (cargando) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="contenedor-productos-unique">
      <h1>Gestión de Productos</h1>

      {/* Botones de selección de vista */}
      <div className="botones-vista-unique">
        <button
          onClick={() => setVistaActiva("formulario")}
          className={vistaActiva === "formulario" ? "activo-unique" : ""}
        >
          Ingresar o Actualizar
        </button>
        <button
          onClick={() => setVistaActiva("manejo")}
          className={vistaActiva === "manejo" ? "activo-unique" : ""}
        >
          Entrada o Salida
        </button>
        <button
          onClick={() => setVistaActiva("registro")}
          className={vistaActiva === "registro" ? "activo-unique" : ""}
        >
          Registrar Provedor
        </button>
      </div>

      {/* Renderizado condicional de formularios y vistas */}
      <div>
        {vistaActiva === "formulario" && (
          <FormularioProducto
            productoEditar={productoEditar}
            onSuccess={manejarExito}
            onCancelar={manejarCancelar}
            tiposProducto={tiposProducto}
            unidades={unidades}
            provedores={provedores}
          />
        )}

        {vistaActiva === "manejo" && (
          <ProductosManejo provedores={provedores} metodosPago={metodosPago} />
        )}

        {vistaActiva === "registro" && <FormularioProveedor />}
      </div>

      {/* Tabla de productos */}
      {vistaActiva !== "registro" && (
        <TablaProductos recargarTabla={recargarTabla} onEditar={manejarEditar} />
      )}

      <hr />
    </div>
  );
}
