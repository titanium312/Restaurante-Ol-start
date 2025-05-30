import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Restaurante from "./3-Pedidos/Principal/Restaurante";
import Login from "./Loguin/Login";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta para Login */}
          <Route path="/" element={<Login />} />
          
          {/* Ruta para Restaurante */}
          <Route path="/restaurante" element={<Restaurante />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
