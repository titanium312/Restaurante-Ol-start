import axios from 'axios';
import { useEffect, useRef } from 'react';

// Base URL de la API para que puedas usarla también en el hook si quieres
const BASE_URL = 'https://hotel-production-758e.up.railway.app';

const api = {
  obtenerDatos: (endpoint, data = null, method = null) => {
    // Si method no se pasa, decide automático GET o POST
    const httpMethod = method || (data ? 'POST' : 'GET');

    const config = {
      method: httpMethod,
      url: `${BASE_URL}${endpoint}`,
      ...(data && { data }),
    };

    return axios(config)
      .then(response => response.data)
      .catch(error => {
        throw new Error('Error al obtener los datos: ' + error.message);
      });
  },
};

// Hook para escuchar eventos SSE y ejecutar una función cuando detecta un patrón
// Usa la misma base URL para el endpoint SSE, así si cambias aquí, afecta a todos lados
export function useApiWatch(pattern, onMatch) {
  const onMatchRef = useRef(onMatch);
  onMatchRef.current = onMatch;

  useEffect(() => {
    const eventSource = new EventSource(`${BASE_URL}/logs`);

    eventSource.onmessage = (event) => {
      const message = event.data;
      if (message.includes(pattern)) {
        onMatchRef.current();
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE error:', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [pattern]);
}

export default api;
