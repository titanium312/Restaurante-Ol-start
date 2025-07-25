import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styles from './ListaRestaurante.module.css';
import Filtros from './Filtros/Filtros';
import api, { useApiWatch } from '../../api';
import { TablaServicios } from './TablaServicios/TablaServicios';
import CajaEstado from './Caja/Caja';
import Actualiza from '../InsertaPedido/Notificada/Actuliza';

// Constantes
const INTERVAL_REFRESH = 1000; // 1 segundo
const ENDPOINT_SERVICIOS = '/Hotel/restaurante/servicio/Recepcion-ServiciosList';
const ENDPOINT_PEDIDOS = '/Hotel/restaurante/recibir-pedido';

// Función auxiliar para obtener la fecha actual
const obtenerFechaHoy = () => new Date().toISOString().split('T')[0];

// Función auxiliar para transformar servicios
const transformarServicios = (facturas) => {
  return facturas.flatMap(factura => {
    const serviciosPorFactura = [];

    // Iterar cada tipo de servicio (ej. Restaurante, Bar, etc)
    Object.entries(factura.Servicios).forEach(([tipo, servicios]) => {
      servicios.forEach(servicio => {
        serviciosPorFactura.push({
          ...servicio,
          Tipo_Servicio: tipo,
          ID_Factura: factura.ID_Factura,
          Fecha_Emision: factura.Fecha_Emision,
          mesa: factura.mesa,
          Nombre_Usuario_Factura: factura.Nombre_Usuario_Factura,
          Metodo_Pago: factura.Metodo_Pago,
          Estado_Servicio: factura.Estado_Servicio,
          Precio_Unitario: servicio.Precio_Unitario,
          Total: servicio.Cantidad * servicio.Precio_Unitario,
        });
      });
    });

    return serviciosPorFactura;
  });
};

// Función auxiliar para filtrar servicios
const aplicarFiltros = (servicios, filtros) => {
  return servicios.filter(servicio => {
    const fechaEmision = new Date(servicio.Fecha_Emision).toISOString().split('T')[0];
    
    // Filtro de búsqueda general
    const cumpleBuscador = filtros.buscador === '' || 
      Object.values(servicio).some(val =>
        val && val.toString().toLowerCase().includes(filtros.buscador.toLowerCase())
      );

    // Filtros específicos
    const cumpleFiltros = 
      (filtros.idFactura === '' || servicio.ID_Factura.toString().includes(filtros.idFactura)) &&
      (filtros.nombreServicio === '' || servicio.Nombre_Servicio.toLowerCase().includes(filtros.nombreServicio.toLowerCase())) &&
      (filtros.cantidad === '' || servicio.Cantidad.toString().includes(filtros.cantidad)) &&
      (filtros.precioUnitario === '' || servicio.Precio_Unitario.toString().includes(filtros.precioUnitario)) &&
      (filtros.total === '' || (servicio.Cantidad * servicio.Precio_Unitario).toString().includes(filtros.total)) &&
      (filtros.estadoServicio === '' || servicio.Estado_Servicio.toLowerCase().includes(filtros.estadoServicio.toLowerCase())) &&
      (filtros.fechaInicial === '' || fechaEmision >= filtros.fechaInicial) &&
      (filtros.fechaFinal === '' || fechaEmision <= filtros.fechaFinal) &&
      (filtros.mesa === '' || servicio.mesa?.toString().includes(filtros.mesa));

    return cumpleBuscador && cumpleFiltros;
  });
};

