import React, { useState, useEffect, useCallback } from 'react';
import './TablaServicios.css';

const TablaServicios = ({
  api,
  apiBase,
  servicios,
  setServicios,
  setFormData,
  setProductosEdit,
  onRefrescarServicios // <-- nueva prop opcional
}) => {
  const [filtro, setFiltro] = useState('');
  const [expandido, setExpandido] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [eliminando, setEliminando] = useState(null);

  const cargarServicios = useCallback(async () => {
    try {
      setCargando(true);
      const data = await api.obtenerDatos(`${apiBase}/ListaServicios`);
      
      if (Array.isArray(data)) {
        const serviciosFormateados = data.map((s) => ({
          ID_Servicio: s.ID_Servicio,
          nombre: s.Nombre ?? 'Sin nombre',
          descripcion: s.Descripcion ?? 'Sin descripción',
          costo: s.Costo ?? '0.00',
          tipo: s.Tipo_Servicio === 'Bar' ? '2' : '1',
          productos: Array.isArray(s.Productos) ? s.Productos : [],
          maxUnidades: s.MaxUnidades
        }));

        setServicios(serviciosFormateados);
      } else {
        console.error('La API no devolvió un array de servicios:', data);
      }
    } catch (error) {
      console.error('Error al cargar los servicios:', error);
      alert('Hubo un error al cargar los servicios.');
    } finally {
      setCargando(false);
    }
  }, [api, apiBase, setServicios]);

  // Permitir refrescar desde el padre
  useEffect(() => {
    if (typeof onRefrescarServicios === 'function') {
      onRefrescarServicios(cargarServicios);
    }
  }, [onRefrescarServicios, cargarServicios]);

  useEffect(() => {
    cargarServicios();
  }, [cargarServicios]);

  const serviciosFiltrados = servicios.filter((s) => {
    const filtroLower = filtro.toLowerCase();
    // Verificar si filtro coincide con ID (como string)
    if (String(s.ID_Servicio).includes(filtro)) {
      return true;
    }
    // Sino, buscar en nombre, descripción, tipo y costo
    return `${s.nombre} ${s.descripcion} ${s.tipo} ${s.costo}`
      .toLowerCase()
      .includes(filtroLower);
  });

  const editarServicio = (servicio) => {
    setFormData({
      ID_Servicio: servicio.ID_Servicio,
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      costo: servicio.costo,
      tipo: servicio.tipo
    });

    setProductosEdit(servicio.productos);
    
    // Scroll suave al formulario
    const formulario = document.querySelector('.formulario-servicio');
    if (formulario) {
      formulario.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const eliminarServicio = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este servicio?')) {
      try {
        setEliminando(id);
        await api.obtenerDatos(`${apiBase}/EliminarServicio/${id}`, null, 'DELETE');
        
        // Animación de eliminación
        setTimeout(() => {
          cargarServicios();
          setEliminando(null);
        }, 300);
      } catch (error) {
        console.error('Error al eliminar servicio:', error);
        alert('Error al eliminar el servicio. Quizás esté facturado.');
        setEliminando(null);
      }
    }
  };

  const toggleExpand = (id) => {
    setExpandido((prev) => (prev === id ? null : id));
  };

  const getTipoServicio = (tipo) => {
    return tipo === '1' ? 'Restaurante' : 'Bar';
  };

  const getTipoColor = (tipo) => {
    return tipo === '1' ? '#4a90e2' : '#e67e22';
  };

  const formatearCosto = (costo) => {
    return `$${Number(costo).toFixed(2)}`;
  };

  if (cargando) {
    return (
      <div className="table-wrapper">
        <div className="cargando">
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #e9ecef', 
            borderTop: '4px solid #4a90e2',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          Cargando servicios...
        </div>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="🔍 Buscar por ID, nombre, descripción, tipo o costo..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="input-busqueda"
          aria-label="Buscar servicios"
        />
        
        {filtro && (
          <div style={{ 
            fontSize: '0.9rem', 
            color: '#7f8c8d', 
            marginTop: '0.5rem' 
          }}>
            {serviciosFiltrados.length} servicio{serviciosFiltrados.length !== 1 ? 's' : ''} encontrado{serviciosFiltrados.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div className="scroll-container">
        <table className="tabla-servicios" role="table" aria-label="Tabla de servicios">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Costo</th>
              <th>Tipo</th>
              <th>Cantidad Máxima</th>
              <th>Productos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {serviciosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '3rem' }}>
                  {filtro ? (
                    <>
                      <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>🔍</div>
                      No se encontraron servicios que coincidan con "<strong>{filtro}</strong>".
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>📋</div>
                      No hay servicios registrados.
                    </>
                  )}
                </td>
              </tr>
            ) : (
              serviciosFiltrados.map((s) => (
                <React.Fragment key={s.ID_Servicio}>
                  <tr className={eliminando === s.ID_Servicio ? 'eliminando' : ''}>
                    <td>{s.ID_Servicio}</td>
                    <td>
                      <strong>{s.nombre}</strong>
                    </td>
                    <td title={s.descripcion}>{s.descripcion}</td>
                    <td>{formatearCosto(s.costo)}</td>
                    <td>
                      <span style={{ 
                        color: getTipoColor(s.tipo),
                        fontWeight: '500',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: `${getTipoColor(s.tipo)}20`,
                        fontSize: '0.8rem'
                      }}>
                        {getTipoServicio(s.tipo)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {s.maxUnidades !== null && s.maxUnidades !== undefined ? (
                        <span style={{ 
                          fontWeight: '600',
                          color: '#27ae60',
                          backgroundColor: '#27ae6020',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '0.8rem'
                        }}>
                          {s.maxUnidades}
                        </span>
                      ) : (
                        <span style={{ color: '#7f8c8d' }}>N/A</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ 
                        fontWeight: '500',
                        color: s.productos.length > 0 ? '#4a90e2' : '#7f8c8d',
                        backgroundColor: s.productos.length > 0 ? '#4a90e220' : '#7f8c8d20',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8rem'
                      }}>
                        {s.productos.length}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-editar" 
                        onClick={() => editarServicio(s)}
                        title="Editar servicio"
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        className="btn-eliminar" 
                        onClick={() => eliminarServicio(s.ID_Servicio)}
                        title="Eliminar servicio"
                        disabled={eliminando === s.ID_Servicio}
                      >
                        🗑️ {eliminando === s.ID_Servicio ? 'Eliminando...' : 'Eliminar'}
                      </button>
                      {s.productos.length > 0 && (
                        <button 
                          className="btn-detalles" 
                          onClick={() => toggleExpand(s.ID_Servicio)}
                          title={expandido === s.ID_Servicio ? 'Ocultar productos' : 'Ver productos'}
                        >
                          {expandido === s.ID_Servicio ? '🔼 Ocultar' : '🔽 Ver Productos'}
                        </button>
                      )}
                    </td>
                  </tr>

                  {expandido === s.ID_Servicio && s.productos.length > 0 && (
                    <tr className="productos-row">
                      <td colSpan="8">
                        <strong>🍽️ Productos Asociados ({s.productos.length}):</strong>
                        <ul>
                          {s.productos.map((p, index) => (
                            <li key={p.ID_Producto || index}>
                              <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '0.5rem'
                              }}>
                                <span style={{ fontWeight: '600' }}>
                                  {p.Nombre_Producto}
                                </span>
                                <div style={{ 
                                  display: 'flex', 
                                  gap: '1rem',
                                  fontSize: '0.85rem',
                                  color: '#7f8c8d'
                                }}>
                                  <span>📦 Cantidad: <strong>{p.Cantidad}</strong></span>
                                  <span>📊 Stock: <strong style={{ 
                                    color: p.Stock > 0 ? '#27ae60' : '#e74c3c' 
                                  }}>{p.Stock}</strong></span>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { TablaServicios };
