import React, { useState } from "react";
import "./TablaUser.css";

function TablaUser({ usuarios, handleEditar, handleEliminar }) {
  const [filtro, setFiltro] = useState("");

  const usuariosFiltrados = usuarios.filter((u) =>
    `${u.nombre_usuario} ${u.correo_electronico || ""} ${u.rol}`
      .toLowerCase()
      .includes(filtro.toLowerCase())
  );

  return (
    <div className="table-wrapper">
      <input
        type="text"
        placeholder="Buscar por nombre, correo o rol..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="input-busqueda"
      />

      <div className="scroll-container">
        <table className="tabla-usuarios">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nombre_usuario}</td>
                <td>{u.correo_electronico || ""}</td>
                <td>{u.rol}</td>
                <td>
                  <button className="btn-editar" onClick={() => handleEditar(u)}>
                    Editar
                  </button>
                  <button className="btn-eliminar" onClick={() => handleEliminar(u.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const mockServicios = Array.from({ length: 28 }, (_, i) => ({
  ID_Servicio: i + 1,
  Nombre: `Servicio ${i + 1}`,
  Descripcion: `Descripción del servicio número ${i + 1}`,
  Precio: (Math.random() * 100).toFixed(2),
  Tipo_Servicio: i % 2 === 0 ? "Básico" : "Premium",
})).slice(3); // Empieza desde el 4º servicio

// Exportar nombrado, no default
export { TablaUser, mockServicios };
