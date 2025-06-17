import React, { useState, useRef, useEffect } from 'react';
import './SidebarPanel.css';
import { useNavigate } from 'react-router-dom';

const Usuario = ({ changeContent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);
  const navigate = useNavigate();

  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/');
  };

  const togglePanel = () => setIsOpen(!isOpen);

  // Cierra el panel si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="user-container">
      <button onClick={togglePanel} className="user-button" aria-label="Usuario">
        👤
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          className="user-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="userPanelTitle"
        >
          <h4 id="userPanelTitle">Usuario</h4>

          {username ? (
            <>
              <p><strong>Nombre:</strong> {username}</p>
              <p><strong>Rol:</strong> {role}</p>

              {(role === 'Editor' || role === 'Administrador') && (
                <>
                  <button 
                    id="agregarServicios-btn"
                    onClick={() => changeContent('Agregar Servicio')}
                    className="add-service-button"
                    type="button"
                  >
                    Agregar Servicio
                  </button>

                  {role === 'Administrador' && (
                    <button
                      id="administrarUsuarios-btn"
                      onClick={() => changeContent('Administrar Usuarios')}
                      className="add-service-button"
                      type="button"
                    >
                      Administrar Usuarios
                    </button>
                  )}
                </>
              )}

              <button onClick={handleLogout} className="logout-button" type="button">
                Cerrar sesión
              </button>
            </>
          ) : (
            <p>No has iniciado sesión.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Usuario;
