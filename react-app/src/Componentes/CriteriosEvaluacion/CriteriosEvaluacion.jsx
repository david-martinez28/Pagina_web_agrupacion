import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

function CriteriosEvaluacion() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/criterio-evaluacion')
      .then((res) => {
        const criterioData = res.data.data ? res.data.data : res.data;
        setData(criterioData);
      })
      .catch((err) => console.error("Error cargando criterios", err))
      .finally(() => setLoading(false));
  }, []);

  // Función limpiadora de rutas de imagen compatible con Caddy y storage
  const limpiarRutaImagen = (img) => {
    if (!img) return null;
    if (img.startsWith('http')) return img;
    const rutaLimpia = String(img).replace(/\\/g, '').replace(/^\/?(storage\/)?/, '');
    return `/storage/${rutaLimpia}`;
  };

  if (loading) return <div className="text-center py-5">Cargando criterios...</div>;

  const imagenBaremacionUrl = data ? limpiarRutaImagen(data.baremacion_imagen) : null;

  return (
    <section className="container-xl py-5 bg-white">
      <Link to="/" className="text-decoration-none text-secondary mb-4 d-inline-block">
        &larr; Volver al inicio
      </Link>

      <h1 className="text-center display-5 mb-5 text-uppercase fw-light">Criterios de Evaluación</h1>
      
      {data ? (
        <div className="row g-4">
          <div className="col-12 col-md-6">
            <div className="card h-100 border-0 shadow-sm p-4 bg-light">
              <h3 className="h4 text-dark mb-3 border-start border-3 border-dark ps-2">Preferencias</h3>
              <p className="text-secondary" style={{ whiteSpace: 'pre-line' }}>
                {data.preferencias_texto || 'No hay información de preferencias.'}
              </p>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="card h-100 border-0 shadow-sm p-4 bg-light">
              <h3 className="h4 text-dark mb-3 border-start border-3 border-dark ps-2">Desempate</h3>
              <p className="text-secondary" style={{ whiteSpace: 'pre-line' }}>
                {data.desempate_texto || 'No hay procedimiento de desempate registrado.'}
              </p>
            </div>
          </div>

          {imagenBaremacionUrl && (
            <div className="col-12">
              <div className="card border-0 shadow-sm p-4 bg-light text-center">
                <h3 className="h4 text-dark mb-3">Baremación</h3>
                <img 
                  src={imagenBaremacionUrl} 
                  alt="Baremación" 
                  className="img-fluid rounded shadow-sm w-100" 
                  style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-muted">No hay criterios de evaluación disponibles en este momento.</p>
      )}
    </section>
  );
}

export default CriteriosEvaluacion;