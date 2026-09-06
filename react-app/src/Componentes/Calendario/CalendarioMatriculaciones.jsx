import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import imagenPorDefecto from '../../assets/imagenes/sin_imagen.jpg';

function CalendarioMatriculaciones() {
  const [calendarios, setCalendarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/calendarios')
      .then((res) => {
        let data = res.data.data ? res.data.data : res.data;
        setCalendarios(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error('Error cargando calendario de matriculaciones', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-5 text-secondary">Cargando calendario de matriculaciones...</div>;
  }

  return (
    <section className="container-xl py-5 bg-white">
      <Link to="/" className="text-decoration-none text-secondary mb-4 d-inline-block">
        &larr; Volver al inicio
      </Link>

      <h1 className="text-center display-5 mb-5 text-uppercase fw-light">Calendario de Matriculaciones</h1>

      {calendarios.length > 0 ? (
        <div className="row g-5">
          {calendarios.map((cal) => {
            // Como el Resource de Laravel ya devuelve la URL completa, la usamos directamente o caemos en la por defecto
            const imagenUrl = cal.imagen || imagenPorDefecto;

            return (
              <div className="col-12" key={cal.id_calendario}>
                <div className="card border-0 shadow-sm p-4 bg-light">
                  
                  {/* Grado Educativo */}
                  <h3 className="h4 text-dark mb-4 border-start border-3 border-dark ps-2">
                    {cal.grado_educativo}
                  </h3>

                  {/* Imagen ocupando todo el ancho de forma dinámica */}
                  <div className="text-center mb-4 overflow-hidden rounded bg-white border">
                    <img 
                      src={imagenUrl} 
                      alt={cal.grado_educativo} 
                      className="img-fluid w-100" 
                      style={{ 
                        objectFit: 'contain', 
                        width: '100%', 
                        height: 'auto', 
                        maxHeight: 'none' // Permite que se despliegue a su tamaño natural completo
                      }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = imagenPorDefecto;
                      }}
                    />
                  </div>

                  {/* Únicamente el enlace al documento PDF si existe */}
                  {cal.enlace && (
                    <div className="text-center">
                      <a 
                        href={cal.enlace} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-danger btn-lg px-4 shadow-sm"
                      >
                        📄 Descargar / Ver Documento PDF
                      </a>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-muted">No hay calendarios de matriculación disponibles en este momento.</p>
      )}
    </section>
  );
}

export default CalendarioMatriculaciones;