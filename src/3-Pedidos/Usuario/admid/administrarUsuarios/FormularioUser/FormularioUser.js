import React from "react";
import "./FormularioUser.css";

function FormularioUser({ formData, roles, handleChange, handleSubmit }) {
  return (
    <form className="formulario-usuario" onSubmit={handleSubmit}>

      {formData.id && (
        <div className="formulario-usuario-fila">
          <label className="formulario-usuario-label">
            ID:
            <input
              className="formulario-usuario-input"
              type="text"
              id="id"
              value={formData.id}
              readOnly
            />
          </label>
        </div>
      )}

      <div className="formulario-usuario-fila">
        <label className="formulario-usuario-label">
          Nombre de Usuario:
          <input
            className="formulario-usuario-input"
            type="text"
            id="nombre_usuario"
            value={formData.nombre_usuario}
            onChange={handleChange}
            required
          />
        </label>

        <label className="formulario-usuario-label">
          Contraseña:
          <input
            className="formulario-usuario-input"
            type="password"
            id="contraseña"
            value={formData.contraseña}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <div className="formulario-usuario-fila">
        <label className="formulario-usuario-label">
          Correo Electrónico:
          <input
            className="formulario-usuario-input"
            type="email"
            id="correo_electronico"
            value={formData.correo_electronico}
            onChange={handleChange}
          />
        </label>

        <label className="formulario-usuario-label">
          Rol:
          <select
            className="formulario-usuario-select"
            id="id_rol"
            value={formData.id_rol}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un rol</option>
            {roles.map((rol) => (
              <option key={rol.id} value={rol.id}>
                {rol.nombre_rol}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button className="formulario-usuario-boton" type="submit">
        Guardar Usuario
      </button>
    </form>
  );
}

export default FormularioUser;
