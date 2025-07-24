import React, { useState, useEffect } from 'react';
import api from '../../../api';
import debounce from 'lodash.debounce';
import './BuscadorServicio.css'; // Importa los estilos

const BuscadorServicio = ({ onSelect, searchTerm, setSearchTerm }) => {
  const [allServices, setAllServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [showList, setShowList] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Función para obtener todos los servicios de la API
  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.obtenerDatos('/Hotel/restaurante/ListaServicios');
      if (Array.isArray(response)) {
        setAllServices(response);
        setFilteredServices(response);
      } else {
        throw new Error('Respuesta inválida');
      }
    } catch (err) {
      console.error('Detalles del error:', err);
      setError('Error al obtener los servicios, por favor intente más tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Filtra los servicios según el término de búsqueda
  const filterServices = (term) => {
    const termLower = (term ?? '').toLowerCase();
    if (!termLower) {
      setFilteredServices(allServices);
    } else {
      const filtered = allServices.filter((service) => {
        const idMatch = service.ID_Servicio?.toString().includes(termLower);
        const nameMatch = (service.Nombre ?? '').toLowerCase().includes(termLower);
        return idMatch || nameMatch;
      });
      setFilteredServices(filtered);
    }
  };

  // Función de búsqueda con debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowList(true);
    debounceFilter(value);
  };

  const debounceFilter = debounce((value) => {
    filterServices(value);
  }, 500);

  // Manejador para seleccionar un servicio de la lista
  const handleSelectService = (service) => {
    onSelect(service);
    setSearchTerm(service.ID_Servicio.toString());
    setShowList(false);
  };

  // Manejo de la tecla Enter o Tab
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      const matched = allServices.find(
        (service) => service.ID_Servicio.toString() === searchTerm
      );
      if (matched) handleSelectService(matched);
    }
  };

  // Cargar los servicios al montar el componente
  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="buscador-servicio">
      {/* Campo de búsqueda */}
      <input
        type="text"
        placeholder="🔍 Filtrar por ID o Nombre..."
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        className="buscador-input"
        aria-label="Buscar servicio por ID o nombre"
      />

      {/* Mensaje de carga */}
      {loading && (
        <div className="loading-message">
          Cargando servicios...
        </div>
      )}

      {/* Error al obtener los servicios */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Lista de servicios filtrados */}
      {showList && searchTerm && (
        <ul className="servicios-lista">
          {filteredServices.length > 0 ? (
            filteredServices.map((s) => (
              <li
                key={s.ID_Servicio}
                onClick={() => handleSelectService(s)}
                className="servicio-item"
              >
                <span className="servicio-id">#{s.ID_Servicio}</span>
                <span className="servicio-nombre">{s.Nombre ?? '—'}</span>
                <span className="servicio-costo">${parseFloat(s.Costo).toFixed(2)}</span>
                <span className="servicio-unidades">
                  {s.MaxUnidades ?? '∞'} ud
                </span>
              </li>
            ))
          ) : (
            <li className="no-resultados">
              No se encontraron servicios con ese término de búsqueda
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default BuscadorServicio;