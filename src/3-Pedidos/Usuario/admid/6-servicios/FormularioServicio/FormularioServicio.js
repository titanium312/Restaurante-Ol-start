import React, { useState, useEffect } from 'react';
import './FormularioServicio.css';
import BuscadorProducto from '../../BuscadorProducto/BuscadorProducto';

const FormularioServicio = ({
  api,
  apiBase,
  formData,
  setFormData,
  servicios,
  setServicios,
  productosEdit,
  setProductosEdit,
  onServicioGuardado // <-- nueva prop
}) => {
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (Array.isArray(productosEdit) && productosEdit.length > 0) {
      setProductos(productosEdit.map(p => ({
        ID_Producto: p.ID_Producto,
        Cantidad: parseInt(p.Cantidad),
        Nombre: p.Nombre_Producto,
        Unidad: p.Unidad || '',
        Precio: parseFloat(p.Precio_Unitario ?? p.Precio ?? 0),
      })));
    } else {
      setProductos([]);
    }
  }, [productosEdit]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const agregarProducto = (producto) => {
    if (productos.some(p => p.ID_Producto === producto.ID)) {
      alert("Este producto ya fue agregado.");
      return;
    }
    setProductos(prev => [
      ...prev,
      {
        ID_Producto: producto.ID,
        Cantidad: 1,
        Nombre: producto.Nombre,
        Unidad: producto.Unidad,
        Precio: producto.Precio_Unitario ?? producto.Precio ?? 0,
      }
    ]);
  };

  const handleCantidadChange = (index, e) => {
    const nuevos = [...productos];
    nuevos[index].Cantidad = parseInt(e.target.value) || 1;
    setProductos(nuevos);
  };

  const eliminarProducto = (index) => {
    setProductos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.ID_Servicio ||
      !formData.nombre ||
      !formData.descripcion ||
      !formData.costo ||
      productos.length === 0
    ) {
      setError("Todos los campos son obligatorios y deben incluir al menos un producto.");
      return;
    }

    setLoading(true);
    setError('');

    const serviceData = {
      ID_Servicio: formData.ID_Servicio,
      Nombre: formData.nombre,
      Descripcion: formData.descripcion,
      Precio: parseFloat(formData.costo),
      productos: productos.map(p => ({
        ID_Producto: p.ID_Producto,
        Cantidad: p.Cantidad
      }))
    };

    try {
      const result = await api.obtenerDatos(`${apiBase}/RegistraServicio`, serviceData, 'POST');

      alert('Servicio registrado o actualizado correctamente.');
      setFormData({
        ID_Servicio: '',
        nombre: '',
        descripcion: '',
        costo: '',
        tipo: '1'
      });
      setProductos([]);
      if (typeof onServicioGuardado === 'function') {
        onServicioGuardado();
      }
    } catch (error) {
      console.error('Error al registrar servicio:', error);
      setError(error.message || 'Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="formulario-servicio" onSubmit={handleSubmit}>
      <label>
        ID del Servicio:
        <input type="number" id="ID_Servicio" value={formData.ID_Servicio} onChange={handleChange} required />
      </label>

      <label>
        Nombre del Servicio:
        <input type="text" id="nombre" value={formData.nombre} onChange={handleChange} required />
      </label>

      <label>
        Descripción:
        <input type="text" id="descripcion" value={formData.descripcion} onChange={handleChange} required />
      </label>

      <label>
        Costo:
        <input type="number" id="costo" value={formData.costo} onChange={handleChange} required />
      </label>

      <label>
        Tipo de Servicio:
        <select id="tipo" value={formData.tipo} onChange={handleChange} required>
          <option value="1">Restaurante</option>
          <option value="2">Bar</option>
        </select>
      </label>

      <fieldset>
        <legend>Agregar productos</legend>

        <BuscadorProducto
          onSelect={agregarProducto}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {productos.map((producto, index) => (
          <div key={index} className="producto-item">
            <div className="producto-info">
              <div>
                <span className="producto-nombre">{producto.Nombre}</span>
                <span className="producto-unidad">({producto.Unidad})</span>
                <span className="producto-id"> (ID: {producto.ID_Producto})</span>
              </div>
              <span className="producto-precio">${producto.Precio}</span>
            </div>
            <div className="producto-controls">
              <label>
                Cantidad:
                <input
                  type="number"
                  name="Cantidad"
                  value={producto.Cantidad}
                  onChange={e => handleCantidadChange(index, e)}
                  required
                  min="1"
                />
              </label>
              <span className="subtotal">
                Subtotal: ${(producto.Cantidad * producto.Precio).toFixed(2)}
              </span>
              <button
                type="button"
                className="btn-eliminar"
                onClick={() => eliminarProducto(index)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}

        {productos.length > 0 && (
          <div className="producto-item total">
            <div className="producto-info">
              <span className="producto-nombre">Total General:</span>
              <span className="producto-precio">
                ${productos.reduce((total, p) => total + (p.Cantidad * p.Precio), 0).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </fieldset>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar Servicio'}
      </button>
    </form>
  );
};

export default FormularioServicio;
