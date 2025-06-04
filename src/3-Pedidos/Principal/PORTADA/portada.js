import React from 'react';
import './portada.css';

const Portada = () => {
  return (
    <div className="portada-container">
      <div className="portada-content">
        <h1 className="portada-title">Restaurante SEJE</h1>
        <div className="decorative-line"></div>
        <p className="portada-subtitle">
          Sistema de Gestión Gastronómica
          <br />
          Experiencia Culinaria de Excelencia
        </p>
        {/* Opcional: Botón de acción */}
        {/* <button className="elegant-button">Comenzar</button> */}
      </div>
    </div>
  );
};

export default Portada;