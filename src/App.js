// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Loguin/Login'; // Asegúrate de que esta ruta coincida
import Restaurante from './3-Pedidos/Principal/Restaurante'; // Ruta protegida

// Componente de ruta protegida
const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  return isLoggedIn === 'true' ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública: login */}
        <Route path="/" element={<Login />} />

        {/* Ruta protegida */}
        <Route
          path="/restaurante"
          element={
            <PrivateRoute>
              <Restaurante />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
