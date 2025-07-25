import ReactDOM from "react-dom";

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const contentStyle = {
  backgroundColor: "#fff",              // Fondo blanco
  padding: "30px",                      // Espaciado interno
  borderRadius: "12px",                 // Bordes redondeados
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)", // Sombra para efecto de elevación
  width: "90%",                         // Responsive en pantallas pequeñas
  maxWidth: "500px",                    // Máximo ancho del modal
  maxHeight: "80vh",                    // Altura máxima para evitar desbordes
  overflowY: "auto",                    // Scroll si el contenido es muy alto
  fontFamily: "'Segoe UI', sans-serif",
  color: "#333",                        // Color de texto
  position: "relative",                // Para posicionar elementos internos si hace falta
};



const Modal = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div style={overlayStyle}>
      <div style={contentStyle}>
        
        {children}
      </div>
    </div>,
    document.getElementById("modal")
  );
};

export default Modal;
