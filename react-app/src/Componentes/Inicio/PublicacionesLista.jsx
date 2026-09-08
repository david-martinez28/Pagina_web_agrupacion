import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import './Publicaciones.css';
import imagenPorDefecto from '../../assets/imagenes/sin_imagen.jpg';
import imagenConvenio from '../../assets/imagenes/ENTIDAD-CONVENIADA.jpg';
import imagenCarnet from '../../assets/imagenes/carnet-socio.jpeg';
import imagenEducacion from '../../assets/imagenes/logo-ampas-conectadas.png';

// ============================================================
// FORMATEAR FECHA Y HORA
// ============================================================
const formatearFechaHora = (fechaString) => {
  if (!fechaString) return '';

  const fecha = new Date(fechaString);

  if (isNaN(fecha.getTime())) return '';

  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();
  const horas = String(fecha.getHours()).padStart(2, '0');
  const minutos = String(fecha.getMinutes()).padStart(2, '0');

  return `${dia}/${mes}/${anio} a las ${horas}:${minutos}`;
};

// ============================================================
// COMPROBAR SI LA NOTICIA TIENE 30 DÍAS O MENOS
// ============================================================
const esNovedad = (fechaString) => {
  if (!fechaString) return false;

  const fechaPublicacion = new Date(fechaString);
  const ahora = new Date();

  if (isNaN(fechaPublicacion.getTime())) {
    return false;
  }

  const diferenciaMs = ahora - fechaPublicacion;
  const treintaDiasMs = 30 * 24 * 60 * 60 * 1000;

  return (
    diferenciaMs >= 0 &&
    diferenciaMs <= treintaDiasMs
  );
};

