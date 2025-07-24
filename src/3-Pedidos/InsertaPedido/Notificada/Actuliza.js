import React, { useState, useEffect } from "react";
import { useApiWatch } from "../../../api"; // Importamos el hook

function Actualiza({ urlToCount, onCountChange }) {
  const [movimientos, setMovimientos] = useState([]);

  // Usamos el hook useApiWatch para escuchar el evento SSE
  useApiWatch(urlToCount, () => {
    // Esta función se ejecuta cuando el patrón es encontrado
    onCountChange((prevCount) => prevCount + 1);
  });

  useApiWatch(urlToCount, (message) => {
    setMovimientos((prevMovimientos) => [...prevMovimientos, message]);
  });

  return (
    <></> // No se necesita renderizar nada aquí, ya que solo estamos actualizando el estado
  );
}

export default Actualiza;
