import React, { useState, useEffect } from 'react';
import FormularioServicio from './FormularioServicio/FormularioServicio';
import { TablaServicios } from './TablaServicios/TablaServicios';
import api from '../../../../api';
import Actualiza from '../../../InsertaPedido/Notificada/Actuliza';

const apiBase = '/hotel/restaurante';

const ServiciosCrud = () => {
  const [servicios, setServicios] = useState([]);
  const [formData, setFormData] = useState({
    ID_Servicio: '',
    nombre: '',
    descripcion: '',
    costo: '',
    tipo: '1',
  });

  // Definir productosEdit que faltaba
  const [productosEdit, setProductosEdit] = useState(null);
  const [count, setCount] = useState(1);

  // Referencia para refrescar servicios
  const [refrescarServicios, setRefrescarServicios] = useState(null);

  // Estado para forzar el remount
  const [refreshKey, setRefreshKey] = useState(0);

  // Maneja el cambio en el contador
  const handleCountChange = (newCount) => {
    setCount(newCount);
  };

  // Función para obtener facturas
  const fetchFacturas = () => {
    console.log("Fetching facturas...");
    // Llama a tu API para obtener facturas
  };

  // Efecto para manejar la actualización cuando count cambia
  useEffect(() => {
    console.log('Count cambió a:', count);
    // Si count es 1, iniciar la actualización
    if (count === 1) {
      console.log('Cargando datos porque count es 1...');
      fetchFacturas();
      // Intervalo para actualizar cada 1 segundo mientras count siga siendo 1
      const intervalId = setInterval(() => {
        if (count === 1) {
          fetchFacturas();
        }
      }, 1000);
      return () => {
        clearInterval(intervalId);  // Limpiar el intervalo cuando se desmonte o cambie count
      };
    }
  }, [count]); // Solo depende de count

  const urlToCount = "/Hotel/restaurante/recibir-pedido";

  // Función para pasar a FormularioServicio y refrescar la tabla y el componente
  const handleServicioGuardado = () => {
    if (typeof refrescarServicios === 'function') {
      refrescarServicios();
    }
    setRefreshKey(prev => prev + 1); // Fuerza el remount
  };

  return (
    <div key={refreshKey} style={{ margin: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Gestión de Servicios</h1>
      <div>
        <h1>Componente Principal</h1>
        <p>Contador: {count}</p>
        <Actualiza urlToCount={urlToCount} onCountChange={handleCountChange} />
      </div>

      <FormularioServicio
        api={api}
        apiBase={apiBase}
        formData={formData}
        setFormData={setFormData}
        servicios={servicios}
        setServicios={setServicios}
        productosEdit={productosEdit}
        setProductosEdit={setProductosEdit}
        onServicioGuardado={handleServicioGuardado}
      />

      <TablaServicios
        api={api}
        apiBase={apiBase}
        servicios={servicios}
        setServicios={setServicios}
        setFormData={setFormData}
        setProductosEdit={setProductosEdit}
        onRefrescarServicios={setRefrescarServicios}
      />
    </div>
  );
};

export default ServiciosCrud;
