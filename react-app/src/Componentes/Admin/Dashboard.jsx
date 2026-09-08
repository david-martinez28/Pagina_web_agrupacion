import { useNavigate, Link } from 'react-router-dom';
import api from '../../api'; // Ajusta la ruta a donde tengas tu archivo api.js

function Dashboard() {
  const navigate = useNavigate();
  
  // Recuperar los datos del administrador para mostrar un saludo personalizado
  const adminData = JSON.parse(localStorage.getItem('admin_data') || '{}');

  const handleLogout = async () => {
    try {
      // Llamamos a la API de Laravel para revocar el token en el servidor de forma segura
      await api.post('/logout');
    } catch (error) {
      console.error("Error al cerrar sesión en el servidor", error);
    } finally {
      // Pase lo que pase con la petición, limpiamos la sesión local y redirigimos
      localStorage.removeItem('token');
      localStorage.removeItem('admin_data');
      navigate('/login');
    }
  };

  return (
    <div className="container-xl py-5">
      {/* Cabecera del panel */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
        <h1 className="fw-light m-0">Panel de Administración</h1>
        <button onClick={handleLogout} className="btn btn-outline-danger">
          Cerrar Sesión
        </button>
      </div>

      {/* Alerta de Bienvenida */}
      <div className="alert alert-success shadow-sm border-0">
        ¡Hola, <strong>{adminData.nombre || 'Administrador'}</strong>! Has iniciado sesión correctamente.
      </div>

      {/* Cuadrícula de gestión */}
      <div className="row g-4 mt-2">
        
        {/* Tarjeta de Empresas */}
        <div className="col-12 col-md-4">
          <div className="card shadow-sm border-0 h-100 p-4 text-center d-flex flex-column">
            <div className="mb-3">
              <span className="fs-1">🏢</span>
            </div>
            <h3 className="h5 fw-bold">Empresas</h3>
            <p className="text-muted small mb-4">
              Gestiona las empresas adheridas al carnet de socio y sus ofertas.
            </p>
            <Link to="/admin/empresas" className="btn btn-dark mt-auto w-100">
              Gestionar
            </Link>
          </div>
        </div>
        
        {/* Tarjeta de Noticias */}
        <div className="col-12 col-md-4">
          <div className="card shadow-sm border-0 h-100 p-4 text-center d-flex flex-column">
            <div className="mb-3">
              <span className="fs-1">📰</span>
            </div>
            <h3 className="h5 fw-bold">Noticias</h3>
            <p className="text-muted small mb-4">
              Publica, edita o elimina las noticias visibles en la portada.
            </p>
            <Link to="/admin/noticias" className="btn btn-dark mt-auto w-100">
              Gestionar
            </Link>
          </div>
        </div>

        {/* Tarjeta de Centros Educativos */}
        <div className="col-12 col-md-4">
          <div className="card shadow-sm border-0 h-100 p-4 text-center d-flex flex-column">
            <div className="mb-3">
              <span className="fs-1">🏫</span>
            </div>
            <h3 className="h5 fw-bold">Centros Educativos</h3>
            <p className="text-muted small mb-4">
              Añade o actualiza la información del directorio de colegios e institutos.
            </p>
            <Link to="/admin/centros" className="btn btn-dark mt-auto w-100">
              Gestionar
            </Link>
          </div>
        </div>

        {/* Tarjeta de Secciones */}
        <div className="col-12 col-md-4">
          <div className="card shadow-sm border-0 h-100 p-4 text-center d-flex flex-column">
            <div className="mb-3">
              <span className="fs-1">📂</span>
            </div>
            <h3 className="h5 fw-bold">Secciones</h3>
            <p className="text-muted small mb-4">
              Administra las secciones que agrupan a las empresas colaboradoras.
            </p>
            <Link to="/admin/secciones" className="btn btn-dark mt-auto w-100">
              Gestionar
            </Link>
          </div>
        </div>

        {/* Tarjeta de Concejalía de Educación */}
        <div className="col-12 col-md-4">
          <div className="card shadow-sm border-0 h-100 p-4 text-center d-flex flex-column">
            <div className="mb-3">
              <span className="fs-1">🏛️</span>
            </div>
            <h3 className="h5 fw-bold">Concejalía de Educación</h3>
            <p className="text-muted small mb-4">
              Actualiza los datos de contacto, descripción e imagen institucional.
            </p>
            <Link to="/admin/concejalia" className="btn btn-dark mt-auto w-100">
              Gestionar
            </Link>
          </div>
        </div>

        {/* Tarjeta de Criterios de Matriculación */}
        <div className="col-12 col-md-4">
          <div className="card shadow-sm border-0 h-100 p-4 text-center d-flex flex-column">
            <div className="mb-3">
              <span className="fs-1">📋</span>
            </div>
            <h3 className="h5 fw-bold">Criterios de Matriculación</h3>
            <p className="text-muted small mb-4">
              Modifica las directrices y criterios de matriculación publicados en la web.
            </p>
            <Link to="/admin/criterios" className="btn btn-dark mt-auto w-100">
              Gestionar
            </Link>
          </div>
        </div>
        {/* Tarjeta de Calendario de Matriculaciones */}
        <div className="col-12 col-md-4">
          <div className="card shadow-sm border-0 h-100 p-4 text-center d-flex flex-column">
            <div className="mb-3">
              <span className="fs-1">📅</span>
            </div>
            <h3 className="h5 fw-bold">Calendario de Matriculaciones</h3>
            <p className="text-muted small mb-4">
              Gestiona las fechas y plazos de matriculación para los centros educativos.
            </p>
            <Link to="/admin/calendario" className="btn btn-dark mt-auto w-100">
              Gestionar
            </Link>
          </div>
        </div>
        {/* Tarjeta de Ampas */}
        <div className="col-12 col-md-4">
          <div className="card shadow-sm border-0 h-100 p-4 text-center d-flex flex-column">
            <div className="mb-3">
              <span className="fs-1">🤝</span>
            </div>
            <h3 className="h5 fw-bold">Ampas</h3>
            <p className="text-muted small mb-4">
              Administra las ampas y sus respectivas convocatorias.
            </p>
            <Link to="/admin/ampas" className="btn btn-dark mt-auto w-100">
              Gestionar
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;