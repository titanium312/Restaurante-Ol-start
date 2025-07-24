import React, { useState } from 'react';
import styles from './Productos.module.css';
import RegistraProducto from './ResgistraProducto/ResgitraProducto';
import EntradaProducto from './EntradaProducto/EntradaProducto';
import SaleProducto from './SaleProducto/SaleProducto';
import ListaProducto from './ListaProducto/ListaProducto';

function Productos() {
  const [contenido, setContenido] = useState(<ListaProducto />);
  const [activeTab, setActiveTab] = useState('Lista');

  function cambiarContenido(tab) {
    setActiveTab(tab);
    switch(tab) {
      case 'Registra':
        setContenido(<RegistraProducto />);
        break;
      case 'Entra':
        setContenido(<EntradaProducto />);
        break;
      case 'Sale':
        setContenido(<SaleProducto />);
        break;
      case 'Lista':
        setContenido(<ListaProducto />);
        break;
      default:
        setContenido(<ListaProducto />);
    }
  }

  return (
    <div className={styles['productos-container']}>
      <nav className={styles['productos-grid']}>
        <div className={styles['productos-gridWrapper']}>
          <div
            className={`${styles['productos-gridItem']} ${activeTab === 'Registra' ? styles['productos-active'] : ''}`}
            onClick={() => cambiarContenido('Registra')}
          >
            Registra Producto
          </div>
          <div
            className={`${styles['productos-gridItem']} ${activeTab === 'Entra' ? styles['productos-active'] : ''}`}
            onClick={() => cambiarContenido('Entra')}
          >
            Entra producto
          </div>
          <div
            className={`${styles['productos-gridItem']} ${activeTab === 'Sale' ? styles['productos-active'] : ''}`}
            onClick={() => cambiarContenido('Sale')}
          >
            Venta de producto
          </div>
          <div
            className={`${styles['productos-gridItem']} ${activeTab === 'Lista' ? styles['productos-active'] : ''}`}
            onClick={() => cambiarContenido('Lista')}
          >
            Lista de Producto
          </div>
        </div>
      </nav>
      <div className={styles['productos-displayArea']}>
        {contenido}
      </div>
    </div>
  );
}

export default Productos;
