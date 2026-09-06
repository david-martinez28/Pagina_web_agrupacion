import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api';
import imagenPorDefecto from '../../assets/imagenes/sin_imagen.jpg';

function EmpresasPorSeccion() {
  const { id } = useParams();
  const [empresas, setEmpresas] = useState([]);
  const [nombreSeccion, setNombreSeccion] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const idSeguro = encodeURIComponent(id);

    api.get(`/secciones/${idSeguro}`)
      .then((res) => {
        let seccion = res.data.data ? res.data.data : res.data;

        setNombreSeccion(seccion.nombre || '');
        
        if (seccion.empresas && Array.isArray(seccion.empresas)) {
          setEmpresas(seccion.empresas);
        } else {
          setEmpresas([]);
        }
      })
      .catch((err) => {
        console.error("Error cargando la sección", err);
        setError("No se han podido cargar las empresas de esta sección.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // 🛠️ Función auxiliar para formatear correctamente la URL de la imagen
  const obtenerUrlImagen = (imagen) => {
    if (!imagen) return imagenPorDefecto;
    // Si ya es una URL completa (http:// o https://) la devolvemos tal cual
    if (imagen.startsWith('http://') || imagen.startsWith('https://')) {
      return imagen;
    }
    // Si es una ruta relativa de storage, la unimos al servidor local de Laravel
    // Cambia 'http://localhost:8000' por la URL base de tu API si es diferente
    const baseUrl = api.defaults.baseURL ? api.defaults.baseURL.replace('/api', '') : 'http://localhost';
    return `${baseUrl}/storage/${imagen.startsWith('/') ? imagen.slice(1) : imagen}`;
  };

  if (loading) {
    return (
      <div className="container-xl py-5 text-center">
        <div className="spinner-border text-secondary" role="status"></div>
        <p className="mt-3 text-secondary">Cargando empresas asociadas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-xl py-5 text-center">
        <h2 className="text-danger mb-4">¡Vaya!</h2>
        <p>{error}</p>
        <Link to="/secciones" className="btn btn-dark mt-3">Volver a secciones</Link>
      </div>
    );
  }

  return (
    <section className="container-xl py-5 bg-white">
      <Link to="/secciones" className="text-decoration-none text-secondary mb-4 d-inline-block">
        &larr; Volver a secciones
      </Link>

      <h1 className="text-center display-5 mb-5 text-uppercase fw-light">
        {nombreSeccion ? `Empresas de: ${nombreSeccion}` : 'Empresas de la Sección'}
      </h1>

      <div className="row g-4">
        {empresas.map((empresa) => {
          const idEmpresa = empresa.id_empresa || empresa.id;
          const imagenEmpresa = obtenerUrlImagen(empresa.imagen);
          
          const queryMapa = encodeURIComponent(
            `${empresa.direccion ? empresa.direccion + ',' : ''} ${empresa.nombre || 'Elda'}, Alicante, España`
          );
          const urlMapaGoogle = `https://maps.google.com/maps?q=${queryMapa}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

          return (
            <div key={idEmpresa} className="col-12 col-md-6 col-lg-4">
              <article className="card h-100 border shadow-sm bg-light p-4 d-flex flex-column">
                
                {/* Imagen de la empresa */}
                <div 
                  className="rounded shadow-sm bg-white mb-3 overflow-hidden align-self-center"
                  style={{ width: '100%', height: '180px' }}
                >
                  <img
                    src={imagenEmpresa}
                    alt={empresa.nombre}
                    className="w-100 h-100 object-fit-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null; 
                      e.currentTarget.src = imagenPorDefecto;
                    }}
                  />
                </div>

                <h3 className="h4 fw-bold mb-3 text-dark">{empresa.nombre}</h3>
                
                {empresa.ofertas && (
                  <div className="alert alert-success border-0 shadow-sm mb-3">
                    <strong>🎁 Oferta / Descuento:</strong> <span className="text-dark">{empresa.ofertas}</span>
                  </div>
                )}

                {empresa.condiciones && (
                  <div className="alert alert-secondary border-0 shadow-sm mb-3">
                    <strong>📝 Condiciones:</strong> <span className="text-dark">{empresa.condiciones}</span>
                  </div>
                )}

                <div className="pt-3 border-top border-2 mb-3 mt-auto">
                  {empresa.telefono && <p className="mb-2"><strong>📞 Teléfono:</strong> <a href={`tel:${empresa.telefono}`} className="text-decoration-none text-secondary">{empresa.telefono}</a></p>}
                  {empresa.email && <p className="mb-2"><strong>✉️ Email:</strong> <a href={`mailto:${empresa.email}`} className="text-decoration-none text-secondary">{empresa.email}</a></p>}
                  {empresa.direccion && (
                    <p className="mb-2">
                      <strong>📍 Dirección:</strong>{' '}
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(empresa.direccion)}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-decoration-none text-dark fw-medium"
                      >
                        {empresa.direccion} ↗
                      </a>
                    </p>
                  )}
                  {empresa.instagram && <p className="mb-2"><strong>📸 Instagram:</strong> <span className="text-secondary">{empresa.instagram}</span></p>}
                  {empresa.facebook && <p className="mb-0"><strong>📘 Facebook:</strong> <span className="text-secondary">{empresa.facebook}</span></p>} 
                </div>

                {empresa.direccion && (
                  <div className="mt-2">
                    <label className="form-label fw-bold text-secondary small">Ubicación de la empresa</label>
                    <div className="ratio ratio-16x9 shadow-sm rounded overflow-hidden border">
                      <iframe
                        title={`Mapa de ${empresa.nombre}`}
                        src={urlMapaGoogle}
                        className="border-0 w-100 h-100"
                        allowFullScreen=""
                        loading="lazy"
                      ></iframe>
                    </div>
                  </div>
                )}
              </article>
            </div>
          );
        })}
      </div>

      {empresas.length === 0 && (
        <div className="text-center py-5">
          <p className="text-muted">No hay empresas registradas en esta sección todavía.</p>
        </div>
      )}
    </section>
  );
}

export default EmpresasPorSeccion;