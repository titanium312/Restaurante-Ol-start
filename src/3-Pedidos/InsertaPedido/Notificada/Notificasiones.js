import React, { useState, useEffect, useRef } from "react";
import Actualiza from "./Actuliza";
import api from "../../../api";
import "./Notificasiones.css";

function ServicioAlerta() {
  const urlToCount = "/Hotel/restaurante/recibir-pedido";
  const [count, setCount] = useState(1);
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationMinimized, setNotificationMinimized] = useState(false);
  const [expandedProducts, setExpandedProducts] = useState({});

  const isFetchingRef = useRef(false);
  const notificationRef = useRef(null);

  const handleCountChange = (newCount) => {
    setCount(newCount);
  };

  const toggleProductList = (serviceId) => {
    setExpandedProducts(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  useEffect(() => {
    const fetchFacturas = async () => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      setLoading(true);

      try {
        const data = await api.obtenerDatos("/Hotel/restaurante/ListaServicios");

        if (Array.isArray(data) && data.length > 0) {
          const filteredFacturas = data.filter(
            (factura) => factura.MaxUnidades < 10
          );

          const facturasConProductos = filteredFacturas
            .map((factura) => {
              const productosFiltrados = factura.Productos?.filter(
                (producto) => producto.Stock < 10
              );
              if (productosFiltrados && productosFiltrados.length > 0) {
                return { ...factura, Productos: productosFiltrados };
              }
              return null;
            })
            .filter((factura) => factura !== null);

          setFacturas(facturasConProductos);
          setError(null);

          if (facturasConProductos.length > 0) {
            setShowNotification(true);
            if (!notificationVisible) {
              setNotificationVisible(true);
            }
          } else {
            setShowNotification(false);
          }
        } else {
          setFacturas([]);
          setError("No se encontraron facturas disponibles.");
          setShowNotification(false);
        }
      } catch (error) {
        console.error("Error al obtener las facturas", error);
        setError("Ocurrió un error al cargar las facturas.");
        setShowNotification(false);
      } finally {
        isFetchingRef.current = false;
        setLoading(false);
      }
    };

    if (count === 1 && !isDataFetched) {
      fetchFacturas();
      setIsDataFetched(true);

      const intervalId = setInterval(() => {
        fetchFacturas();
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }

    setCount(0);
    setIsDataFetched(false);
  }, [count, isDataFetched, notificationVisible]);

  const toggleNotificationVisibility = () => {
    setNotificationVisible(!notificationVisible);
    if (!notificationVisible) {
      setNotificationMinimized(false);
    }
  };

  const toggleMinimizeNotification = () => {
    setNotificationMinimized(!notificationMinimized);
  };

  const closeNotification = () => {
    setNotificationVisible(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="nf-container">
      <Actualiza
        urlToCount={urlToCount}
        onCountChange={handleCountChange}
        style={{ display: "none" }}
      />

      {loading && (
        <div className="nf-loading">
          <div className="nf-spinner"></div>
          <span>Cargando...</span>
        </div>
      )}
      {error && <div className="nf-error">{error}</div>}

      <div
        className={`nf-bell-container ${showNotification ? "has-alerts" : ""}`}
        onClick={toggleNotificationVisibility}
        title={showNotification ? "Tienes alertas de stock" : "No hay alertas"}
      >
        <svg className="nf-bell-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
        </svg>
        {showNotification && <span className="nf-badge">{facturas.length}</span>}
      </div>

      {notificationVisible && (
        <div
          ref={notificationRef}
          className={`nf-notification-window ${notificationMinimized ? "minimized" : ""}`}
        >
          <div className="nf-header">
            <div className="nf-header-content">
              <div className="nf-header-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                </svg>
              </div>
              <div className="nf-header-text">
                <h3>Alertas de Stock</h3>
                {showNotification && <span className="nf-count">{facturas.length} alertas</span>}
              </div>
            </div>
            <div className="nf-header-actions">
              <button
                onClick={toggleMinimizeNotification}
                className="nf-btn nf-btn-icon"
                title={notificationMinimized ? "Expandir" : "Minimizar"}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  {notificationMinimized ? (
                    <path d="M7 14l5-5 5 5z" />
                  ) : (
                    <path d="M7 10l5 5 5-5z" />
                  )}
                </svg>
              </button>
              <button
                onClick={closeNotification}
                className="nf-btn nf-btn-icon nf-btn-close"
                title="Cerrar"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
          </div>

          {!notificationMinimized && (
            <div className="nf-content">
              {facturas.length > 0 ? (
                <div className="nf-alerts">
                  {facturas.map((factura) => (
                    <div key={factura.ID_Servicio} className="nf-alert-card">
                      <div className="nf-alert-header">
                        <div className="nf-service-info">
                          <span className="nf-service-id">#{factura.ID_Servicio}</span>
                          <span className="nf-service-name">
                            {factura.Nombre || factura.Productos[0]?.Nombre_Producto || "Sin nombre"}
                          </span>
                        </div>
                        <div className="nf-stock-badge">
                          <span className="nf-stock-label">Stock:</span>
                          <span className="nf-stock-value">{factura.MaxUnidades || "N/A"}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleProductList(factura.ID_Servicio)}
                        className="nf-btn nf-btn-secondary nf-btn-full"
                      >
                        <span>
                          {expandedProducts[factura.ID_Servicio] ? "Ocultar" : "Ver"} productos ({factura.Productos?.length || 0})
                        </span>
                        <svg
                          className={`nf-btn-icon ${expandedProducts[factura.ID_Servicio] ? "rotated" : ""}`}
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M7 10l5 5 5-5z" />
                        </svg>
                      </button>

                      {expandedProducts[factura.ID_Servicio] && (
                        <div className="nf-products-container">
                          {factura.Productos?.map((producto) => (
                            <div
                              key={producto.ID_Producto}
                              className={`nf-product-card ${producto.Stock < 5 ? "critical" : "warning"}`}
                            >
                              <div className="nf-product-info">
                                <span className="nf-product-id">#{producto.ID_Producto}</span>
                                <span className="nf-product-name">{producto.Nombre_Producto}</span>
                              </div>
                              <div className="nf-product-stock">
                                <span className="nf-stock-number">{producto.Stock}</span>
                                {producto.Stock < 5 && <span className="nf-urgent-badge">URGENTE</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="nf-no-alerts">
                  <div className="nf-no-alerts-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4>Todo en orden</h4>
                  <p>No hay alertas de stock en este momento</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ServicioAlerta;
