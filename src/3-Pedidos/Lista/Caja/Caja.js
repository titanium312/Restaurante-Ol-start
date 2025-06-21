import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../api';
import styles from './CajaManagement.module.css';

function CajaManagement() {
  const [comentario, setComentario] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');
  const [cajaData, setCajaData] = useState(null);
  const [cajaLoading, setCajaLoading] = useState(false);
  const [cajaError, setCajaError] = useState(null);
  const [totalesMetodosPago, setTotalesMetodosPago] = useState({});

  const today = new Date().toISOString().slice(0, 10);
  const username = localStorage.getItem('username');

  const fetchCajaEstado = useCallback(async () => {
    setCajaLoading(true);
    setCajaError(null);
    try {
      const result = await api.obtenerDatos(`/hotel/restaurante/CajaEstado?fecha=${today}`, null, 'POST');
      setCajaData(Array.isArray(result) && result.length > 0 ? result[0] : null);
    } catch (err) {
      setCajaError(err.message || 'Error al obtener estado de caja');
      setCajaData(null);
    } finally {
      setCajaLoading(false);
    }
  }, [today]);

  const fetchTotalesPorMetodoPago = useCallback(async () => {
    try {
      const data = await api.obtenerDatos(`/Hotel/restaurante/servicio/Recepcion-ServiciosList?fechaInicio=${today}&fechaFin=${today}`);
      if (data.Bar && Array.isArray(data.Bar)) {
        return data.Bar.reduce((acc, servicio) => {
          const metodo = servicio.Metodo_Pago || 'Sin Método';
          const total = parseFloat(servicio.Total) || 0;
          acc[metodo] = (acc[metodo] || 0) + total;
          return acc;
        }, {});
      }
      return {};
    } catch (error) {
      console.error('Error al obtener totales por método de pago:', error);
      return {};
    }
  }, [today]);

  const loadTotalesIfCajaCerrada = useCallback(async () => {
    if (cajaData?.Descripcion === 'Cerrada') {
      const totales = await fetchTotalesPorMetodoPago();
      setTotalesMetodosPago(totales);
    } else {
      setTotalesMetodosPago({});
    }
  }, [cajaData, fetchTotalesPorMetodoPago]);

  useEffect(() => {
    fetchCajaEstado();
  }, [fetchCajaEstado]);

  useEffect(() => {
    loadTotalesIfCajaCerrada();
  }, [cajaData, loadTotalesIfCajaCerrada]);

  const handleCajaAction = async (actionType) => {
    setActionMessage('');
    setActionError('');
    setTotalesMetodosPago({});

    if (!comentario.trim()) {
      setActionError('Por favor, ingresa un comentario.');
      return;
    }

    if (!username) {
      setActionError('No se encontró usuario logueado. Por favor inicia sesión.');
      return;
    }

    let totales = {};
    if (actionType === 'cerrar') {
      totales = await fetchTotalesPorMetodoPago();
      setTotalesMetodosPago(totales);
    }

    const payload = {
      descripcion: actionType === 'abrir' ? 'Abierta' : 'Cerrada',
      comentario: `${username}: ${comentario}`,
      usuario: username,
    };

    try {
      await api.obtenerDatos('/hotel/restaurante/Caja', payload, 'POST');
      setActionMessage(`Caja ${actionType === 'abrir' ? 'abierta' : 'cerrada'} exitosamente.`);
      setComentario('');
      fetchCajaEstado();
    } catch (err) {
      setActionError(err.message || 'Error al realizar la acción en caja.');
    }
  };

  const cajaAbierta = cajaData?.Descripcion === 'Abierta';
  const cajaCerrada = cajaData?.Descripcion === 'Cerrada';

  return (
    <div className={styles['caja-container-x7f9r2']}>
      <div className={styles['caja-content-x7f9r2']}>
        <h2 className={styles['caja-header-x7f9r2']}>💰 Gestión de Caja del Restaurante</h2>

        <section className={styles['caja-section-x7f9r2']}>
          <h3 className={styles['caja-section-title-x7f9r2']}>
            📊 Estado Actual de Caja ({today})
            {cajaData && (
              <span className={`${styles['caja-status-badge-x7f9r2']} ${cajaAbierta ? styles['caja-status-open-x7f9r2'] : styles['caja-status-closed-x7f9r2']}`}>
                {cajaData.Descripcion}
              </span>
            )}
          </h3>

          {cajaLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className={styles['caja-loading-spinner-x7f9r2']}></div>
              <p>Cargando estado...</p>
            </div>
          )}

          {cajaError && <p className={styles['caja-msg-error-x7f9r2']}>⚠️ Error: {cajaError}</p>}

          {cajaData ? (
            <>
              <div className={styles['caja-info-x7f9r2']}>
                <strong>📋 Descripción:</strong> {cajaData.Descripcion}
              </div>
              <div className={styles['caja-info-x7f9r2']}>
                <strong>💬 Comentarios:</strong><br />
                {cajaData.Comentario}
              </div>
            </>
          ) : (
            !cajaLoading && !cajaError && <p className={styles['caja-info-x7f9r2']}>ℹ️ No hay datos de caja para hoy.</p>
          )}
        </section>

        <section className={styles['caja-section-x7f9r2']}>
          <h3 className={styles['caja-section-title-x7f9r2']}>⚡ Acciones de Caja</h3>

          <label htmlFor="comentario" className={styles['caja-com-label-x7f9r2']}>
            💭 Comentario para la acción:
          </label>
          <input
            id="comentario"
            type="text"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            className={`${styles['caja-com-input-x7f9r2']} ${cajaCerrada ? styles['caja-com-input-disabled-x7f9r2'] : ''}`}
            placeholder="Ej: Inicio de turno, Cierre de día, Ajuste"
            disabled={cajaCerrada}
          />

          {actionError && <p className={styles['caja-msg-error-x7f9r2']}>❌ {actionError}</p>}
          {actionMessage && <p className={styles['caja-msg-success-x7f9r2']}>✅ {actionMessage}</p>}

          <div className={styles['caja-button-group-x7f9r2']}>
            <button
              type="button"
              onClick={() => handleCajaAction('abrir')}
              className={`${styles['caja-button-x7f9r2']} ${cajaAbierta || cajaCerrada ? styles['caja-button-disabled-x7f9r2'] : styles['caja-button-open-x7f9r2']}`}
              disabled={cajaAbierta || cajaCerrada}
            >
              🔓 Abrir Caja
            </button>

            <button
              type="button"
              onClick={() => handleCajaAction('cerrar')}
              className={`${styles['caja-button-x7f9r2']} ${!cajaAbierta ? styles['caja-button-disabled-x7f9r2'] : styles['caja-button-close-x7f9r2']}`}
              disabled={!cajaAbierta}
            >
              🔒 Cerrar Caja
            </button>
          </div>
        </section>

        {Object.keys(totalesMetodosPago).length > 0 && (
          <section className={styles['caja-section-x7f9r2']}>
            <h4 className={styles['caja-section-title-x7f9r2']}>💳 Totales por Método de Pago</h4>
            <ul>
              {Object.entries(totalesMetodosPago).map(([metodo, total]) => (
                <li key={metodo} className={styles['caja-info-x7f9r2']}>
                  <span>💰 {metodo}</span>
                  <span style={{ fontWeight: '700', color: '#059669', float: 'right' }}>${total.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

export default CajaManagement;
