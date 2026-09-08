import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import imagenPorDefecto from '../../assets/imagenes/sin_imagen.jpg';

function SeccionesLista() {
  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
        Carnet de Socio 
      </h1>

      {/* SECCIÓN 1: VÍDEO Y TEXTO EXPLICATIVO */}
      <div className="row align-items-center justify-content-center mb-5 g-4">
        {/* Columna del Vídeo */}
        <div className="col-12 col-md-5 d-flex justify-content-center">
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', width: '100%', maxWidth: '400px' }}>
            <iframe
              src="https://www.youtube.com/embed/4zq2MX_OWEg"
              title="Carnet de socio AMPAS Elda 2024-2025"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen>
            </iframe>
          </div>
        </div>

        {/* Columna del Texto Explicativo */}
        <div className="col-12 col-md-7">
          <p className="text-muted mb-0">
            La agrupación local de AMPAS y APAS de Elda vamos os presentamos el carnet de soci@s para todas las familias que estén inscritos en la asociación de padres y madres de tu centro educativo público asociado a nuestra agrupación, abarcando escuelas infantiles, primaria, secundaria y educación especial.
            <br /><br />
            Con él, las familias podrán obtener grandes ventajas y descuentos en las empresas y comercios adheridos a esta iniciativa.
            <br /><br />
            Desde la agrupación local de ampas y apas de Elda queremos apoyar a las familias, no solo en lo educativo y formativo, sino en intentar facilitar un poco su día a día.
          </p>
        </div>
      </div>

      {/* SECCIÓN 2: NUEVO CARNET DIGITAL */}
      <div className="row align-items-center justify-content-center mb-5 g-4 py-4 border-top">
        {/* Columna del Texto Explicativo y Enlace */}
        <div className="col-12 col-md-7">
          <h2 className="h4 fw-bold text-uppercase mb-3 text-dark">
            ¡¡¡NUEVO CARNET DIGITAL!!!!
          </h2>
          <p className="text-muted mb-3">
            ¿Cómo puedo conseguir la tarjeta en formato digital? Para conseguirla es realmente sencillo… Solo tienes que apuntarte a tu AMPA y ellos te darán de manera totalmente gratuita de alta.
          </p>
          <div>
            <a
              href="https://carnet.eldaampas.es"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-dark btn-sm px-4 py-2 text-uppercase fw-bold"
            >
              Descárgalo aquí
            </a>
          </div>
        </div>

        {/* Columna del Segundo Vídeo Corregida */}
        <div className="col-12 col-md-5 d-flex justify-content-center">
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', width: '100%', maxWidth: '400px' }}>
            <iframe
              src="https://www.youtube.com/embed/30T15lL3PDI?start=30"
              title="Nuevo Carnet Digital AMPAS Elda"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen>
            </iframe>
          </div>
        </div>
      </div>
      <h1 className="text-center display-5 mb-5 text-uppercase fw-light">
        Categorías de empresas adheridas al carnet de socio
      </h1>

      {/* Cuadrícula de Secciones */}
      <div className="row g-4">
        {secciones.map((seccion) => {
          const idSeccion = seccion.id_seccion || seccion.id;

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