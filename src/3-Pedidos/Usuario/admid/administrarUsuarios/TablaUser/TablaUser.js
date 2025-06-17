import React, { useState } from "react";
import "./TablaUser.css";

function TablaUser({ usuarios, handleEditar, handleEliminar }) {
  const [filtro, setFiltro] = useState("");

  const usuariosFiltrados = usuarios.filter((u) =>
    `${u.nombre_usuario} ${u.telefono || ""} ${u.rol || ""}`
      .toLowerCase()
      .includes(filtro.toLowerCase())
  );

  return (
    <div className="table-wrapper">
      <input
        type="text"
        placeholder="Buscar por nombre, teléfono o rol..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="input-busqueda"
      />

      <div className="scroll-container">
        {usuariosFiltrados.length === 0 ? (
          <p>No se encontraron usuarios.</p>
        ) : (
          <table className="tabla-usuarios">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.nombre_usuario}</td>
                  <td>{u.telefono || ""}</td>
                  <td>{u.rol || "Sin rol"}</td>
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
        )}
      </div>
    </div>
  );
}

export { TablaUser };
