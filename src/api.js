import axios from 'axios';

const api = {
  obtenerDatos: (endpoint, data = null, method = null) => {
    // Si method no se pasa, decide automático GET o POST
    const httpMethod = method || (data ? 'POST' : 'GET');

    const config = {
      method: httpMethod,
      url: `repo-eliimi-production.up.railway.app${endpoint}`,
      ...(data && { data }),
    };

    return axios(config)
      .then(response => response.data)
      .catch(error => {
        throw new Error('Error al obtener los datos: ' + error.message);
      });
  },
};

export default api;
