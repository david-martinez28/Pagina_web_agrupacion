import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api';
import imagenPorDefecto from '../../assets/imagenes/sin_imagen.jpg';

function CentroDetalle() {
  const { id } = useParams();
  const [centro, setCentro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const idSeguro = encodeURIComponent(id);

    // La petición a /centros/{id} ya trae la información del centro y su ampa relacionada gracias al with('ampa') del backend
    api.get(`/centros/${idSeguro}`)
      .then((res) => {
        const data = res.data.data ? res.data.data : res.data;
        setCentro(data);
      })
      .catch((err) => {
        console.error("Error al cargar el centro", err);
        setError("No se ha podido encontrar la información del centro educativo.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Función para limpiar y construir la URL segura de las imágenes
  const limpiarRutaImagen = (img) => {
    if (!img) return null;
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    const ruta = String(img).replace(/\\/g, '/').replace(/^\/+/, '').replace(/^storage\//, '');
    return `/storage/${ruta}`;
  };

  if (loading) {
    return (
      <div className="container-xl py-5 text-center">
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3 text-secondary">Cargando información del centro...</p>
      </div>
    );
  }

  if (error || !centro) {
    return (
      <div className="container-xl py-5 text-center">
        <h2 className="text-danger mb-4">¡Vaya!</h2>
        <p>{error}</p>
        <Link to="/" className="btn btn-dark mt-3">Volver al inicio</Link>
      </div>
    );
  }

  const imagenCentro = limpiarRutaImagen(centro.imagen) || imagenPorDefecto;
  // Obtenemos la imagen del ampa asociada o usamos la imagen por defecto si no tiene
  const imagenAmpa = centro.ampa?.imagen ? (limpiarRutaImagen(centro.ampa.imagen) || imagenPorDefecto) : imagenPorDefecto;

  // Función para limpiar y transformar URLs de YouTube al formato embed
  const obtenerUrlEmbed = (url) => {
    if (!url) return '';
    if (url.includes('/embed/')) return url;

    let match = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;

    match = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;

    return url;
  };
  console.log({"ampas": centro.ampa});

  return (
    <section className="container-xl py-5 bg-white">
      <Link to="/" className="text-decoration-none text-secondary mb-4 d-inline-block">
        &larr; Volver al listado
      </Link>

      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <article className="bg-light p-4 p-md-5 rounded shadow-sm border">

            {/* CABECERA */}
            <div className="d-flex flex-column flex-md-row align-items-center mb-5 border-bottom pb-4">
              <div
                className="rounded-circle shadow-sm bg-white d-flex align-items-center justify-content-center mb-4 mb-md-0 me-md-4"
                style={{ width: '150px', height: '150px', overflow: 'hidden', flexShrink: 0 }}
              >
                <img
                  src={imagenCentro}
                  alt={centro.nombre}
                  className="w-100 h-100 object-fit-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = imagenPorDefecto;
                  }}
                />
              </div>

              <div className="text-center text-md-start">
                <h1 className="display-5 mb-2">{centro.nombre}</h1>
                <div className="d-flex gap-2 justify-content-center justify-content-md-start mt-3">
                  {centro.modalidad && (
                    <span className="badge bg-secondary fs-6 p-2">
                      {centro.modalidad}
                    </span>
                  )}
                  {centro.ampa && (
                    <span className="badge bg-dark fs-6 p-2">
                      AMPA: {centro.ampa.nombre}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* CUERPO DEL DETALLE (2 Columnas) */}
            <div className="row px-3">

              {/* Columna Izquierda: Descripción */}
              <div className="col-12 col-md-7 border-end-md pe-md-4 mb-4 mb-md-0">
                <h3 className="h4 mb-3 border-start border-3 border-dark ps-3">Sobre el Centro</h3>
                <p className="text-secondary fs-5 lh-lg mb-4" style={{ whiteSpace: 'pre-line' }}>
                  {centro.descripcion || 'No hay descripción disponible para este centro en este momento.'}
                </p>
              </div>

              {/* Columna Derecha: Datos del Centro y de la AMPA */}
              <div className="col-12 col-md-5 ps-md-4">

                {/* Datos de contacto oficiales del centro */}
                {(centro.direccion || centro.telefono || centro.email || centro.web) && (
                  <div className="bg-white p-3 rounded shadow-sm border mb-4">
                    <h5 className="mb-3 fw-bold">Ubicación y Contacto</h5>
                    <ul className="list-unstyled mb-0">
                      {centro.direccion && (
                        <li className="mb-2 d-flex">
                          <span className="fw-bold me-2">📍 Dirección:</span>
                          <span className="text-secondary">{centro.direccion}</span>
                        </li>
                      )}
                      {centro.telefono && (
                        <li className="mb-2 d-flex">
                          <span className="fw-bold me-2">📞 Teléfono:</span>
                          <a href={`tel:${centro.telefono}`} className="text-decoration-none text-secondary">
                            {centro.telefono}
                          </a>
                        </li>
                      )}
                      {centro.email && (
                        <li className="mb-2 d-flex">
                          <span className="fw-bold me-2">✉️ Email:</span>
                          <a href={`mailto:${centro.email}`} className="text-decoration-none text-secondary text-break">
                            {centro.email}
                          </a>
                        </li>
                      )}
                      {centro.web && (
                        <li className="d-flex">
                          <span className="fw-bold me-2">🌐 Web:</span>
                          <a href={centro.web} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-truncate">
                            {centro.web}
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Datos de la AMPA (Viene directamente relacionada en el JSON del centro) */}
                {centro.ampa ? (
                  <div className="bg-white p-4 rounded shadow-sm border">
                    <h4 className="h5 mb-3 text-uppercase fw-bold text-center border-bottom pb-2">
                      Contacto AMPA
                    </h4>

                    {/* Imagen / Logotipo de la AMPA */}
                    <div className="text-center mb-3">
                      <div 
                        className="rounded-circle shadow-sm bg-light d-flex align-items-center justify-content-center mx-auto border overflow-hidden" 
                        style={{ width: '80px', height: '80px' }}
                      >
                        <img
                          src={imagenAmpa}
                          alt={centro.ampa.nombre}
                          className="w-100 h-100 object-fit-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = imagenPorDefecto;
                          }}
                        />
                      </div>
                    </div>

                    <ul className="list-unstyled mb-0">
                      {centro.ampa.telefono && (
                        <li className="mb-3 d-flex align-items-center">
                          <span className="fw-bold me-2">📞 Teléfono:</span>
                          <a href={`tel:${centro.ampa.telefono}`} className="text-decoration-none text-secondary">
                            {centro.ampa.telefono}
                          </a>
                        </li>
                      )}

                      {centro.ampa.correo && (
                        <li className="mb-3 d-flex align-items-center">
                          <span className="fw-bold me-2">✉️ Email:</span>
                          <a href={`mailto:${centro.ampa.correo}`} className="text-decoration-none text-secondary text-break">
                            {centro.ampa.correo}
                          </a>
                        </li>
                      )}

                      {centro.ampa.instagram && (
                        <li className="mb-3 d-flex align-items-center">
                          <span className="fw-bold me-2">📷 Instagram:</span>
                          <span className="text-secondary">{centro.ampa.instagram}</span>
                        </li>
                      )}

                      {centro.ampa.facebook && (
                        <li className="d-flex align-items-center">
                          <span className="fw-bold me-2">📘 Facebook:</span>
                          <span className="text-secondary">{centro.ampa.facebook}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                ) : (
                  <div className="alert alert-secondary text-center">
                    No hay información de la AMPA para este centro.
                  </div>
                )}
              </div>

              {/* VÍDEO DE PRESENTACIÓN */}
              {centro.video && (
                <div className="col-12 mt-4">
                  <div className="bg-white p-3 rounded shadow-sm border">
                    <h5 className="mb-3 fw-bold">Vídeo de Presentación</h5>
                    <div className="ratio ratio-16x9 rounded overflow-hidden shadow-sm">
                      <iframe
                        title={`Vídeo de ${centro.nombre}`}
                        src={obtenerUrlEmbed(centro.video)}
                        style={{ border: 0 }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                </div>
              )}

              {/* MAPA DE SITUACIÓN */}
              {centro.direccion && (
                <div className="col-12 mt-4">
                  <div className="bg-white p-3 rounded shadow-sm border">
                    <h5 className="mb-3 fw-bold">Mapa de Situación</h5>
                    <div className="ratio ratio-21x9 rounded overflow-hidden shadow-sm">
                      <iframe
                        title={`Mapa de ${centro.nombre}`}
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(centro.direccion)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default CentroDetalle;