import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import imagenPorDefecto from '../../assets/imagenes/sin_imagen.jpg';

function SeccionesLista() {
  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 👈 Llamada directa al endpoint de secciones que ya creamos y protegimos
    api.get('/secciones')
      .then((res) => {
        let data = res.data.data ? res.data.data : res.data;
        if (!Array.isArray(data)) {
          data = [];
        }
        setSecciones(data);
      })
      .catch((err) => {
        console.error("Error al cargar secciones", err);
        setError("No se han podido cargar las secciones.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container-xl py-5 text-center">
        <div className="spinner-border text-secondary" role="status"></div>
        <p className="mt-3 text-secondary">Cargando secciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-xl py-5 text-center">
        <h2 className="text-danger mb-4">¡Vaya!</h2>
        <p>{error}</p>
        <Link to="/" className="btn btn-dark mt-3">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <section className="container-xl py-5 bg-white">
      <Link to="/" className="text-decoration-none text-secondary mb-4 d-inline-block">
        &larr; Volver al inicio
      </Link>

      <h1 className="text-center display-5 mb-5 text-uppercase fw-light">
        Carnet de Socio - Secciones
      </h1>

      {/* Cuadrícula de 4 elementos por fila (col-lg-3) */}
      <div className="row g-4">
        {secciones.map((seccion) => {
          const idSeccion = seccion.id_seccion || seccion.id;

          // Función limpiadora de rutas compatible con Caddy
          const limpiarRutaImagen = (img) => {
            if (!img) return null;
            if (img.startsWith('http')) return img;
            const rutaLimpia = String(img).replace(/\\/g, '').replace(/^\/?(storage\/)?/, '');
            return `/storage/${rutaLimpia}`;
          };

          const imagenSeccionUrl = limpiarRutaImagen(seccion.imagen) || imagenPorDefecto;

          return (
            <div key={idSeccion} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <Link to={`/secciones/${idSeccion}`} className="text-decoration-none text-dark h-100 d-block">
                <article className="card h-100 border-0 shadow-sm bg-light text-center p-4">
                  <div 
                    className="rounded-circle shadow-sm bg-white d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ width: '90px', height: '90px', overflow: 'hidden' }}
                  >
                    <img 
                      src={imagenSeccionUrl} 
                      alt={seccion.nombre} 
                      className="w-100 h-100 object-fit-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = imagenPorDefecto;
                      }}
                    />
                  </div>
                  <h3 className="h6 fw-bold mb-2 text-uppercase">{seccion.nombre}</h3>
                  <small className="text-muted">Ver empresas</small>
                </article>
              </Link>
            </div>
          );
        })}
      </div>

      {secciones.length === 0 && (
        <p className="text-center text-muted">No hay secciones disponibles actualmente.</p>
      )}
    </section>
  );
}

export default SeccionesLista;