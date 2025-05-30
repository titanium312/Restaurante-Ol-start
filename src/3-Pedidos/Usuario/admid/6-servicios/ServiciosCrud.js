import React, { useEffect, useState } from 'react';
import FormularioServicio from './FormularioServicio/FormularioServicio';
import { TablaServicios } from './TablaServicios/TablaServicios';
import api from '../../../../api'; // Ajusta la ruta si es necesario

const ServiciosCrud = () => {
  const [servicios, setServicios] = useState([]);
  const [formData, setFormData] = useState({
    ID_Servicio: '',
    nombre: '',
    descripcion: '',
    costo: '',
    tipo: '1'
  });

  const apiBase = '/hotel/restaurante';

  useEffect(() => {
    cargarServicios();
  }, []);

  const cargarServicios = async () => {
    try {
      const data = await api.obtenerDatos(`${apiBase}/ListaServicios`);
      console.log('Datos recibidos:', data);  // Para depurar la estructura real

      // Ajusta aquí la propiedad según la estructura real de la respuesta:
      const lista = data.servicios || data.listaServicios || [];
      setServicios(lista);
    } catch (error) {
      console.error('Error al cargar servicios:', error.message);
      alert('Error al obtener la lista de servicios.');
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const id = parseInt(formData.ID_Servicio);
    const payload = {
      ID_Servicio: id,
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      costo: parseFloat(formData.costo),
      tipo: parseInt(formData.tipo)
    };

    const existe = servicios.some(s => s.ID_Servicio === id);

    try {
      if (existe) {
        // Usar PUT para actualizar
        await api.obtenerDatos(`${apiBase}/ActualizarServicio/${id}`, payload, 'PUT');
      } else {
        // Usar POST para crear nuevo
        await api.obtenerDatos(`${apiBase}/RegistraServicio`, payload, 'POST');
      }

      setFormData({ ID_Servicio: '', nombre: '', descripcion: '', costo: '', tipo: '1' });
      cargarServicios();
    } catch (error) {
      console.error('Error al guardar servicio:', error.message);
      alert('Error al guardar el servicio.');
    }
  };

  const editarServicio = (servicio) => {
    setFormData({
      ID_Servicio: servicio.ID_Servicio,
      nombre: servicio.Nombre || servicio.nombre,
      descripcion: servicio.Descripcion || servicio.descripcion,
      costo: servicio.Precio || servicio.costo,
      tipo: servicio.Tipo_Servicio === 'Bar' || servicio.tipo === 2 ? '2' : '1'
    });
  };

  const eliminarServicio = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este servicio?')) {
      try {
        // Usar DELETE para eliminar
        await api.obtenerDatos(`${apiBase}/EliminarServicio/${id}`, null, 'DELETE');
        cargarServicios();
      } catch (error) {
        console.error('Error al eliminar servicio:', error.message);
        alert('Error al eliminar el servicio.');
      }
    }
  };

 return (
  <div style={{ margin: '2rem', fontFamily: 'Arial, sans-serif' }}>
    <h1>Gestión de Servicios</h1>

    <FormularioServicio
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />

    <TablaServicios
      servicios={servicios}
      editarServicio={editarServicio}
      eliminarServicio={eliminarServicio}
    />
  </div>
  );
}

export default ServiciosCrud;
