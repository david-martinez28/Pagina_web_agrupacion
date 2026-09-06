import { useState, useEffect } from 'react';
import api from '../../api';

function AdminCriterios() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    preferencias_texto: '',
    desempate_texto: '',
    baremacion_imagen: null
  });

  useEffect(() => {
    fetchCriterios();
  }, []);

  const fetchCriterios = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/criterio-evaluacion');
      let data = res.data.data ? res.data.data : res.data;
      
      // Si la API devuelve un array, cogemos el primer elemento
      const criterioInfo = Array.isArray(data) ? data[0] : data;

      if (criterioInfo) {
        setFormData({
          preferencias_texto: criterioInfo.preferencias_texto || '',
          desempate_texto: criterioInfo.desempate_texto || '',
          baremacion_imagen: criterioInfo.baremacion_imagen || null
        });
      }
    } catch (err) {
      console.error('Error al cargar los criterios de evaluación:', err);
      // Si da 404 es porque aún no se ha creado el registro único, lo dejamos vacío para crearlo al guardar
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, baremacion_imagen: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const adminData = JSON.parse(localStorage.getItem('admin_data') || '{}');
      const submitData = new FormData();

      submitData.append('preferencias_texto', formData.preferencias_texto ? formData.preferencias_texto.trim() : '');
      submitData.append('desempate_texto', formData.desempate_texto ? formData.desempate_texto.trim() : '');

      if (adminData.id_administrador) {
        submitData.append('id_administrador', adminData.id_administrador);
      }

      if (formData.baremacion_imagen instanceof File) {
        submitData.append('baremacion_imagen', formData.baremacion_imagen);
      }

      // Usamos PUT con _method para actualizar o crear el registro único institucional
      submitData.append('_method', 'PUT');
      await api.post('/criterio-evaluacion', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Criterios de evaluación actualizados correctamente');
      await fetchCriterios();
    } catch (err) {
      console.error('Error guardando criterios:', err);
      if (err.response?.status === 422) {
        const errores = err.response.data.errors;
        let mensajeAlerta = '⚠️ LARAVEL HA RECHAZADO LOS DATOS:\n\n';
        for (const campo in errores) {
          mensajeAlerta += `❌ ${campo}: ${errores[campo][0]}\n`;
        }
        alert(mensajeAlerta);
      } else {
        alert('Error de conexión al actualizar los criterios.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Limpiador de ruta de imagen compatible con Caddy
  const limpiarRutaImagen = (img) => {
    if (!img) return null;
    if (img.startsWith('http')) return img;
    return `/storage/${String(img).replace(/\\/g, '').replace(/^\/?(storage\/)?/, '')}`;
  };

  const imagenUrl = typeof formData.baremacion_imagen === 'string' ? limpiarRutaImagen(formData.baremacion_imagen) : null;

  return (
    <div className="container-xl py-5">
      <h1 className="fw-light mb-4">Gestión de Criterios de Evaluación</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm border-0 p-4">
        <form onSubmit={handleSubmit}>
          
          <div className="mb-4">
            <label className="form-label fw-bold">Preferencias / Criterios de Admisión</label>
            <textarea
              className="form-control"
              rows="6"
              value={formData.preferencias_texto}
              onChange={(e) => setFormData({ ...formData, preferencias_texto: e.target.value })}
              placeholder="Redacta las preferencias y baremos aplicados..."
            ></textarea>
          </div>

          <hr className="my-4 text-muted" />

          <h5 className="mb-3">Imagen de Baremación</h5>
          <div className="row mb-4">
            <div className="col-12 col-md-6 mb-2">
              <input type="file" accept="image/*" className="form-control" onChange={handleFileChange} />
              {imagenUrl && (
                <div className="mt-3">
                  <span className="d-block small text-muted mb-2">Imagen actual guardada:</span>
                  <img src={imagenUrl} alt="Baremación" className="img-fluid rounded border" style={{ maxHeight: '150px', objectFit: 'cover' }} />
                </div>
              )}
            </div>
          </div>

          <hr className="my-4 text-muted" />

          <div className="mb-4">
            <label className="form-label fw-bold">Procedimiento de Desempate</label>
            <textarea
              className="form-control"
              rows="6"
              value={formData.desempate_texto}
              onChange={(e) => setFormData({ ...formData, desempate_texto: e.target.value })}
              placeholder="Indica el procedimiento oficial en caso de empate..."
            ></textarea>
          </div>

          <button type="submit" className="btn btn-dark w-100 py-2 fs-5" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Criterios de Evaluación'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminCriterios;