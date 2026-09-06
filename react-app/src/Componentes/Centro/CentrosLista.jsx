import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import imagenPorDefecto from '../../assets/imagenes/sin_imagen.jpg'; // ⚠️ Ajusta esta ruta si es necesario

function CentrosLista() {
  const [centros, setCentros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/centros')
      .then((res) => {
        let data = res.data.data ? res.data.data : res.data;
        if (!Array.isArray(data)) {
          data = [];
        }
        setCentros(data);
      })
      .catch((err) => {
        console.error("Error cargando centros", err);
        setError("No se ha podido cargar la lista de centros educativos.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container-xl py-5 text-center">
        <div className="spinner-border text-secondary" role="status"></div>
        <p className="mt-3 text-secondary">Cargando centros educativos...</p>
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

  // Agrupamos los centros por su modalidad
  const centrosAgrupados = centros.reduce((grupos, centro) => {
    const modalidad = centro.modalidad || 'Otros';
    
    if (!grupos[modalidad]) {
      grupos[modalidad] = [];
    }
    grupos[modalidad].push(centro);
    
    return grupos;
  }, {});

  return (
    <section className="container-xl py-5 bg-white">
      <Link to="/" className="text-decoration-none text-secondary mb-4 d-inline-block">
        &larr; Volver al inicio
      </Link>

      <h1 className="text-center display-5 mb-5 text-uppercase fw-light">
        Directorio de Centros
      </h1>

      {Object.entries(centrosAgrupados).map(([modalidad, listaCentros]) => (
        <div key={modalidad} className="mb-5 pb-4">
          <h2 className="h3 mb-4 border-bottom pb-2 border-2 border-dark d-inline-block">
            Modalidad {modalidad}
          </h2>
          
          <div className="row g-4">
            {listaCentros.map((centro) => {
              const idCentro = centro.id_centro || centro.id;

              // Limpieza y construcción segura de la URL de la imagen para Caddy
              const limpiarRutaImagen = (img) => {
                if (!img) return null;
                if (img.startsWith('http')) return img;
                const rutaLimpia = String(img).replace(/\\/g, '').replace(/^\/?(storage\/)?/, '');
                return `/storage/${rutaLimpia}`;
              };

              const centroImagenUrl = limpiarRutaImagen(centro.imagen) || imagenPorDefecto;

              return (
                <div key={idCentro} className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <Link to={`/centros/${idCentro}`} className="text-decoration-none text-dark d-block h-100">
                    <article className="card h-100 border-0 shadow-sm bg-light text-center p-4 transition-hover">
                      <div 
                        className="rounded-circle shadow-sm bg-white d-flex align-items-center justify-content-center mx-auto mb-3"
                        style={{ width: '90px', height: '90px', overflow: 'hidden' }}
                      >
                        <img 
                          src={centroImagenUrl} 
                          alt={centro.nombre} 
                          className="w-100 h-100 object-fit-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = imagenPorDefecto; // 👈 Fallback local si falla la ruta del servidor
                          }}
                        />
                      </div>
                      <h3 className="h6 fw-bold mb-2 text-uppercase">{centro.nombre}</h3>
                      {centro.ampa && (
                        <small className="text-muted d-block mt-auto">
                          {centro.ampa.nombre}
                        </small>
                      )}
                    </article>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {centros.length === 0 && (
        <p className="text-center text-muted">No hay centros registrados en este momento.</p>
      )}
    </section>
  );
}

export default CentrosLista;