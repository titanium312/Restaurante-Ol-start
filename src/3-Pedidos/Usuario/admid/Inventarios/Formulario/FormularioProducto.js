import React, { useEffect, useState } from "react";
import styles from './FormularioProducto.module.css';
import api from '../../../../../api'; 

export function FormularioProducto({
  productoEditar,
  onSuccess,
  onCancelar,
  tiposProducto,
  unidades,
  provedores
}) {
  const isEditing = !!productoEditar;

  const [formData, setFormData] = useState({
    ID_Producto: "",
    nombre: "",
    descripcion: "",
    Precio_Unitario: "",
    Stock: "",
    ID_Provedor: "",
    ID_producto_tipo: "",
    ID_Unidad: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [listaProveedores, setListaProveedores] = useState(provedores || []);

  useEffect(() => {
    setListaProveedores(provedores || []);
  }, [provedores]);

  useEffect(() => {
    if (
      isEditing &&
      productoEditar &&
      tiposProducto.length > 0 &&
      unidades.length > 0 &&
      provedores.length > 0
    ) {
      const proveedorEncontrado = provedores.find(
        (p) => p.Nombre === productoEditar.Proveedor
      );
      const tipoEncontrado = tiposProducto.find(
        (t) => t.Descripcion === productoEditar.Tipo
      );
      const unidadEncontrada = unidades.find(
        (u) => u.Descripcion === productoEditar.Unidad
      );

      setFormData({
        ID_Producto: productoEditar.ID_Producto?.toString() || "",
        nombre: productoEditar.nombre || "",
        descripcion: productoEditar.descripcion || "",
        Precio_Unitario: productoEditar.Precio_Unitario?.toString() || "",
        Stock: productoEditar.Stock?.toString() || "",
        ID_Provedor: proveedorEncontrado?.ID_Provedor?.toString() || "",
        ID_producto_tipo: tipoEncontrado?.ID_producto_tipo?.toString() || "",
        ID_Unidad: unidadEncontrada?.ID_Unidad?.toString() || "",
      });
    }
  }, [productoEditar, isEditing, tiposProducto, unidades, provedores]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.nombre.trim()) return alert("El nombre es obligatorio");
    if (!formData.ID_producto_tipo) return alert("Selecciona tipo");
    if (!formData.ID_Unidad) return alert("Selecciona unidad");
    if (isNaN(formData.Precio_Unitario) || formData.Precio_Unitario === "")
      return alert("Precio inválido");
    if (isNaN(formData.Stock) || formData.Stock === "") return alert("Stock inválido");

    const payload = {
      ...(formData.ID_Producto && { ID_Producto: parseInt(formData.ID_Producto) }),
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
      Precio_Unitario: parseFloat(formData.Precio_Unitario),
      Stock: parseInt(formData.Stock),
      ID_Provedor: formData.ID_Provedor ? parseInt(formData.ID_Provedor) : null,
      ID_producto_tipo: parseInt(formData.ID_producto_tipo),
      ID_Unidad: parseInt(formData.ID_Unidad),
    };

    try {
      // Realizamos la petición con api.obtenerDatos
      const data = await api.obtenerDatos('/Hotel/Productos/CrearProductos', payload, 'POST');

      // Manejo de respuesta exitosa
      setMensaje(data.message || "Operación exitosa");

      if (!isEditing) {
        setFormData({
          ID_Producto: "",
          nombre: "",
          descripcion: "",
          Precio_Unitario: "",
          Stock: "",
          ID_Provedor: "",
          ID_producto_tipo: "",
          ID_Unidad: "",
        });
      }

      if (onSuccess) onSuccess();
    } catch (e) {
      setMensaje("Error de conexión: " + e.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.fp_formulario}>
      <h2 className={styles.fp_titulo}>{isEditing ? "Editar Producto" : "Crear Producto"}</h2>

      {!isEditing ? (
        <label className={styles.fp_label} htmlFor="ID_Producto">
          ID (opcional):
          <input
            className={styles.fp_input}
            type="number"
            id="ID_Producto"
            value={formData.ID_Producto}
            onChange={handleChange}
            placeholder="Dejar vacío para autogenerar"
            min="1"
          />
        </label>
      ) : (
        <label className={styles.fp_label} htmlFor="ID_Producto">
          ID:
          <input
            className={styles.fp_input}
            type="number"
            id="ID_Producto"
            value={formData.ID_Producto}
            disabled
          />
        </label>
      )}

      <label className={styles.fp_label} htmlFor="nombre">
        Nombre:
        <input
          className={styles.fp_input}
          type="text"
          id="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
      </label>

      <label className={styles.fp_label} htmlFor="descripcion">
        Descripción:
        <textarea
          className={styles.fp_textarea}
          id="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
        />
      </label>

      <label className={styles.fp_label} htmlFor="Precio_Unitario">
        Precio Unitario:
        <input
          className={styles.fp_input}
          type="number"
          id="Precio_Unitario"
          value={formData.Precio_Unitario}
          onChange={handleChange}
          step="0.01"
          required
        />
      </label>

      <label className={styles.fp_label} htmlFor="Stock">
        Stock:
        <input
          className={styles.fp_input}
          type="number"
          id="Stock"
          value={formData.Stock}
          onChange={handleChange}
          required
        />
      </label>

      <label className={styles.fp_label} htmlFor="ID_Provedor">
        Proveedor:
        <select
          className={styles.fp_select}
          id="ID_Provedor"
          value={formData.ID_Provedor}
          onChange={handleChange}
        >
          <option value="">-- Ninguno --</option>
          {listaProveedores.map((p) => (
            <option key={p.ID_Provedor} value={p.ID_Provedor.toString()}>
              {p.Nombre}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.fp_label} htmlFor="ID_producto_tipo">
        Tipo:
        <select
          className={styles.fp_select}
          id="ID_producto_tipo"
          value={formData.ID_producto_tipo}
          onChange={handleChange}
          required
        >
          <option value="">-- Seleccione --</option>
          {tiposProducto.map((t) => (
            <option key={t.ID_producto_tipo} value={t.ID_producto_tipo.toString()}>
              {t.Descripcion}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.fp_label} htmlFor="ID_Unidad">
        Unidad:
        <select
          className={styles.fp_select}
          id="ID_Unidad"
          value={formData.ID_Unidad}
          onChange={handleChange}
          required
        >
          <option value="">-- Seleccione --</option>
          {unidades.map((u) => (
            <option key={u.ID_Unidad} value={u.ID_Unidad.toString()}>
              {u.Descripcion}
            </option>
          ))}
        </select>
      </label>

      <button type="submit" className={styles.fp_botonSubmit}>
        {isEditing ? "Actualizar" : "Crear"} Producto
      </button>


      {mensaje && (
        <p
          className={`${styles.fp_mensaje} ${
            mensaje.toLowerCase().includes("error") ? styles.error : styles.exito
          }`}
        >
          {mensaje}
        </p>
      )}

      {isEditing && (
        <button
          type="button"
          onClick={onCancelar}
          className={styles.fp_botonCancelar}
        >
          Cancelar
        </button>
      )}
    </form>
  );
}
