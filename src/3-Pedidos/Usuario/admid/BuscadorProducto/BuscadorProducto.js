import React, { useState, useEffect } from 'react';
import styles from './BuscadorProducto.module.css';
import api from '../../../../api'; // ⬅️ Asegúrate de que la ruta sea correcta

const BuscadorProducto = ({ onSelect, searchTerm, setSearchTerm }) => {
  const [allServices, setAllServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [showList, setShowList] = useState(false);

  const fetchServices = async () => {
    try {
      const data = await api.obtenerDatos('/Hotel/productos/productos-Optener');
      if (Array.isArray(data)) {  // Use data directly as array
        setAllServices(data);
        setFilteredServices(data);
      }
    } catch (error) {
      console.error('Error al obtener los servicios:', error.message);
    }
  };

  const filterServices = (term) => {
    const termLower = (term ?? '').toLowerCase();

    if (!termLower) {
      setFilteredServices(allServices);
    } else {
      const filtered = allServices.filter((service) => {
        const idMatch = service.ID?.toString().includes(termLower);
        const nameMatch = (service.Nombre ?? '').toLowerCase().includes(termLower);
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
  onSelect({
    ID: service.ID,
    Nombre: service.Nombre,
    Precio_Unitario: service.Precio_Unitario,
    Unidad: service.Unidad, // Asegúrate de incluir la unidad aquí
  });
  setSearchTerm(service.ID.toString());
  setShowList(false);
};

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      const matchedService = allServices.find(
        (service) => service.ID.toString() === searchTerm
      );
      if (matchedService) {
        handleSelectService(matchedService);
      }
    }
  };

  useEffect(() => {
    fetchServices();
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
                  key={service.ID}
                  className={styles.serviceItem}
                  onClick={() => handleSelectService(service)}
                >
                  <span className={styles.id}>{service.ID}</span>
                  <span className={styles.name}>{service.Nombre}</span>
                  <span className={styles.price}>${service.Precio_Unitario}</span>
                  <span className={styles.stock}>Stock: {service.Stock}</span> {/* Added stock display */}
                  <span className={styles.stock}>{service.Unidad}</span> {/* Unidad*/}
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

export default BuscadorProducto;