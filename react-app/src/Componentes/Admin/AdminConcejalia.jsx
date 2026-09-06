import { useState, useEffect } from 'react';
import api from '../../api';

function AdminConcejalia() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    direccion: '',
    telefono: '',
    gmail: '',
    descripcion: '',
    imagen: null
  });

  useEffect(() => {
    fetchConcejalia();
  }, []);

  const fetchConcejalia = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/concejalia-educacion');
      const data = res.data.data ? res.data.data : res.data;
      
      if (data) {
        setFormData({
          direccion: data.direccion || '',
          telefono: data.telefono || '',
          gmail: data.gmail || '',
          descripcion: data.descripcion || '',
          imagen: data.imagen || null
        });
      }
    } catch (err) {
      console.error('Error al cargar la concejalía:', err);
      // Si da 404 es porque aún no se ha creado ningún registro, lo dejamos en blanco para crearlo al guardar
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, imagen: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const adminData = JSON.parse(localStorage.getItem('admin_data') || '{}');
      const submitData = new FormData();

      submitData.append('direccion', formData.direccion ? formData.direccion.trim() : '');
      submitData.append('telefono', formData.telefono ? formData.telefono.trim() : '');
      submitData.append('gmail', formData.gmail ? formData.gmail.trim() : '');
      submitData.append('descripcion', formData.descripcion ? formData.descripcion.trim() : '');

      if (adminData.id_administrador) {
        submitData.append('id_administrador', adminData.id_administrador);
      }

      if (formData.imagen instanceof File) {
        submitData.append('imagen', formData.imagen);
      }

      submitData.append('_method', 'PUT');
      await api.post('/concejalia-educacion', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Concejalía de Educación guardada correctamente');
      await fetchConcejalia();
    } catch (err) {
      console.error('Error guardando concejalía:', err);
      if (err.response?.status === 422) {
        const errores = err.response.data.errors;
        let mensajeAlerta = '⚠️ LARAVEL HA RECHAZADO LOS DATOS:\n\n';
        for (const campo in errores) {
          mensajeAlerta += `❌ ${campo}: ${errores[campo][0]}\n`;
        }
        alert(mensajeAlerta);
      } else {
        alert('Error de conexión al guardar la concejalía.');
      }
    } finally {
      setLoading(false);
    }
  };

  const queryMapa = encodeURIComponent(
    `${formData.direccion ? formData.direccion + ',' : ''} Elda, Alicante, España`
  );
  const urlMapaGoogle = `https://maps.google.com/maps?q=${queryMapa}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="container-xl py-5">
      <h1 className="fw-light mb-4">Gestión de la Concejalía de Educación</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm border-0 p-4">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-12 col-md-6 mb-3">
              <label className="form-label fw-bold">Dirección / Sede</label>
              <input
                type="text"
                className="form-control"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                placeholder="Ej: Plaza de la Constitución, 1"
                maxLength="255"
              />
            </div>

            <div className="col-12 col-md-3 mb-3">
              <label className="form-label fw-bold">Teléfono</label>
              <input
                type="text"
                className="form-control"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="Ej: 966980000"
                maxLength="20"
              />
            </div>

            <div className="col-12 col-md-3 mb-3">
              <label className="form-label fw-bold">Correo (Gmail)</label>
              <input
                type="email"
                className="form-control"
                value={formData.gmail}
                onChange={(e) => setFormData({ ...formData, gmail: e.target.value })}
                placeholder="Ej: educacion@elda.es"
                maxLength="150"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold text-secondary small">Vista previa de la ubicación en Google Maps</label>
            <div className="ratio ratio-21x9 shadow-sm rounded overflow-hidden border">
              <iframe
                title="Ubicación Concejalía en Google Maps"
                src={urlMapaGoogle}
                className="border-0 w-100 h-100"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>

          <hr className="my-4 text-muted" />

          <h5 className="mb-3">Imagen / Logotipo Institucional</h5>
          <div className="row">
            <div className="col-12 col-md-6 mb-3">
              <input type="file" accept="image/*" className="form-control" onChange={handleFileChange} />
              {typeof formData.imagen === 'string' && formData.imagen && (
                <div className="form-text text-primary mt-1">Imagen actual guardada. Sube una nueva para reemplazarla.</div>
              )}
            </div>
          </div>

          <hr className="my-4 text-muted" />

          <div className="mb-4">
            <label className="form-label fw-bold">Descripción Institucional</label>
            <textarea
              className="form-control"
              rows="6"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Información sobre las funciones y servicios de la concejalía..."
            ></textarea>
          </div>

          <button type="submit" className="btn btn-dark w-100 py-2 fs-5" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminConcejalia;