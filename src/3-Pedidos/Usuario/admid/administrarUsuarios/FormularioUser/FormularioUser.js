// FormularioUser.jsx
import React from "react";
import "./FormularioUser.css";

function FormularioUser({ formData, roles, handleChange, handleSubmit }) {
  // Envolvemos el handleSubmit para limpiar espacios antes de llamar al original
  const handleSubmitClean = (e) => {
    e.preventDefault();

    // Limpiar espacios al inicio y final en campos relevantes
    const cleanedFormData = {
      ...formData,
      nombre_usuario: formData.nombre_usuario.trim(),
      telefono: formData.telefono ? formData.telefono.trim() : "",
      // Puedes agregar más campos aquí si quieres limpiar espacios
    };

    // Validación: que nombre_usuario no quede vacío
    if (!cleanedFormData.nombre_usuario) {
      alert("El nombre de usuario no puede estar vacío o solo contener espacios.");
      return;
    }

    // Llamamos a la función handleSubmit original pasando cleanedFormData
    // Pero para que funcione con la estructura actual, puedes pasar cleanedFormData
    // como argumento. Si tu handleSubmit no acepta parámetros, la otra opción
    // es actualizar formData directamente antes de submit.

    // Aquí asumimos que handleSubmit acepta cleanedFormData
    handleSubmit(e, cleanedFormData);
  };

  return (
    <form className="formulario-usuario" onSubmit={handleSubmitClean}>

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
            required={!formData.id}  // obligatorio solo si es creación
          />
        </label>
      </div>

      <div className="formulario-usuario-fila">
        <label className="formulario-usuario-label">
          Teléfono:
          <input
            className="formulario-usuario-input"
            type="tel"
            id="telefono"
            value={formData.telefono || ""}
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
        {formData.id ? "Actualizar Usuario" : "Guardar Usuario"}
      </button>
    </form>
  );
}

export default FormularioUser;
