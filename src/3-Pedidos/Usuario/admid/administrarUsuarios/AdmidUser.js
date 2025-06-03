import React, { useState, useEffect } from "react";
import FormularioUser from "./FormularioUser/FormularioUser";
import { TablaUser } from "./TablaUser/TablaUser";
import api from "../../../../api"; // Ajusta la ruta si es necesario

function ContenedorUser() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    nombre_usuario: "",
    contraseña: "",
    correo_electronico: "",
    id_rol: "",
  });

  const apiBase = "/user";

  useEffect(() => {
    cargarRoles();
    cargarUsuarios();
  }, []);

  const cargarRoles = async () => {
    try {
      const data = await api.obtenerDatos(`${apiBase}/roles`);
      setRoles(data);
    } catch (err) {
      console.error("Error al cargar roles", err);
    }
  };

  const cargarUsuarios = async () => {
    try {
      const data = await api.obtenerDatos(`${apiBase}/usuarioslista`);
      setUsuarios(data.usuarios);
    } catch (err) {
      console.error("Error al cargar usuarios", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, nombre_usuario, contraseña, correo_electronico, id_rol } = formData;

    if (!nombre_usuario || !id_rol || (!contraseña && !id)) {
      alert("Faltan campos obligatorios");
      return;
    }

    try {
      if (id) {
        const payload = {
          nombre_usuario,
          nueva_contraseña: contraseña || undefined,
          id_rol: parseInt(id_rol),
        };
        await api.obtenerDatos(`${apiBase}/usuarios/Edit/${id}`, payload, "PUT");
      } else {
        const payload = {
          nombre_usuario,
          contraseña,
          correo_electronico,
          id_rol: parseInt(id_rol),
        };
        await api.obtenerDatos(`${apiBase}/usuarios`, payload, "POST");
      }
      resetForm();
      await cargarUsuarios();
    } catch (err) {
      console.error("Error al guardar usuario", err);
      alert("Error al guardar usuario");
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      nombre_usuario: "",
      contraseña: "",
      correo_electronico: "",
      id_rol: "",
    });
  };

  const handleEditar = (usuario) => {
    const rolEncontrado = roles.find((r) => r.nombre_rol === usuario.rol);
    setFormData({
      id: usuario.id,
      nombre_usuario: usuario.nombre_usuario,
      contraseña: "",
      correo_electronico: usuario.correo_electronico || "",
      id_rol: rolEncontrado ? rolEncontrado.id.toString() : "",
    });
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      try {
        await api.obtenerDatos(`${apiBase}/usuarios/Eliminar/${id}`, null, "DELETE");
        await cargarUsuarios();
        if (formData.id === id.toString()) resetForm();
      } catch (err) {
        console.error("Error al eliminar usuario", err);
        alert("Error al eliminar usuario");
      }
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <h1>Gestión de Usuarios</h1>

      <FormularioUser
        formData={formData}
        roles={roles}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        style={{ width: "100%" }}
      />

      <TablaUser
        usuarios={usuarios}
        handleEditar={handleEditar}
        handleEliminar={handleEliminar}
        style={{ width: "100%" }}
      />
    </div>
  );
}

export default ContenedorUser;
