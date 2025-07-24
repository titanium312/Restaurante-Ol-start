import React, { useState, useEffect } from 'react';
import styles from './ListaRestaurante.module.css';
import Filtros from './Filtros/Filtros';
import api, { useApiWatch } from '../../api';
import { TablaServicios } from './TablaServicios/TablaServicios';
import CajaEstado from './Caja/Caja';
import Actualiza from '../InsertaPedido/Notificada/Actuliza';

function ListaRestaurante() {
  const hoy = new Date().toISOString().split('T')[0];

  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCajaEstado, setShowCajaEstado] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    idFactura: '',
    nombreServicio: '',
    cantidad: '',
    precioUnitario: '',
    total: '',
    estadoServicio: '',
    fechaInicial: hoy,
    fechaFinal: '',
    mesa: '',
    nombreUsuarioFactura: '',
    buscador: ''
  });

  const role = localStorage.getItem('role');

// Función que obtiene los servicios pendientes desde el backend,
// transforma la respuesta para crear un array plano con información completa
// y actualiza el estado con esos servicios.
const obtenerServiciosPendientes = async () => {
  setLoading(true);
  setError(null);
  try {
    // Consulta al backend la lista de facturas con sus servicios
    const result = await api.obtenerDatos('/Hotel/restaurante/servicio/Recepcion-ServiciosList');

    // Transformamos la respuesta para obtener un array plano de servicios,
    // agregando datos de factura y tipo de servicio a cada elemento.
    const serviciosPlanos = result.facturas.flatMap(factura => {
      const serviciosPorFactura = [];

      // Iterar cada tipo de servicio (ej. Restaurante, Bar, etc)
      for (const tipo in factura.Servicios) {
        factura.Servicios[tipo].forEach(servicio => {
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
      }

      return serviciosPorFactura;
    });

    // Actualiza el estado con el array plano de servicios
    setServicios(serviciosPlanos);
  } catch (err) {
    setError(err.message || 'Error al cargar los servicios');
  } finally {
    setLoading(false);
  }
};



// Uso del hook para escuchar cuando se realice un POST a /Hotel/restaurante/recibir-pedido
// y refrescar automáticamente los servicios pendientes.
useApiWatch('POST /Hotel/restaurante/recibir-pedido', obtenerServiciosPendientes);


  useEffect(() => {
    obtenerServiciosPendientes();
  }, []);

  const filteredServicios = servicios
    .filter(servicio => {
      const fechaEmision = new Date(servicio.Fecha_Emision).toISOString().split('T')[0];
      return (
        (filters.buscador === '' || Object.values(servicio).some(val =>
          val && val.toString().toLowerCase().includes(filters.buscador.toLowerCase())
        )) &&
        (filters.idFactura === '' || servicio.ID_Factura.toString().includes(filters.idFactura)) &&
        (filters.nombreServicio === '' || servicio.Nombre_Servicio.toLowerCase().includes(filters.nombreServicio.toLowerCase())) &&
        (filters.cantidad === '' || servicio.Cantidad.toString().includes(filters.cantidad)) &&
        (filters.precioUnitario === '' || servicio.Precio_Unitario.toString().includes(filters.precioUnitario)) &&
        (filters.total === '' || (servicio.Cantidad * servicio.Precio_Unitario).toString().includes(filters.total)) &&
        (filters.estadoServicio === '' || servicio.Estado_Servicio.toLowerCase().includes(filters.estadoServicio.toLowerCase())) &&
        (filters.fechaInicial === '' || fechaEmision >= filters.fechaInicial) &&
        (filters.fechaFinal === '' || fechaEmision <= filters.fechaFinal) &&
        (filters.mesa === '' || servicio.mesa?.toString().includes(filters.mesa))
      );
    })
    .sort((a, b) => a.ID_Factura - b.ID_Factura);

  const groupedServicios = filteredServicios.reduce((acc, servicio) => {
    if (!acc[servicio.ID_Factura]) {
      acc[servicio.ID_Factura] = [];
    }
    acc[servicio.ID_Factura].push(servicio);
    return acc;
  }, {});


  //actualizar la tabla

   const [count, setCount] = useState(1);
  const [isDataFetched, setIsDataFetched] = useState(false);
  
  // Maneja el cambio en el contador
  const handleCountChange = (newCount) => {
    setCount(newCount);
  };

  // Función para obtener facturas
  const fetchFacturas = () => {
    console.log("Fetching facturas...");
    // Llama a tu API para obtener facturas
  };

  useEffect(() => {
    if (count === 1 && !isDataFetched) {
      console.log('Cargando datos por primera vez...');
      fetchFacturas();
      setIsDataFetched(true);  // Marcar que los datos han sido cargados

      // Intervalo para actualizar cada 1 segundo
      const intervalId = setInterval(() => {
        fetchFacturas();  // Continuar llamando a la API cada 1 segundo
      }, 1000);

      return () => {
        clearInterval(intervalId);  // Limpiar el intervalo cuando se desmonte
      };
    }
    
    // Resetear cuando count cambia (si es necesario)
    if (count !== 1) {
      setIsDataFetched(false);
    }
  }, [count, isDataFetched]);  // Ejecutar el efecto solo cuando count o isDataFetched cambian

  const urlToCount = "/Hotel/restaurante/recibir-pedido";


  return (
    <div className={styles.container}>
      {loading && <p className={styles.loading}>Cargando...</p>}
      {error && <p className={styles.error}>Error: {error}</p>}


<div>      {/* Pasa la función handleCountChange al componente hijo */}
      <Actualiza urlToCount={urlToCount} onCountChange={handleCountChange} />
    </div>
      
      
      <h2>Servicios Pendientes</h2>

      {(role === 'Administrador' || role === 'Editor') && (
        <>
          <button
            onClick={() => setShowCajaEstado(prev => !prev)}
            className={styles.toggleButton}
          >
            {showCajaEstado ? 'Ocultar Caja Estado' : 'Mostrar Caja Estado'}
          </button>
          {showCajaEstado && <CajaEstado />}
        </>
      )}

      <br /><br />

      <div className={styles.filtrosWrapper}>



        <Filtros
          filters={filters}
          setFilters={setFilters}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
      </div>

      <div className={styles.tablaWrapper}>
        <TablaServicios
          servicios={servicios}
          groupedServicios={groupedServicios}
          obtenerServiciosPendientes={obtenerServiciosPendientes}
        />
      </div>
    </div>
  );
}

export default ListaRestaurante;