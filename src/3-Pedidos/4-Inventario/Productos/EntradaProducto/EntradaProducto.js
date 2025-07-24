import React, { useState } from "react";
import styles from './EntradaProducto.module.css';
import TipoPago from "./TipoPago/TipoPago";
import SelectProveedor from "./SelectProvedor/SelectProvedor";
import api from '../../../../api'; // Importa la API

const EntradaProducto = () => {
  const [formData, setFormData] = useState({
    productos: [
      {
        idProducto: "",
        cantidad: "",
        precioCompra: "",
      },
    ],
    proveedorId: "",
    tipoFactura: 1,
    metodoPago: "",
    descuento: 0.00,
    adelanto: 0.00,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleProductoChange = (e, index) => {
    const { name, value } = e.target;
    const updatedProductos = [...formData.productos];
    updatedProductos[index] = { ...updatedProductos[index], [name]: value };
    setFormData({ ...formData, productos: updatedProductos });
  };

  const handleAddProducto = () => {
    setFormData({
      ...formData,
      productos: [
        ...formData.productos,
        {
          idProducto: "",
          cantidad: "",
          precioCompra: "",
        },
      ],
    });
  };

  const handleRemoveProducto = (index) => {
    if (formData.productos.length > 1) {
      const updatedProductos = formData.productos.filter((_, i) => i !== index);
      setFormData({ ...formData, productos: updatedProductos });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProveedorChange = (idProveedor) => {
    setFormData({
      ...formData,
      proveedorId: idProveedor,
    });
  };

  const handleTipoFacturaChange = (tipo) => {
    setFormData({
      ...formData,
      tipoFactura: tipo,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validar que los productos tengan datos
    if (!formData.productos || formData.productos.length === 0) {
      alert("Debe incluir al menos un producto.");
      setIsSubmitting(false);
      return;
    }

    const data = {
      productos: formData.productos.map((producto) => ({
        idProducto: producto.idProducto,
        cantidad: parseInt(producto.cantidad, 10) || 0,
        precioCompra: parseFloat(producto.precioCompra) || 0,
      })),
      proveedorId: formData.proveedorId,
      tipoFactura: formData.tipoFactura,
      metodoPago: formData.metodoPago || 0,
      descuento: parseFloat(formData.descuento) || 0,
      adelanto: parseFloat(formData.adelanto) || 0,
    };

    try {
      // Realiza la solicitud al servidor y pasa `data`
      const result = await api.obtenerDatos('/Hotel/Productos/producto/sale', data, 'POST');

      // Verificar si la respuesta fue exitosa
      if (result && result.message) {
        setSuccess(true);

        // Resetear el formulario después de un envío exitoso
        setFormData({
          productos: [{ idProducto: "", cantidad: "", precioCompra: "" }],
          proveedorId: "",
          tipoFactura: 1,
          metodoPago: "",
          descuento: 0.00,
          adelanto: 0.00,
        });

        setTimeout(() => setSuccess(false), 3000);

        // Mostrar el mensaje de éxito
        alert(result.message || "Venta procesada exitosamente.");
      } else {
        alert(result.error || 'Error desconocido');
      }
    } catch (error) {
      alert('Error al procesar la solicitud: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calcular el total
  const calcularTotal = () => {
    return formData.productos.reduce((total, producto) => {
      const precio = parseFloat(producto.precioCompra) || 0;
      const cantidad = parseInt(producto.cantidad) || 0;
      return total + (precio * cantidad);
    }, 0);
  };

  const total = calcularTotal();
  const descuento = parseFloat(formData.descuento) || 0;
  const totalConDescuento = total - descuento;

  return (
    <div className={styles.purpleWaffle}>
      <div className={styles.pinkSky}>
        <h2 className={styles.almondGlow}>Entrada de Productos</h2>
        <div className={styles.dreamLine}></div>
      </div>

      <form onSubmit={handleSubmit} className={styles.milkshakeForm}>
        {/* Productos */}
        <div className={`${styles.frostedCard} ${styles.focusable}`}>
          <h3 className={styles.chocolateMuffin}>Detalles de Productos</h3>
          <span className={styles.sectionTag}>INVENTARIO</span>

          {formData.productos.map((producto, index) => (
            <div key={index} className={styles.productItem}>
              {formData.productos.length > 1 && (
                <div className={styles.itemNumber}>{index + 1}</div>
              )}
              
              <div className={styles.twoColumns}>
                <div>
                  <label className={styles.candyLabel}>
                    ID Producto
                    <span 
                      className={styles.helpIcon} 
                      data-tooltip="Ingrese el código del producto"
                    >?</span>
                  </label>
                  <input
                    type="text"
                    name="idProducto"
                    value={producto.idProducto}
                    onChange={(e) => handleProductoChange(e, index)}
                    className={`${styles.cookieInput} ${producto.idProducto ? styles.valid : ''}`}
                    placeholder="Ingrese el código"
                    required
                  />
                </div>

                <div>
                  <label className={styles.candyLabel}>Cantidad</label>
                  <input
                    type="number"
                    name="cantidad"
                    value={producto.cantidad}
                    onChange={(e) => handleProductoChange(e, index)}
                    className={`${styles.cookieInput} ${producto.cantidad ? styles.valid : ''}`}
                    placeholder="0"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className={styles.moneyField}>
                <label className={styles.candyLabel}>Precio de Compra</label>
                <input
                  type="number"
                  name="precioCompra"
                  value={producto.precioCompra}
                  onChange={(e) => handleProductoChange(e, index)}
                  className={`${styles.cookieInput} ${producto.precioCompra ? styles.valid : ''}`}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className={styles.productActions}>
                {index > 0 && (
                  <button 
                    type="button" 
                    onClick={() => handleRemoveProducto(index)}
                    className={`${styles.actionButton} ${styles.remove}`}
                  >
                    Eliminar producto
                  </button>
                )}
                {index === formData.productos.length - 1 && (
                  <button 
                    type="button" 
                    onClick={handleAddProducto}
                    className={`${styles.actionButton} ${styles.add}`}
                  >
                    Agregar producto
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Información de Pago */}
        <div className={`${styles.frostedCard} ${styles.focusable}`}>
          <h3 className={styles.chocolateMuffin}>Información de Pago</h3>
          <span className={styles.sectionTag}>FINANZAS</span>

          <label className={styles.candyLabel}>Proveedor</label>
          <SelectProveedor
            value={formData.proveedorId}
            onChange={handleProveedorChange}
            className={styles.cookieInput}
            required
          />

          <div className={styles.twoColumns}>
            <div>
              <label className={styles.candyLabel}>Tipo de Factura</label>
              <div className={styles.typeSelector}>
                <button
                  type="button"
                  className={`${styles.typeOption} ${formData.tipoFactura === 1 ? styles.active : ''}`}
                  onClick={() => handleTipoFacturaChange(1)}
                >
                  Contado
                </button>
                <button
                  type="button"
                  className={`${styles.typeOption} ${formData.tipoFactura === 2 ? styles.active : ''}`}
                  onClick={() => handleTipoFacturaChange(2)}
                >
                  Crédito
                </button>
              </div>
            </div>

            <div>
              <label className={styles.candyLabel}>Método de Pago</label>
              <TipoPago
                value={formData.metodoPago}
                onChange={(e) => handleChange(e)} 
                className={styles.cookieInput}
                required
              />
            </div>
          </div>

          <div className={styles.twoColumns}>
            <div className={styles.moneyField}>
              <label className={styles.candyLabel}>Descuento</label>
              <input
                type="number"
                step="0.01"
                name="descuento"
                value={formData.descuento}
                onChange={handleChange}
                className={styles.cookieInput}
                placeholder="0.00"
                min="0"
              />
            </div>

            <div className={styles.moneyField}>
              <label className={styles.candyLabel}>Adelanto</label>
              <input
                type="number"
                step="0.01"
                name="adelanto"
                value={formData.adelanto}
                onChange={handleChange}
                className={styles.cookieInput}
                placeholder="0.00"
                min="0"
              />
            </div>
          </div>

          {total > 0 && (
            <div className={styles.summary}>
              <div className={styles.summaryLine}>
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className={styles.summaryLine}>
                <span>Descuento:</span>
                <span>${descuento.toFixed(2)}</span>
              </div>
              <div className={styles.summaryTotal}>
                <span>Total:</span>
                <span>${totalConDescuento.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Botón Submit */}
        <button 
          type="submit" 
          className={`${styles.jellyButton} ${isSubmitting ? styles.sending : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Procesando...' : success ? 'Éxito!' : 'Registrar Entrada'}
          {isSubmitting && <span className={styles.loader}></span>}
        </button>
      </form>
    </div>
  );
};

export default EntradaProducto;