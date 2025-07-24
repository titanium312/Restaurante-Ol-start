import React, { useState } from 'react';  // <-- quité useEffect
import styles from './Restaurante.module.css';
import InsertarPedido from '../InsertaPedido/InsertarPedido';
import ListaRestaurante from '../Lista/ListaRestaurante';
import Usuario from '../Usuario/Usuario';
import ContenedorUser from '../Usuario/admid/administrarUsuarios/Usuarios';
import ServiciosCrud from '../Usuario/admid/6-servicios/ServiciosCrud';
import Portada from './PORTADA/portada';
import ContenedorProductos from '../Usuario/admid/Inventarios/ContenedorProductos';


const Restaurante = () => {
  // ✅ Mostrar portada inicialmente
  const [content, setContent] = useState(<Portada />);
  const [activeButton, setActiveButton] = useState(null);
  const [navbarClass, setNavbarClass] = useState(styles.restauranteNavbarBlue);

  // ✅ Función para cambiar el contenido
  const changeContent = (option) => {
    let newContent;

    switch (option) {
      case 'Recepcion':
        newContent = <InsertarPedido />;
        setNavbarClass(styles.restauranteNavbarGreen);
        break;
      case 'Inserta pedido':
        newContent = <ListaRestaurante />;
        setNavbarClass(styles.restauranteNavbarIndigo);
        break;
      case 'Agregar Servicio':
        newContent = <ServiciosCrud />;
        setNavbarClass(styles.restauranteNavbarIndigo);
        break;
      case 'Administrar Usuarios':
        newContent = <ContenedorUser />;
        setNavbarClass(styles.restauranteNavbarIndigo);
        break;
        case 'Administrar Productos':
        newContent = <ContenedorProductos />;
        setNavbarClass(styles.restauranteNavbarIndigo);
        break;
      default:
        newContent = <Portada />;
        setNavbarClass(styles.restauranteNavbarBlue);
        break;
    }

    setContent(newContent);
    setActiveButton(option);
  };

  return (
    <div className={styles.restauranteContainer}>
      {/* Barra de navegación superior */}
      <div className={`${styles.restauranteNavbar} ${navbarClass}`}>
        <button
          onClick={() => changeContent('Recepcion')}
          className={`${styles.restauranteBtnNav} ${activeButton === 'Recepcion' ? styles.restauranteBtnNavActive : ''}`}
        >
          Inserta pedido
        </button>
        <button
          onClick={() => changeContent('Inserta pedido')}
          className={`${styles.restauranteBtnNav} ${activeButton === 'Inserta pedido' ? styles.restauranteBtnNavActive : ''}`}
        >
          Recepción
        </button>

        {/* Usuario componente */}
        <div style={{ marginLeft: 'auto' }}>
          <Usuario changeContent={changeContent} />
        </div>
      </div>

      {/* Contenido dinámico */}
      <div className={`${styles.restauranteContent} ${styles.restauranteContentShow}`}>
        {content}
      </div>
    </div>
  );
};

export default Restaurante;
