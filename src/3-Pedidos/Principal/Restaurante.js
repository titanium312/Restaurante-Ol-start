import React, { useState } from 'react';
import styles from './Restaurante.module.css';  // Usamos el archivo CSS con módulos
import InsertarPedido from '../InsertaPedido/InsertarPedido';
import ListaRestaurante from '../Lista/ListaRestaurante';
import Usuario from '../Usuario/Usuario';
import ContenedorUser from '../Usuario/admid/administrarUsuarios/AdmidUser';
import ServiciosCrud from '../Usuario/admid/6-servicios/ServiciosCrud';

const Restaurante = () => {
  const [content, setContent] = useState('Selecciona una opción');
  const [activeButton, setActiveButton] = useState(null);
  const [navbarClass, setNavbarClass] = useState(styles.restauranteNavbarBlue);

  // Función para cambiar el contenido y la barra de navegación
  const changeContent = (option) => {
    let newContent;
    if (option === 'Recepcion') {
      newContent = <InsertarPedido />;
      setNavbarClass(styles.restauranteNavbarGreen); // Cambiar la clase de la barra de navegación
    } else if (option === 'Inserta pedido') {
      newContent = <ListaRestaurante />;
      setNavbarClass(styles.restauranteNavbarIndigo); // Cambiar la clase de la barra de navegación
    } else if (option === 'Agregar Servicio') {
      newContent = <ServiciosCrud />;
      setNavbarClass(styles.restauranteNavbarIndigo); // Cambiar la clase de la barra de navegación
    } else if (option === 'Administrar Usuarios') {
      newContent = <ContenedorUser />;
      setNavbarClass(styles.restauranteNavbarIndigo); // Cambiar la clase de la barra de navegación
    }

    setContent(newContent);
    setActiveButton(option);
  };

  return (
    <div className={styles.restauranteContainer}>
      {/* Barra de navegación superior */}
      <div className={`${styles.restauranteNavbar} ${navbarClass}`}>
        <button
          id="recepcion-btn"
          onClick={() => changeContent('Recepcion')}
          className={`${styles.restauranteBtnNav} ${activeButton === 'Recepcion' ? styles.restauranteBtnNavActive : ''}`}
        >
          Inserta pedido
        </button>
        <button
          id="pedido-btn"
          onClick={() => changeContent('Inserta pedido')}
          className={`${styles.restauranteBtnNav} ${activeButton === 'Inserta pedido' ? styles.restauranteBtnNavActive : ''}`}
        >
          Recepcion
        </button>

        {/* Pasamos la función changeContent a Usuario */}
          <div style={{ marginLeft: 'auto' }}>
            <Usuario changeContent={changeContent} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}/>
          </div>
              </div>

              {/* Contenido dinámico */}
      <div className={`${styles.restauranteContent} ${activeButton ? styles.restauranteContentShow : ''}`}>
        {content ? (
          content
        ) : (
          <div>
            <h2 className={styles.restauranteTitle}>Selecciona una opción</h2>
            <p className={styles.restauranteDescription}>Haz clic en uno de los botones arriba para cambiar el contenido.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurante;