function ListaRestaurante() {
  // Estados principales
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCajaEstado, setShowCajaEstado] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Estados para actualización automática
  const [count, setCount] = useState(1);
  const [isDataFetched, setIsDataFetched] = useState(false);

  // Filtros iniciales
  const [filters, setFilters] = useState({
    idFactura: '',
    nombreServicio: '',
    cantidad: '',
    precioUnitario: '',
    total: '',
    estadoServicio: '',
    fechaInicial: obtenerFechaHoy(),
    fechaFinal: '',
    mesa: '',
    nombreUsuarioFactura: '',
    buscador: ''
  });

  // Obtener rol del usuario
  const role = localStorage.getItem('role');
  const puedeVerCaja = role === 'Administrador' || role === 'Editor';

  /**
   * Función principal para obtener servicios pendientes del backend
   * Transforma la respuesta en un array plano con información completa
   */
  const obtenerServiciosPendientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.obtenerDatos(ENDPOINT_SERVICIOS);
      const serviciosTransformados = transformarServicios(result.facturas);
      setServicios(serviciosTransformados);
    } catch (err) {
      setError(err.message || 'Error al cargar los servicios');
      console.error('Error al obtener servicios:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Función para refrescar datos (utilizada por el intervalo)
   */
  const fetchFacturas = useCallback(() => {
    console.log("Refrescando datos de facturas...");
    obtenerServiciosPendientes();
  }, [obtenerServiciosPendientes]);

  /**
   * Maneja el cambio en el contador del componente Actualiza
   */
  const handleCountChange = useCallback((newCount) => {
    setCount(newCount);
  }, []);

  /**
   * Alterna la visibilidad de la caja de estado
   */
  const toggleCajaEstado = useCallback(() => {
    setShowCajaEstado(prev => !prev);
  }, []);

  // Servicios filtrados y ordenados (memoizado para optimización)
  const serviciosFiltrados = useMemo(() => {
    const filtrados = aplicarFiltros(servicios, filters);
    return filtrados.sort((a, b) => a.ID_Factura - b.ID_Factura);
  }, [servicios, filters]);

  // Servicios agrupados por factura (memoizado para optimización)
  const serviciosAgrupados = useMemo(() => {
    return serviciosFiltrados.reduce((acc, servicio) => {
      if (!acc[servicio.ID_Factura]) {
        acc[servicio.ID_Factura] = [];
      }
      acc[servicio.ID_Factura].push(servicio);
      return acc;
    }, {});
  }, [serviciosFiltrados]);

  // Hook para escuchar cambios en pedidos y refrescar automáticamente
  useApiWatch(`POST ${ENDPOINT_PEDIDOS}`, obtenerServiciosPendientes);

  // Efecto para carga inicial
  useEffect(() => {
    obtenerServiciosPendientes();
  }, [obtenerServiciosPendientes]);

  // Efecto para actualización automática cada segundo
  useEffect(() => {
    if (count === 1 && !isDataFetched) {
      console.log('Iniciando carga automática de datos...');
      fetchFacturas();
      setIsDataFetched(true);

      const intervalId = setInterval(fetchFacturas, INTERVAL_REFRESH);
      
      return () => {
        console.log('Limpiando intervalo de actualización...');
        clearInterval(intervalId);
      };
    }
    
    if (count !== 1) {
      setIsDataFetched(false);
    }
  }, [count, isDataFetched, fetchFacturas]);

  // Renderizado condicional para estados de carga y error
  if (loading) {
    return (
      <div className={styles.containertabla}>
        <p className={styles.loadingtabla}>Cargando servicios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.containertabla}>
        <p className={styles.errortabla}>Error: {error}</p>
        <button onClick={obtenerServiciosPendientes}>
          Intentar nuevamente
        </button>
      </div>
    );
  }

  return (
    <div className={styles.containertabla}>
      {/* Componente de actualización automática */}
      <Actualiza 
        urlToCount={ENDPOINT_PEDIDOS} 
        onCountChange={handleCountChange} 
      />
      
      {/* Título principal */}
      <h2>Servicios Pendientes</h2>

      {/* Caja de estado (solo para roles autorizados) */}
      {puedeVerCaja && (
        <div className={styles.cajaEstadoSection}>
          <button
            onClick={toggleCajaEstado}
            className={styles.toggleButtontabla}
            aria-expanded={showCajaEstado}
          >
            {showCajaEstado ? 'Ocultar Caja Estado' : 'Mostrar Caja Estado'}
          </button>
          {showCajaEstado && <CajaEstado />}
        </div>
      )}

      {/* Sección de filtros */}
      <div className={styles.filtrosWrappertabla}>
        <Filtros
          filters={filters}
          setFilters={setFilters}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
      </div>

      {/* Tabla de servicios */}
      <div className={styles.tablaWrappertabla}>
        <TablaServicios
          servicios={servicios}
          groupedServicios={serviciosAgrupados}
          obtenerServiciosPendientes={obtenerServiciosPendientes}
        />
      </div>
    </div>
  );
}

export default ListaRestaurante;