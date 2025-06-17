import React, { useState, useEffect } from "react";
import FormularioUser from "./FormularioUser/FormularioUser";
import { TablaUser } from "./TablaUser/TablaUser";
import api from "../../../../api";

function ContenedorUser() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    nombre_usuario: "",
    contraseña: "",
    telefono: "",
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
      console.log("Usuarios recibidos:", data);

      if (!data || !Array.isArray(data.usuarios)) {
        setUsuarios([]);
        return;
      }

      const usuariosMapeados = data.usuarios.map((u) => ({
        id: u.id,
        nombre_usuario: u.nombre_usuario,
        rol: u.rol,
        telefono: u.telefono || "",
      }));

      setUsuarios(usuariosMapeados);
    } catch (err) {
      console.error("Error al cargar usuarios", err);
      setUsuarios([]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

const handleSubmit = async (e, cleanedFormData) => {
  e.preventDefault();

  // Usa cleanedFormData en vez de formData para enviar
  const { id, nombre_usuario, contraseña, correo_electronico, id_rol, telefono } = cleanedFormData;

  if (!nombre_usuario || !id_rol || (!contraseña && !id)) {
    alert("Faltan campos obligatorios");
    return;
  }

  try {
    const payload = {
      nombre_usuario,
      correo_electronico,
      telefono,
      id_rol: parseInt(id_rol),
    };

    if (contraseña) {
      payload.contraseña = contraseña;
    }

    if (id) {
      await api.obtenerDatos(`${apiBase}/usuarios/Edit/${id}`, payload, "PUT");
    } else {
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
      telefono: "",
      id_rol: "",
    });
  };

  const handleEditar = (usuario) => {
    const rolEncontrado = roles.find((r) => r.nombre_rol === usuario.rol);
    setFormData({
      id: usuario.id,
      nombre_usuario: usuario.nombre_usuario,
      contraseña: "",
      telefono: usuario.telefono || "",
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
