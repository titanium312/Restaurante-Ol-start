import React, { useState, useEffect } from 'react';
import styles from './BuscadorServicio.module.css';
import api from '../../../api'; // ⬅️ Asegúrate de que la ruta sea correcta

const BuscadorServicio = ({ onSelect, searchTerm, setSearchTerm }) => {
  const [allServices, setAllServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [showList, setShowList] = useState(false);

  // 🔄 Usar API genérica en lugar de fetch
  const fetchServices = async () => {
    try {
      const data = await api.obtenerDatos('/Hotel/restaurante/ListaServicios');
      if (data && data.servicios) {
        setAllServices(data.servicios);
        setFilteredServices(data.servicios);
      }
    } catch (error) {
      console.error('Error al obtener los servicios:', error.message);
    }
  };

  const filterServices = (term) => {
    if (!term) {
      setFilteredServices(allServices);
    } else {
      const filtered = allServices.filter((service) => {
        const idMatch = service.ID_Servicio.toString().includes(term);
        const nameMatch = service.Nombre.toLowerCase().includes(term.toLowerCase());
        return idMatch || nameMatch;
      });
      setFilteredServices(filtered);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterServices(value);
    setShowList(true);
  };

  const handleSelectService = (service) => {
    onSelect(service);
    setSearchTerm(service.ID_Servicio.toString());
    setShowList(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      const matchedService = allServices.find(
        (service) => service.ID_Servicio.toString() === searchTerm
      );
      if (matchedService) {
        handleSelectService(matchedService);
      }
    }
  };

  useEffect(() => {
    fetchServices(); // Llamar a la API al montar
  }, []);

  return (
    <div className={styles.card}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Filtrar por ID o Nombre..."
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
      />

      {showList && searchTerm && (
        <div className={styles.serviceListWrapper}>
          <ul className={styles.serviceList}>
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <li
                  key={service.ID_Servicio}
                  className={styles.serviceItem}
                  onClick={() => handleSelectService(service)}
                >
                  <span className={styles.id}>{service.ID_Servicio}</span>
                  <span className={styles.name}>{service.Nombre}</span>
                  <span className={styles.price}>${service.Precio}</span>
                </li>
              ))
            ) : (
              <div className={styles.noResultsMessage}>No se encontraron resultados</div>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BuscadorServicio;