// ============================================================
// LIMPIAR RUTA DE IMAGEN
// ============================================================
const limpiarRutaImagen = (img) => {
  if (!img) return null;

  if (img.startsWith('http')) {
    return img;
  }

  const rutaLimpia = String(img)
    .replace(/\\/g, '')
    .replace(/^\/?(storage\/)?/, '');

  return `/storage/${rutaLimpia}`;
};

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
function PublicacionesLista() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [centros, setCentros] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const [isDesktop, setIsDesktop] = useState(
    window.innerWidth >= 992
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 992);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    api.get('/noticias')
      .then((res) => {
        let data = res.data.data
          ? res.data.data
          : res.data;

        if (!Array.isArray(data)) {
          data = [];
        }

        const hoy = new Date();
        hoy.setHours(23, 59, 59, 999);

        data = data.filter((pub) => {
          if (!pub.visibilidad) return false;
          if (!pub.fecha_publicacion) return true;

          const fechaPub = new Date(pub.fecha_publicacion);
          return fechaPub <= hoy;
        });

        data.sort((a, b) => {
          const fechaA = new Date(
            a.fecha_publicacion || 0
          );
          const fechaB = new Date(
            b.fecha_publicacion || 0
          );
          return fechaB - fechaA;
        });

        setPublicaciones(data);
        setCurrentIndex(0);
      })
      .catch((err) => {
        console.error('Error cargando noticias', err);
      })
      .finally(() => {
        setLoading(false);
      });

    api.get('/centros')
      .then((res) => {
        let centrosData = res.data.data
          ? res.data.data
          : res.data;

        if (!Array.isArray(centrosData)) {
          centrosData = [];
        }

        setCentros(centrosData);
      })
      .catch((err) => {
        console.error('Error cargando centros', err);
      });

  }, []);

  const handleNext = () => {
    if (publicaciones.length === 0) return;

    setCurrentIndex((prev) => {
      const maxIndex = isDesktop ? Math.max(0, publicaciones.length - 4) : publicaciones.length - 1;
      return prev + 1 > maxIndex ? maxIndex : prev + 1;
    });
  };

  const handlePrev = () => {
    if (publicaciones.length === 0) return;

    setCurrentIndex((prev) => {
      return prev - 1 < 0 ? 0 : prev - 1;
    });
  };

  // Animación automática cada 5 segundos con bucle al llegar al final
  useEffect(() => {
    if (
      isPaused ||
      publicaciones.length <= 1
    ) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = isDesktop ? Math.max(0, publicaciones.length - 4) : publicaciones.length - 1;
        return prev + 1 > maxIndex ? 0 : prev + 1;
      });
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [
    isPaused,
    publicaciones.length,
    isDesktop
  ]);

  const [, setAhora] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setAhora(new Date());
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  let publicacionesVisibles = [];

  if (publicaciones.length > 0) {
    if (isDesktop) {
      const cantidadNoticias = Math.min(
        4,
        publicaciones.length
      );

      for (let i = 0; i < cantidadNoticias; i++) {
        const posicion =
          (currentIndex + i) %
          publicaciones.length;

        publicacionesVisibles.push(
          publicaciones[posicion]
        );
      }
    } else {
      publicacionesVisibles = [
        publicaciones[currentIndex]
      ];
    }
  }

  // Comprobaciones para mostrar u ocultar las flechas de navegación
  const maxIndex = isDesktop ? Math.max(0, publicaciones.length - 4) : publicaciones.length - 1;
  const mostrarFlechaIzq = currentIndex > 0;
  const mostrarFlechaDer = currentIndex < maxIndex;

  if (loading) {
    return (
      <p className="text-center p-5 text-secondary">
        Cargando información...
      </p>
    );
  }

  return (
    <section
      className="container-xl py-5 publicaciones-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >

      {/* ======================================================
          TÍTULO PRINCIPAL
      ====================================================== */}
      <h1 className="text-center mb-5">
        Agrupación de Ampas de Elda
      </h1>

      {/* ======================================================
          BANNERS SUPERIORES (ALTURA UNIFORME CON SOMBRA)
      ====================================================== */}
      <div className="row g-4 mb-5 justify-content-center align-items-stretch">

        {/* BANNER 1 */}
        <div className="col-12 col-md-6 d-flex">
          <Link
            to="/secciones"
            className="text-decoration-none w-100 d-flex"
          >
            <div className="card border-0 shadow-sm overflow-hidden position-relative text-white banner-card w-100 d-flex flex-column card-seccion">

              <img
                src={imagenCarnet}
                alt="Carnet de Socio y Ventajas"
                className="w-100"
                style={{
                  height: '200px',
                  objectFit: 'contain',
                  backgroundColor: '#ffffff'
                }}
              />

              <div className="p-3 bg-dark bg-opacity-75 flex-grow-1 d-flex flex-column justify-content-center">
                <h3 className="h5 mb-1 text-white text-uppercase">
                  Carnet de Socia/o
                </h3>
                <p className="mb-0 small text-light">
                  Haz clic aquí para ver las secciones y empresas colaboradoras.
                </p>
              </div>

            </div>
          </Link>
        </div>

        {/* BANNER 2 */}
        <div className="col-12 col-md-6 d-flex">
          <Link
            to="https://elda.ampasconectadas.com/landing"
            className="text-decoration-none w-100 d-flex"
          >
            <div className="card border-0 shadow-sm overflow-hidden position-relative text-white banner-card w-100 d-flex flex-column card-seccion">

              <img
                src={imagenEducacion}
                alt="Información Institucional"
                className="w-100"
                style={{
                  height: '200px',
                  objectFit: 'contain',
                  backgroundColor: '#ffffff'
                }}
              />

              <div className="p-3 bg-dark bg-opacity-75 flex-grow-1 d-flex flex-column justify-content-center">
                <h3 className="h5 mb-1 text-white text-uppercase">
                  Ampas Conectadas
                </h3>
                <p className="mb-0 small text-light">
                  Desde aquí podrás apuntarte a tu AMPA, inscribirte a las extraescolares, hacer pagos y gestiones administrativas
                </p>
              </div>

            </div>
          </Link>
        </div>

      </div>

      {/* ======================================================
          TÍTULO NOTICIAS
      ====================================================== */}
      <h2 className="fw-light text-uppercase mb-4 text-center seccion-titulo">
        Noticias
      </h2>

      {/* ======================================================
          CARRUSEL DE NOTICIAS
      ====================================================== */}
      <div className="position-relative d-flex align-items-center justify-content-center px-4 px-md-5">

        {mostrarFlechaIzq && (
          <button
            type="button"
            onClick={handlePrev}
            className="btn position-absolute start-0 nav-arrow z-3"
            aria-label="Anterior"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              width="40"
              height="40"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
        )}

        <div className="row g-4 w-100 flex-grow-1 noticias-carrusel">

          {publicacionesVisibles.map((pub) => {

            const imagenUrl =
              pub.imagen_url ||
              limpiarRutaImagen(pub.imagen) ||
              imagenPorDefecto;

            const esNoticiaNueva =
              esNovedad(
                pub.fecha_publicacion
              );

            return (
              <div
                className="col-12 col-md-6 col-lg-3 d-flex"
                key={pub.id_publicacion}
              >

                <article className="card h-100 border rounded-0 shadow-sm w-100 publicacion-card card-seccion">

                  <div
                    className="img-container position-relative bg-light d-flex align-items-center justify-content-center"
                    style={{
                      height: '200px',
                      overflow: 'hidden'
                    }}
                  >

                    <img
                      src={imagenUrl}
                      alt={pub.titulo}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          imagenPorDefecto;
                      }}
                    />

                    {esNoticiaNueva && (
                      <span
                        className="badge bg-danger position-absolute top-0 start-0 m-3 p-2 shadow-sm"
                        style={{
                          fontSize: '0.8rem',
                          letterSpacing: '1px',
                          zIndex: 10
                        }}
                      >
                        NUEVO
                      </span>
                    )}

                  </div>

                  <div className="card-body d-flex flex-column p-4">

                    <h5
                      className="card-title fw-normal mb-2"
                      title={pub.titulo}
                    >
                      {pub.titulo}
                    </h5>

                    {pub.role && (
                      <small className="mb-2 text-danger text-uppercase fw-bold">
                        {pub.role}
                      </small>
                    )}

                    <small className="text-muted mb-3 d-block">
                      {formatearFechaHora(
                        pub.fecha_publicacion
                      )}
                    </small>

                    <p className="card-text text-secondary mb-4 text-clamp-3 desc-text">
                      {pub.descripcion}
                    </p>

                    <Link
                      to={`/noticias/${pub.id_publicacion}`}
                      className="mt-auto text-decoration-none text-secondary btn-leer-mas"
                    >
                      Leer más
                    </Link>

                  </div>

                </article>

              </div>
            );
          })}

        </div>

        {mostrarFlechaDer && (
          <button
            type="button"
            onClick={handleNext}
            className="btn position-absolute end-0 nav-arrow z-3"
            aria-label="Siguiente"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              width="40"
              height="40"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        )}

      </div>

      {/* ======================================================
          CENTROS EDUCATIVOS (CARRUSEL INFINITO)
      ====================================================== */}
      <div className="mt-5 pt-4 mb-5 pb-5 border-top">

        <h3 className="fw-light text-uppercase mb-4 text-center">
          Centros Educativos
        </h3>

        {centros.length > 0 ? (
          <div className="overflow-hidden position-relative w-100 py-4 centros-marquee-container">
            <div className="d-flex align-items-center centros-marquee-track">
              {/* Duplicamos el array de centros para lograr el efecto infinito sin saltos */}
              {[...centros, ...centros].map((centro, index) => {
                const idCentro = centro.id_centro || centro.id;
                const centroImagenUrl = limpiarRutaImagen(centro.imagen) || imagenPorDefecto;

                return (
                  <div
                    key={`${idCentro}-${index}`}
                    className="text-center d-flex flex-column align-items-center mx-4 px-2 flex-shrink-0"
                    style={{ width: '150px' }}
                  >
                    <Link
                      to={`/centros/${idCentro}`}
                      className="text-decoration-none text-dark w-100"
                    >
                      <div
                        className="rounded-circle shadow-sm d-flex align-items-center justify-content-center mb-3 bg-light overflow-hidden mx-auto border card-seccion"
                        style={{
                          width: '80px',
                          height: '80px'
                        }}
                      >
                        <img
                          src={centroImagenUrl}
                          alt={centro.nombre}
                          className="w-100 h-100"
                          style={{ objectFit: 'cover' }}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = imagenPorDefecto;
                          }}
                        />
                      </div>
                      <span
                        className="text-muted small fw-medium text-uppercase d-block mt-2 w-100 px-1"
                        style={{
                          letterSpacing: '0.5px',
                          lineHeight: '1.2'
                        }}
                        title={centro.nombre}
                      >
                        {centro.nombre}
                      </span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-muted text-center small">
            No hay centros educativos registrados.
          </p>
        )}

      </div>

    </section>
  );
}

export default PublicacionesLista;