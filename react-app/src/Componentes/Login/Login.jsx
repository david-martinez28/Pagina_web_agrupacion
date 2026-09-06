import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api'; // Ajusta la ruta a donde tengas tu api.js

function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Como tu api.js manda las peticiones normales, enviamos el JSON tal cual
      const res = await api.post('/login', { correo, contrasena });
      
      // Tu api.js ya ha interceptado la respuesta, la ha descifrado y ha reemplazado 
      // res.data con el JSON real. Así que accedemos directamente:
      const data = res.data;

      // ⚠️ MUY IMPORTANTE: Lo guardamos como 'token' para que tu api.js lo encuentre
      localStorage.setItem('token', data.token);
      localStorage.setItem('admin_data', JSON.stringify(data.admin));

      // Redirigimos al panel
      navigate('/admin/dashboard'); // Ajusta a la ruta de tu panel
      
    } catch (err) {
      console.error("Error en login:", err);
      // Extraemos el error que devuelve Laravel
      if (err.response && err.response.data && err.response.data.errors) {
        setError(err.response.data.errors.correo[0]);
      } else if (err.response && err.response.data && err.response.data.mensaje) {
        setError(err.response.data.mensaje);
      } else {
        setError('Credenciales incorrectas o error de conexión.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-4">
          <form onSubmit={handleLogin} className="card p-4 shadow-sm border-0 bg-light">
            <h2 className="text-center mb-4 fw-light">Acceso Admin</h2>
            
            {error && (
              <div className="alert alert-danger p-2 small text-center">
                {error}
              </div>
            )}
            
            <div className="mb-3">
              <label className="form-label text-secondary small">Correo Electrónico</label>
              <input 
                type="email" 
                className="form-control" 
                value={correo} 
                onChange={(e) => setCorreo(e.target.value)} 
                required 
              />
            </div>

            <div className="mb-4">
              <label className="form-label text-secondary small">Contraseña</label>
              <input 
                type="password" 
                className="form-control" 
                value={contrasena} 
                onChange={(e) => setContrasena(e.target.value)} 
                required 
              />
            </div>

            <button type="submit" className="btn btn-dark w-100" disabled={loading}>
              {loading ? 'Comprobando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;