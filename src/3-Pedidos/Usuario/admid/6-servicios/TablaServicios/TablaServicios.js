import React, { useState } from "react";
import "./TablaServicios.css";

const TablaServicios = ({ servicios, editarServicio, eliminarServicio }) => {
  const [filtro, setFiltro] = useState("");

  const serviciosFiltrados = servicios.filter((s) =>
    `${s.Nombre} ${s.Descripcion} ${s.Tipo_Servicio} ${s.Precio}`
      .toLowerCase()
      .includes(filtro.toLowerCase())
  );

  return (
    <div className="table-wrapper">
      <input
        type="text"
        placeholder="Buscar por nombre, descripción, tipo o costo..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="input-busqueda"
      />

      <div className="scroll-container">
        <table className="tabla-servicios">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Costo</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {serviciosFiltrados.map((s) => (
              <tr key={s.ID_Servicio}>
                <td>{s.ID_Servicio}</td>
                <td>{s.Nombre}</td>
                <td>{s.Descripcion}</td>
                <td>${s.Precio}</td>
                <td>{s.Tipo_Servicio}</td>
                <td>
                  <button className="btn-editar" onClick={() => editarServicio(s)}>Editar</button>
                  <button className="btn-eliminar" onClick={() => eliminarServicio(s.ID_Servicio)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const mockServicios = Array.from({ length: 28 }, (_, i) => ({
  ID_Servicio: i + 1,
  Nombre: `Servicio ${i + 1}`,
  Descripcion: `Descripción del servicio número ${i + 1}`,
  Precio: (Math.random() * 100).toFixed(2),
  Tipo_Servicio: i % 2 === 0 ? "Básico" : "Premium",
})).slice(3); // Esto elimina los primeros 3 (empieza desde la fila 4)

export { TablaServicios, mockServicios };
