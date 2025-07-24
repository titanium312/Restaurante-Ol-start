import React, { useState, useEffect } from 'react';
import MetodoPago from './MetodoPago/MetodoPago';
import api from '../../../api';
import styles from './BotonOpciones.module.css';
import { useFactura } from './Factura/Factura';
import Modal from '../../../modal';

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
  const [modalOpen, setModalOpen] = useState(false);
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState('');
  const [cajaCerrada, setCajaCerrada] = useState(false);

  const { loading, setLoading, imprimirFactura } = useFactura({
    facturaId,
    servicios,
    mesero,
    totalFactura,
    fechaEmision,
    mesa,
    estadoServicio,
  });

  const role = localStorage.getItem('role');

  const esAdmin = role === 'Administrador';
  const esEditor = role === 'Editor';
 

  const puedeEliminar = esAdmin;
  const puedeVerAcciones = esAdmin || (esEditor && !cajaCerrada);
  const accionesPermitidas = esAdmin || (esEditor && !cajaCerrada);

  useEffect(() => {
    const verificarCaja = async () => {
      const today = new Date().toISOString().split('T')[0];
      try {
        const data = await api.obtenerDatos(
          `/hotel/restaurante/CajaEstado?fecha=${today}`,
          {},
          'POST'
        );

        if (Array.isArray(data) && data.length > 0) {
          const ultimoEstado = data.sort((a, b) => new Date(b.Fecha) - new Date(a.Fecha))[0];
          if (ultimoEstado.Descripcion.toLowerCase() === 'cerrada') {
            setCajaCerrada(true);
          }
        }
      } catch (err) {
        console.error('Error al verificar estado de caja:', err);
      }
    };

    verificarCaja();
  }, []);

  const estadosFactura = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'pagado', label: 'Pagada' },
    { value: 'cancelado', label: 'Cancelada' },
  ];

  useEffect(() => {
    if (modalOpen) {
      document.body.classList.add('modal-abierto');
    } else {
      document.body.classList.remove('modal-abierto');
    }
    return () => {
      document.body.classList.remove('modal-abierto');
    };
  }, [modalOpen]);

  const cambiarEstado = async (estadoSeleccionado) => {
    if (!accionesPermitidas) {
      alert('No tienes permiso para cambiar el estado de la factura.');
      return;
    }

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

  const confirmarPago = async () => {
    if (!accionesPermitidas) {
      alert('No tienes permiso para confirmar el pago.');
      return;
    }

    if (!metodoPagoSeleccionado) {
      alert('Por favor selecciona un método de pago');
      return;
    }

    setLoading(true);
    try {
      await api.obtenerDatos('/hotel/restaurante/cambiar-Metodo-pago', {
        idFactura: facturaId,
        idMetodoPago: metodoPagoSeleccionado
      }, 'put');

      await cambiarEstado('pagado');

      alert('Pago confirmado y estado actualizado.');
      setModalOpen(false);
      setMetodoPagoSeleccionado('');
      if (obtenerServiciosPendientes) obtenerServiciosPendientes();
    } catch (error) {
      console.error(error);
      alert('Error al confirmar el pago: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

const eliminarFactura = async () => {
  if (!puedeEliminar) {
    alert('No tienes permiso para eliminar facturas.');
    return;
  }

  setLoading(true);
  try {
    if (!facturaId) throw new Error('ID de factura no definido');

    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar esta factura?');
    if (!confirmed) return;

    // Petición PUT con el ID en la URL, sin cuerpo necesario
    await api.obtenerDatos(`/hotel/restaurante/Eliminar-Factura/${facturaId}`, {}, 'put');

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

    if (option === 'pagado') {
      setModalOpen(true);
      setSelectedOption('');
      return;
    }

    switch (option) {
      case 'imprimir':
        if (!accionesPermitidas) return alert('No tienes permiso para imprimir.');
        imprimirFactura();
        break;
      case 'eliminar':
        await eliminarFactura();
        break;
      case 'pendiente':
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
      {puedeVerAcciones && (
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
          {puedeEliminar && <option value="eliminar">🗑️ Eliminar</option>}
        </select>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="container">
          <h3>Seleccione Método de Pago</h3>
          <MetodoPago onTipoSelect={setMetodoPagoSeleccionado} />
          <div className="buttons">
            <button className="confirm" onClick={confirmarPago} disabled={loading}>
              Confirmar Pago
            </button>
            <button className="cancel" onClick={() => setModalOpen(false)} disabled={loading}>
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default BotonOpciones;
