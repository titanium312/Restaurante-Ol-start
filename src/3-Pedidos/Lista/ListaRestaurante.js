import React, { useState, useEffect } from 'react';
import styles from './LIstaRestaurante.module.css';
import Filtros from './Filtros/Filtros';
import api, { useApiWatch } from '../../api';
import { TablaServicios } from './TablaServicios/TablaServicios';
import CajaEstado from './Caja/Caja';

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



  const obtenerServiciosPendientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.obtenerDatos('/Hotel/restaurante/servicio/Recepcion-ServiciosList');
      const serviciosCompletos = [
        ...(Array.isArray(result.Restaurante) ? result.Restaurante : []),
        ...(Array.isArray(result.Bar) ? result.Bar : []),
      ];
      setServicios(serviciosCompletos);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className={styles.container}>
      {loading && <p className={styles.loading}>Cargando...</p>}
      {error && <p className={styles.error}>Error: {error}</p>}

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
