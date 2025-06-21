import React, { useState, useEffect } from 'react';
import MetodoPago from './MetodoPago/MetodoPago';
import api from '../../../api'; // Ajusta ruta según tu proyecto
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



  const estadosFactura = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'pagado', label: 'Pagada' },
    { value: 'cancelado', label: 'Cancelada' },
  ];

  // Manejo de clase en body para modal abierto (opcional, para estilos globales)
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

    if (option === 'pagado') {
      setModalOpen(true);
      setSelectedOption('');
      return;
    }

    switch (option) {
      case 'imprimir':
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
        {role === 'Administrador' && (
          <option value="eliminar">🗑️ Eliminar</option>
        )}
      </select>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <>
          <style>{`
            div.container {
              background-color: #f8f9fa;
              padding: 30px 40px;
              border-radius: 12px;
              box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
              max-width: 400px;
              margin: 40px auto;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            h3 {
              color: #333;
              font-weight: 600;
              margin-bottom: 25px;
              font-size: 1.5rem;
              text-align: center;
            }
            div.buttons {
              margin-top: 30px;
              display: flex;
              justify-content: center;
              gap: 15px;
            }
            button {
              padding: 12px 28px;
              font-size: 1rem;
              border-radius: 8px;
              border: none;
              cursor: pointer;
              transition: background-color 0.3s ease, transform 0.2s ease;
            }
            button.confirm {
              background-color: #4caf50;
              color: white;
            }
            button.confirm:hover:not(:disabled) {
              background-color: #45a049;
              transform: scale(1.05);
            }
            button.cancel {
              background-color: #e0e0e0;
              color: #555;
            }
            button.cancel:hover:not(:disabled) {
              background-color: #ccc;
              transform: scale(1.05);
            }
            button:disabled {
              background-color: #bbb;
              cursor: not-allowed;
              transform: none;
            }
          `}</style>

          <div className="container">
            <h3>Seleccione Método de Pago</h3>
            <MetodoPago onTipoSelect={setMetodoPagoSeleccionado} />
            <div className="buttons">
              <button
                className="confirm"
                onClick={confirmarPago}
                disabled={loading}
              >
                Confirmar Pago
              </button>
              <button
                className="cancel"
                onClick={() => setModalOpen(false)}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </>
      </Modal>
    </div>
  );
}

export default BotonOpciones;
