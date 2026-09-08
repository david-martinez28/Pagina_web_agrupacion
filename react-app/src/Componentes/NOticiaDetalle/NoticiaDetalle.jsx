import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api';
import imagenPorDefecto from '../../assets/imagenes/sin_imagen.jpg';

// Función para formatear la fecha y hora a DD/MM/YYYY a las HH:mm
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

// Función para transformar URLs de YouTube a formato Embed
const obtenerUrlEmbedYoutube = (url) => {
  if (!url) return '';
  if (url.includes('/embed/')) return url;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
};

function NoticiaDetalle() {
  const { id } = useParams();
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api.get(`/noticias/${id}`)
      .then((res) => {
        if (isMounted) {
          const data = res.data.data || res.data;
          if (!data || !data.titulo) {
            setError('No se ha encontrado la información de esta noticia.');
          } else {
            setNoticia(data);
            setError(null);
          }
        }
      })
      .catch(() => {
        if (isMounted) setError('No se ha podido cargar la información de la noticia.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [id]);

  if (loading) return <p className="text-center p-5 text-secondary">Cargando detalles de la noticia...</p>;
  
  if (error || !noticia || !noticia.titulo) {
    return (
      <div className="container py-5 text-center">
        <h2 className="text-danger mb-3">¡Vaya!</h2>
        <p className="text-secondary">{error || 'La noticia solicitada no existe o ha sido eliminada.'}</p>
        <Link to="/" className="btn btn-dark mt-3 rounded-0">Volver al inicio</Link>
      </div>
    );
  }

  // Limpieza y construcción segura de la URL de la imagen para Caddy
  const limpiarRutaImagen = (img) => {
    if (!img) return null;
    if (img.startsWith('http')) return img;
    const rutaLimpia = String(img).replace(/\\/g, '').replace(/^\/?(storage\/)?/, '');
    return `/storage/${rutaLimpia}`;
  };

  const imagenUrl = noticia.imagen_url || limpiarRutaImagen(noticia.imagen) || imagenPorDefecto;

  return (
    <main className="container py-5" style={{ maxWidth: '800px', fontFamily: 'sans-serif' }}>
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link to="/" className="text-decoration-none text-muted">
          &larr; Volver a noticias
        </Link>

        {noticia.role && (
          <span className="badge bg-danger text-uppercase" style={{ letterSpacing: '1px' }}>
            {noticia.role}
          </span>
        )}
      </div>

      <h1 className="fw-bold mb-3" style={{ color: '#222', fontSize: '2.2rem' }}>
        {noticia.titulo}
      </h1>

      <div className="text-muted mb-4 pb-3 border-bottom d-flex justify-content-between align-items-center">
        <span>Publicado el {formatearFechaHora(noticia.fecha_publicacion)}</span>
      </div>

      {/* CONTENEDOR DE LA IMAGEN (SIN RECORTES) */}
      <div className="mb-4 shadow-sm bg-light text-center rounded overflow-hidden d-flex align-items-center justify-content-center p-2" style={{ maxHeight: '500px' }}>
        <img 
          src={imagenUrl} 
          alt={noticia.titulo} 
          className="img-fluid"
          style={{ 
            maxHeight: '480px', 
            width: '100%', 
            objectFit: 'contain' // 👈 Evita recortes y muestra la imagen completa
          }}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = imagenPorDefecto;
          }}
        />
      </div>

      {/* DESCRIPCIÓN */}
      <div 
        className="text-secondary lh-lg mb-5" 
        style={{ fontSize: '1.05rem', whiteSpace: 'pre-line' }}
      >
        {noticia.descripcion}
      </div>

      {/* REPRODUCTOR DE VÍDEO (SI EXISTE) */}
      {noticia.video && (
        <div className="mb-5">
          <h4 className="fw-bold mb-3 text-dark" style={{ fontSize: '1.3rem' }}>Vídeo relacionado</h4>
          <div className="ratio ratio-16x9 shadow-sm rounded overflow-hidden bg-light">
            <iframe
              src={obtenerUrlEmbedYoutube(noticia.video)}
              title="Vídeo de la noticia"
              allowFullScreen
              className="border-0"
            ></iframe>
          </div>
        </div>
      )}

      {/* BOTONES DE ENLACE Y PDF */}
      <div className="d-flex justify-content-between gap-3">
        {noticia.enlace && (
          <a href={noticia.enlace} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark rounded-0">
            Enlace de interés
          </a>
        )}
        {noticia.pdf_descarga && (
          <a 
            href={noticia.pdf_descarga.startsWith('http') ? noticia.pdf_descarga : `/storage/${noticia.pdf_descarga.replace(/^\/+/, '')}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            download
            className="btn btn-danger rounded-0"
          >
            Descargar PDF
          </a>
        )}
      </div>

    </main>
  );
}

export default NoticiaDetalle;