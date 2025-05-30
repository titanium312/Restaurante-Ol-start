import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Login.css';
import api from '../api'; // Asegúrate de que este archivo esté bien configurado para hacer las solicitudes API

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Realizar la solicitud POST al servidor para hacer login
      const response = await api.obtenerDatos('/user/login', {
        nombre_usuario: username,
        contraseña: password,
      });

      // Verificar si la respuesta fue exitosa
      if (response.message === 'Inicio de sesión exitoso') {
        const { usuario } = response;
        console.log('Inicio de sesión exitoso:', response.message);

        // Almacenar los datos del usuario en localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', usuario.nombre_usuario);
        localStorage.setItem('role', usuario.rol);
        localStorage.setItem('userId', usuario.id);

        // Llamar a la función onLoginSuccess si existe
        if (onLoginSuccess) {
          onLoginSuccess();
        }

        // Redirigir a la página del restaurante o cualquier otra página
        navigate('/restaurante');
      } else {
        setError('Credenciales incorrectas');
        console.error('Credenciales incorrectas');
      }
    } catch (err) {
      // Manejo de errores en caso de que la API falle
      setError('Error al iniciar sesión. Intenta nuevamente');
      console.error('Error al iniciar sesión:', err);
    }

    setIsLoading(false);
  };

  return (
    <div className="login-container-unique">
      <div className="login-card-unique">
        <h1 className="login-title-unique">Bienvenido</h1>
        <p className="subtitle-unique">El lujo te espera. Inicia sesión para continuar</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group-unique">
            <label htmlFor="username" className="login-label-unique">Nombre de Usuario</label>
            <input 
              type="text"
              id="username" 
              className="login-input-unique"
              placeholder="Ingresa tu nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group-unique">
            <label htmlFor="password" className="login-label-unique">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              className="login-input-unique"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="sign-in-btn-unique"
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
