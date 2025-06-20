import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../api';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const handleLogout = () => {
    ['isLoggedIn', 'username', 'role'].forEach((key) => localStorage.removeItem(key));
    navigate('/');
  };

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

  const styles = {
    container: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      
    },
    
    contentWrapper: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      backdropFilter: 'blur(10px)',
    },

    header: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#1e293b',
      textAlign: 'center',
      marginBottom: '2rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      textShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },

    section: {
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
    },

    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },

    statusBadge: {
      display: 'inline-block',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.875rem',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },

    statusOpen: {
      backgroundColor: '#dcfce7',
      color: '#166534',
      border: '1px solid #bbf7d0',
    },

    statusClosed: {
      backgroundColor: '#fee2e2',
      color: '#991b1b',
      border: '1px solid #fecaca',
    },

    cajaInfoText: {
      fontSize: '1rem',
      color: '#4b5563',
      marginBottom: '0.75rem',
      lineHeight: '1.6',
      padding: '0.75rem',
      backgroundColor: '#f9fafb',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
    },

    comentarioLabel: {
      display: 'block',
      fontSize: '1rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '0.5rem',
    },

    comentarioInput: {
      width: '100%',
      padding: '0.875rem 1rem',
      fontSize: '1rem',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      marginBottom: '1rem',
      transition: 'all 0.3s ease',
      backgroundColor: '#ffffff',
      boxSizing: 'border-box',
    },

    comentarioInputFocus: {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
      outline: 'none',
    },

    comentarioInputDisabled: {
      backgroundColor: '#f3f4f6',
      color: '#9ca3af',
      cursor: 'not-allowed',
    },

    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      marginTop: '1.5rem',
      flexWrap: 'wrap',
    },

    button: {
      flex: '1',
      minWidth: '150px',
      padding: '0.875rem 1.5rem',
      fontSize: '1rem',
      fontWeight: '600',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      position: 'relative',
      overflow: 'hidden',
    },

    buttonOpen: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)',
    },

    buttonOpenHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px 0 rgba(16, 185, 129, 0.5)',
    },

    buttonClose: {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: 'white',
      boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.39)',
    },

    buttonCloseHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px 0 rgba(239, 68, 68, 0.5)',
    },

    buttonDisabled: {
      background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
      color: '#f3f4f6',
      cursor: 'not-allowed',
      transform: 'none',
      boxShadow: 'none',
    },

    messageSuccess: {
      padding: '1rem',
      backgroundColor: '#dcfce7',
      color: '#166534',
      border: '1px solid #bbf7d0',
      borderRadius: '8px',
      marginBottom: '1rem',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },

    messageError: {
      padding: '1rem',
      backgroundColor: '#fee2e2',
      color: '#991b1b',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      marginBottom: '1rem',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },

    totalsList: {
      listStyle: 'none',
      padding: '0',
      margin: '0',
    },

    totalsItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.875rem 1rem',
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      marginBottom: '0.5rem',
      fontWeight: '500',
      transition: 'all 0.2s ease',
    },

    totalsItemHover: {
      backgroundColor: '#e2e8f0',
      transform: 'translateX(4px)',
    },

    loadingSpinner: {
      display: 'inline-block',
      width: '20px',
      height: '20px',
      border: '3px solid #f3f3f3',
      borderTop: '3px solid #3498db',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },

    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        <h2 style={styles.header}>💰 Gestión de Caja del Restaurante</h2>

        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>
            📊 Estado Actual de Caja ({today})
            {cajaData && (
              <span style={cajaAbierta ? {...styles.statusBadge, ...styles.statusOpen} : {...styles.statusBadge, ...styles.statusClosed}}>
                {cajaData.Descripcion}
              </span>
            )}
          </h3>
          
          {cajaLoading && (
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <div style={styles.loadingSpinner}></div>
              <p>Cargando estado...</p>
            </div>
          )}
          
          {cajaError && <p style={styles.messageError}>⚠️ Error: {cajaError}</p>}
          
          {cajaData ? (
            <>
              <div style={styles.cajaInfoText}>
                <strong>📋 Descripción:</strong> {cajaData.Descripcion}
              </div>
              <div style={{ ...styles.cajaInfoText, whiteSpace: 'pre-wrap' }}>
                <strong>💬 Comentarios:</strong><br />
                {cajaData.Comentario}
              </div>
            </>
          ) : (
            !cajaLoading && !cajaError && <p style={styles.cajaInfoText}>ℹ️ No hay datos de caja para hoy.</p>
          )}
        </section>

        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>⚡ Acciones de Caja</h3>

          <label htmlFor="comentario" style={styles.comentarioLabel}>
            💭 Comentario para la acción:
          </label>
          <input
            id="comentario"
            type="text"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Ej: Inicio de turno, Cierre de día, Ajuste"
            style={{
              ...styles.comentarioInput,
              ...(cajaCerrada && styles.comentarioInputDisabled)
            }}
            disabled={cajaCerrada}
            onFocus={(e) => {
              if (!cajaCerrada) {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.boxShadow = 'none';
            }}
          />

          {actionError && <p style={styles.messageError}>❌ {actionError}</p>}
          {actionMessage && <p style={styles.messageSuccess}>✅ {actionMessage}</p>}

          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => handleCajaAction('abrir')}
              style={{
                ...styles.button,
                ...(cajaAbierta || cajaCerrada ? styles.buttonDisabled : styles.buttonOpen),
              }}
              disabled={cajaAbierta || cajaCerrada}
              onMouseEnter={(e) => {
                if (!cajaAbierta && !cajaCerrada) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px 0 rgba(16, 185, 129, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!cajaAbierta && !cajaCerrada) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 14px 0 rgba(16, 185, 129, 0.39)';
                }
              }}
            >
              🔓 Abrir Caja
            </button>
            <button
              type="button"
              onClick={() => handleCajaAction('cerrar')}
              style={{
                ...styles.button,
                ...(!cajaAbierta ? styles.buttonDisabled : styles.buttonClose),
              }}
              disabled={!cajaAbierta}
              onMouseEnter={(e) => {
                if (cajaAbierta) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px 0 rgba(239, 68, 68, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (cajaAbierta) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 14px 0 rgba(239, 68, 68, 0.39)';
                }
              }}
            >
              🔒 Cerrar Caja
            </button>
          </div>
        </section>

        {Object.keys(totalesMetodosPago).length > 0 && (
          <section style={styles.section}>
            <h4 style={styles.sectionTitle}>💳 Totales por Método de Pago</h4>
            <ul style={styles.totalsList}>
              {Object.entries(totalesMetodosPago).map(([metodo, total]) => (
                <li 
                  key={metodo} 
                  style={styles.totalsItem}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#e2e8f0';
                    e.target.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f8fafc';
                    e.target.style.transform = 'translateX(0)';
                  }}
                >
                  <span>💰 {metodo}</span>
                  <span style={{fontWeight: '700', color: '#059669'}}>${total.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default CajaManagement;