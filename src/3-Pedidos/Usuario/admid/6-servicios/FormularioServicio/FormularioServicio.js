import React from 'react';
import './FormularioServicio.css';

const FormularioServicio = ({ formData, handleChange, handleSubmit }) => {
  return (
    <form className="formulario-servicio" onSubmit={handleSubmit}>
      <label>
        ID del Servicio:
        <input type="number" id="ID_Servicio" value={formData.ID_Servicio} onChange={handleChange} required />
      </label>
      <label>
        Nombre del Servicio:
        <input type="text" id="nombre" value={formData.nombre} onChange={handleChange} required />
      </label>
      <label>
        Descripción:
        <input type="text" id="descripcion" value={formData.descripcion} onChange={handleChange} required />
      </label>
      <label>
        Costo:
        <input type="number" id="costo" value={formData.costo} onChange={handleChange} required />
      </label>
      <label>
        Tipo de Servicio:
        <select id="tipo" value={formData.tipo} onChange={handleChange} required>
          <option value="1">Restaurante</option>
          <option value="2">Bar</option>
        </select>
      </label>
      <button type="submit">Guardar Servicio</button>
    </form>
  );
};

export default FormularioServicio;
