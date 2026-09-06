import { useState, useEffect } from 'react';
import api from '../../api';

function ConcejaliaDetalle() {
  const [concejalia, setConcejalia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Asumimos que tienes una ruta /concejalia-educacion en tu API
    api.get('/concejalia-educacion')
      .then((res) => {
        const data = res.data.data ? res.data.data : res.data;
        setConcejalia(data);
      })
      .catch((err) => console.error("Error al cargar la concejalía", err))
      .finally(() => setLoading(false));
  }, []);
  console.log("Datos de la concejalía:", concejalia); // Para depuración
  if (loading) return <div className="text-center py-5">Cargando información...</div>;

  return (
    <section className="container-xl py-5">
      {concejalia ? (
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm">
              {/* Imagen de Portada */}
              <img 
                src={concejalia.imagen} 
                className="card-img-top" 
                alt="Concejalía de Educación"
                style={{ maxHeight: '400px', objectFit: 'cover' }}
              />
              
              <div className="card-body p-4 p-md-5">
                <h1 className="display-6 mb-4">Concejalía de Educación</h1>
                
                <p className="fs-5 text-secondary lh-lg mb-5" style={{ whiteSpace: 'pre-line' }}>
                  {concejalia.descripcion}
                </p>

                {/* Tarjeta de Contacto */}
                <div className="bg-light p-4 rounded border">
                  <h4 className="mb-4">Información de Contacto</h4>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-3">
                      <strong>📍 Dirección:</strong> {concejalia.direccion}
                    </li>
                    <li className="mb-3">
                      <strong>📞 Teléfono:</strong> 
                      <a href={`tel:${concejalia.telefono}`} className="text-decoration-none ms-2">
                        {concejalia.telefono}
                      </a>
                    </li>
                    <li>
                      <strong>✉️ Email:</strong> 
                      <a href={`mailto:${concejalia.gmail}`} className="text-decoration-none ms-2">
                        {concejalia.gmail}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center">No se encontró información de la concejalía.</p>
      )}
    </section>
  );
}

export default ConcejaliaDetalle;