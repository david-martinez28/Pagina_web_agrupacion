
import { useState, useEffect } from 'react';
import api from '../../api';
import imagenPorDefecto from '../../assets/imagenes/sin_imagen.jpg';

function AdminSecciones() {
  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vista, setVista] = useState('lista');

  const [formData, setFormData] = useState({
    id_seccion: '',
    nombre: '',
    imagen: null
  });

  useEffect(() => {
    fetchSecciones();
  }, []);

  const fetchSecciones = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/secciones');
      let data = res.data.data ? res.data.data : res.data;
      setSecciones(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar secciones:', err);
      setError('No se pudieron cargar las secciones.');
    } finally {
      setLoading(false);
    }
  };

  const handleNuevaSeccion = () => {
    setFormData({
      id_seccion: '',
      nombre: '',
      imagen: null
    });
    setVista('formulario');
  };

  const handleEditar = (seccion) => {
    const id = seccion.id_seccion || seccion.id;
    setFormData({
      id_seccion: id,
      nombre: seccion.nombre || '',
      imagen: seccion.imagen || null
    });
    setVista('formulario');
  };

  const handleEliminar = async (seccion) => {
    const id = seccion.id_seccion || seccion.id;
    if (!window.confirm(`¿Estás seguro de eliminar la sección: "${seccion.nombre}"?`)) return;

    try {
      await api.delete(`/secciones/${id}`);
      setSecciones(secciones.filter((s) => (s.id_seccion || s.id) !== id));
      alert('Sección eliminada correctamente');
    } catch (err) {
      console.error('Error eliminando:', err);
      alert('Hubo un error al eliminar la sección');
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

      submitData.append('nombre', formData.nombre.trim());

      if (adminData.id_administrador) {
        submitData.append('id_administrador', adminData.id_administrador);
      }

      if (formData.imagen instanceof File) {
        submitData.append('imagen', formData.imagen);
      }

      if (formData.id_seccion) {
        submitData.append('_method', 'PUT');
        await api.post(`/secciones/${formData.id_seccion}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Sección actualizada correctamente');
      } else {
        await api.post('/secciones', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Sección creada correctamente');
      }

      setVista('lista');
      await fetchSecciones();
    } catch (err) {
      console.error('Error guardando:', err);
      if (err.response?.status === 422) {
        const errores = err.response.data.errors;
        let mensajeAlerta = '⚠️ LARAVEL HA RECHAZADO LOS DATOS:\n\n';
        for (const campo in errores) {
          mensajeAlerta += `❌ ${campo}: ${errores[campo][0]}\n`;
        }
        alert(mensajeAlerta);
      } else {
        alert('Error de conexión al guardar la sección.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (vista === 'formulario') {
    return (
      <div className="container-xl py-5">
        <button className="btn btn-outline-secondary mb-4" onClick={() => setVista('lista')}>
          &larr; Volver a la lista
        </button>

        <div className="card shadow-sm border-0 p-4">
          <h2 className="mb-4">{formData.id_seccion ? 'Editar Sección' : 'Crear Nueva Sección'}</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">Nombre de la Sección</label>
              <input
                type="text"
                className="form-control"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                maxLength="100"
                required
              />
            </div>

            <hr className="my-4 text-muted" />

            <h5 className="mb-3">Imagen de la Sección</h5>
            <div className="row">
              <div className="col-12 col-md-6 mb-3">
                <input type="file" accept="image/*" className="form-control" onChange={handleFileChange} />
                {typeof formData.imagen === 'string' && formData.imagen && (
                  <div className="form-text text-primary mt-1">Imagen actual guardada. Sube una nueva para reemplazarla.</div>
                )}
              </div>
            </div>

            <button type="submit" className="btn btn-dark w-100 py-2 fs-5 mt-3" disabled={loading}>
              {loading ? 'Guardando...' : formData.id_seccion ? 'Actualizar Sección' : 'Crear Sección'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container-xl py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <h1 className="fw-light m-0">Gestión de Secciones</h1>
        <button className="btn btn-dark" onClick={handleNuevaSeccion}>
          + Nueva Sección
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm border-0 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Imagen</th>
                <th>Nombre de la Sección</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="3" className="text-center py-4">Cargando...</td></tr>
              ) : secciones.length === 0 ? (
                <tr><td colSpan="3" className="text-center py-4 text-muted">No hay secciones registradas.</td></tr>
              ) : (
                secciones.map((seccion, idx) => {
                  const idSeccion = seccion.id_seccion || seccion.id;
                  const limpiarRutaImagen = (img) => {
                    if (!img) return null;
                    if (img.startsWith('http')) return img;
                    return `/storage/${String(img).replace(/\\/g, '').replace(/^\/?(storage\/)?/, '')}`;
                  };
                  const imagenUrl = limpiarRutaImagen(seccion.imagen) || imagenPorDefecto;

                  return (
                    <tr key={idSeccion}>
                      <td style={{ width: '80px' }}>
                        <img
                          src={imagenUrl}
                          alt={seccion.nombre}
                          className="img-fluid rounded shadow-sm"
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                          onError={(e) => { e.currentTarget.src = imagenPorDefecto; }}
                        />
                      </td>
                      <td>
                        <span className="fw-bold">{seccion.nombre}</span>
                      </td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditar(seccion)}>Editar</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleEliminar(seccion)}>Eliminar</button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminSecciones;