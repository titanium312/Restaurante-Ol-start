import React, { useState } from 'react';
import { useFactura } from './Factura/Factura';
import styles from './BotonOpciones.module.css';
import api from '../../../api';

function BotonOpciones({
  facturaId,
  servicios,
  mesero,
  totalFactura,
  fechaEmision,
  mesa,
  estadoServicio,
  obtenerServiciosPendientes
}) {
  const [selectedOption, setSelectedOption] = useState('');
  const { loading, setLoading, imprimirFactura } = useFactura({
    facturaId,
    servicios,
    mesero,
    totalFactura,
    fechaEmision,
    mesa,
    estadoServicio,
  });

  const estadosFactura = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'pagado', label: 'Pagada' },
    { value: 'cancelado', label: 'Cancelada' },
  ];

  const cambiarEstado = async (estadoSeleccionado) => {
    setLoading(true);

    const estado = estadoSeleccionado === 'pendiente' ? 1 :
                   estadoSeleccionado === 'pagado' ? 2 : 3;

    try {
      if (!facturaId) throw new Error('ID de factura no definido');

      await api.obtenerDatos('/hotel/restaurante/cambiar-estado', {
        idFactura: facturaId,
        estado
      }, 'put');

      if (obtenerServiciosPendientes) obtenerServiciosPendientes();
      alert('Estado actualizado correctamente.');
    } catch (error) {
      console.error(error);
      alert('Error al actualizar estado: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const eliminarFactura = async () => {
    setLoading(true);
    try {
      if (!facturaId) throw new Error('ID de factura no definido');

      const confirmed = window.confirm('¿Estás seguro de que deseas eliminar esta factura?');
      if (!confirmed) return;

      await api.obtenerDatos('/hotel/restaurante/Eliminar-Factura', {
        idFactura: facturaId
      }, 'put');

      if (obtenerServiciosPendientes) obtenerServiciosPendientes();
      alert('Factura eliminada correctamente.');
    } catch (error) {
      console.error(error);
      alert('Error al eliminar factura: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (option) => {
    if (!option) return;

    switch (option) {
      case 'imprimir':
        imprimirFactura();
        break;
      case 'eliminar':
        await eliminarFactura();
        break;
      case 'pendiente':
      case 'pagado':
      case 'cancelado':
        await cambiarEstado(option);
        break;
      default:
        break;
    }

    setSelectedOption('');
  };

  return (
    <div className={styles.contenedor}>
      <select
        value={selectedOption}
        disabled={loading}
        onChange={async (e) => {
          const selected = e.target.value;
          setSelectedOption(selected);
          await handleAction(selected);
        }}
        className={`${styles.select} ${selectedOption ? styles.selected : ''}`}
      >
        <option value="">Acción</option>
        {estadosFactura.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
        <option value="imprimir">🖨️ Imprimir</option>
        <option value="eliminar">🗑️ Eliminar</option>
      </select>
    </div>
  );
}

export default BotonOpciones;
