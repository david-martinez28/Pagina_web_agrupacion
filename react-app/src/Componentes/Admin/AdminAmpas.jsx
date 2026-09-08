import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

function AdminAmpas() {
  const [ampas, setAmpas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [busqueda, setBusqueda] = useState('');

  // Estados del formulario y visibilidad
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    instagram: '',
    facebook: '',
  });

  const [imagen, setImagen] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);

  useEffect(() => {
    fetchAmpas();
  }, []);

  const fetchAmpas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/ampas');
      let data = res.data.data ? res.data.data : res.data;
      setAmpas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar las AMPAs:', err);
      setError('No se pudieron cargar las AMPAs registradas.');
    } finally {
      setLoading(false);
    }
  };

  const limpiarRutaImagen = (img) => {
    if (!img) return null;
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    const ruta = String(img).replace(/\\/g, '/').replace(/^\/+/, '').replace(/^storage\//, '');
    return `/storage/${ruta}`;
  };

  const handleNuevaAmpa = () => {
    setEditandoId(null);
    setFormData({
      nombre: '',
      correo: '',
      telefono: '',
      instagram: '',
      facebook: '',
    });
    setImagen(null);
    setImagenPreview(null);
    setError('');
    setSuccess('');
    setMostrarFormulario(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditar = (ampa) => {
    const id = ampa.id_ampa || ampa.id;
    setEditandoId(id);
    setFormData({
      nombre: ampa.nombre || '',
      correo: ampa.correo || '',
      telefono: ampa.telefono || '',
      instagram: ampa.instagram || '',
      facebook: ampa.facebook || '',
    });
    setImagen(null);
    setImagenPreview(ampa.imagen ? limpiarRutaImagen(ampa.imagen) : null);
    setError('');
    setSuccess('');
    setMostrarFormulario(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelar = () => {
    setMostrarFormulario(false);
    setEditandoId(null);
    if (imagenPreview && imagenPreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagenPreview);
    }
  };

  const handleImagenChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('El archivo seleccionado no es una imagen válida.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('La imagen no puede superar los 2 MB.');
      e.target.value = '';
      return;
    }

    setError('');
    setImagen(file);
    const nuevaPreview = URL.createObjectURL(file);
    if (imagenPreview && imagenPreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagenPreview);
    }
    setImagenPreview(nuevaPreview);
  };

  const handleEliminar = async (ampa) => {
    const id = ampa.id_ampa || ampa.id;
    if (!window.confirm(`¿Estás seguro de eliminar el AMPA: "${ampa.nombre}"?`)) return;

    try {
      await api.delete(`/ampas/${id}`);
      setAmpas(ampas.filter((a) => (a.id_ampa || a.id) !== id));
      setSuccess('AMPA eliminada correctamente.');
    } catch (err) {
      console.error('Error eliminando AMPA:', err);
      setError('Hubo un error al eliminar el AMPA.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const dataForm = new FormData();
      dataForm.append('nombre', formData.nombre.trim());
      dataForm.append('correo', formData.correo.trim());
      if (formData.telefono) dataForm.append('telefono', formData.telefono.trim());
      if (formData.instagram) dataForm.append('instagram', formData.instagram.trim());
      if (formData.facebook) dataForm.append('facebook', formData.facebook.trim());

      if (imagen instanceof File) {
        dataForm.append('imagen', imagen);
      }

      const adminData = JSON.parse(localStorage.getItem('admin_data') || '{}');
      if (adminData.id_administrador) {
        dataForm.append('id_administrador', adminData.id_administrador);
      }

      if (editandoId) {
        dataForm.append('_method', 'PUT');
        await api.post(`/ampas/${editandoId}`, dataForm, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccess('AMPA actualizada correctamente.');
      } else {
        await api.post('/ampas', dataForm, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccess('AMPA creada correctamente.');
      }

      setMostrarFormulario(false);
      await fetchAmpas();
    } catch (err) {
      console.error('Error guardando AMPA:', err);
      if (err.response?.status === 422) {
        const errores = err.response.data.errors;
        let mensajeAlerta = '⚠️ Laravel ha rechazado los datos:\n\n';
        for (const campo in errores) {
          mensajeAlerta += `❌ ${campo}: ${errores[campo][0]}\n`;
        }
        setError(mensajeAlerta);
      } else {
        setError('Error de conexión al guardar el AMPA.');
      }
    } finally {
      setLoading(false);
    }
  };

  const ampasFiltradas = ampas.filter((ampa) => {
    const termino = busqueda.toLowerCase();
    const nombre = ampa.nombre ? ampa.nombre.toLowerCase() : '';
    const correo = ampa.correo ? ampa.correo.toLowerCase() : '';
    return nombre.includes(termino) || correo.includes(termino);
  });

  return (
    <div className="container-xl py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <h1 className="fw-light m-0">Gestión de AMPAs</h1>
        {!mostrarFormulario && (
          <button className="btn btn-dark" onClick={handleNuevaAmpa}>
            + Nueva AMPA
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger" style={{ whiteSpace: 'pre-line' }}>{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* FORMULARIO DESPLEGABLE / OCULTO */}
      {mostrarFormulario && (
        <div className="card shadow-sm border-0 p-4 mb-5 bg-light">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h4 m-0">{editandoId ? 'Editar Entidad AMPA' : 'Crear Nueva Entidad AMPA'}</h2>
            <button className="btn btn-outline-secondary btn-sm" onClick={handleCancelar}>
              ✕ Cancelar
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label fw-bold">Nombre del AMPA</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: AMPA Colegio Ejemplo"
                  maxLength="150"
                  required
                />
              </div>

              <div className="col-12 col-md-6 mb-3">
                <label className="form-label fw-bold">Correo Electrónico</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.correo}
                  onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                  placeholder="ampa@colegio.es"
                  maxLength="150"
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md-4 mb-3">
                <label className="form-label fw-bold">Teléfono de Contacto</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="Ej: 600000000"
                  maxLength="20"
                />
              </div>

              <div className="col-12 col-md-4 mb-3">
                <label className="form-label fw-bold">Instagram</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  placeholder="@ampa_usuario"
                  maxLength="100"
                />
              </div>

              <div className="col-12 col-md-4 mb-3">
                <label className="form-label fw-bold">Facebook</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.facebook}
                  onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                  placeholder="Página oficial de Facebook"
                  maxLength="100"
                />
              </div>
            </div>

            {/* IMAGEN / LOGOTIPO */}
            <hr className="my-4 text-muted" />
            <div className="mb-4">
              <label className="form-label fw-bold">Logotipo / Imagen del AMPA</label>
              <input
                type="file"
                className="form-control"
                accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                onChange={handleImagenChange}
              />
              <div className="form-text">Formatos permitidos: JPG, PNG, WEBP. Tamaño máximo: 2 MB.</div>

              {imagenPreview && (
                <div className="mt-3 text-center bg-white p-3 rounded border">
                  <p className="text-muted small mb-2">Vista previa:</p>
                  <img
                    src={imagenPreview}
                    alt="Vista previa logo AMPA"
                    className="img-thumbnail rounded-circle"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>

            <div className="d-flex gap-2 justify-content-end">
              <button type="button" className="btn btn-secondary px-4" onClick={handleCancelar}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-dark px-4" disabled={loading}>
                {loading ? 'Guardando...' : editandoId ? 'Actualizar AMPA' : 'Crear AMPA'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 🔍 BARRA DE BÚSQUEDA */}
      <div className="card shadow-sm border-0 p-3 mb-4 bg-light">
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0">🔍</span>
          <input
            type="text"
            className="form-control border-start-0 shadow-none"
            placeholder="Buscar por nombre o correo electrónico..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          {busqueda && (
            <button className="btn btn-outline-secondary" type="button" onClick={() => setBusqueda('')}>
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* TABLA EN LÍNEA */}
      <div className="card shadow-sm border-0 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Entidad AMPA</th>
                <th>Correo y Teléfono</th>
                <th>Redes Sociales</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading && !ampas.length ? (
                <tr><td colSpan="4" className="text-center py-4">Cargando...</td></tr>
              ) : ampasFiltradas.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-4 text-muted">No se encontraron AMPAs coincidentes.</td></tr>
              ) : (
                ampasFiltradas.map((ampa) => {
                  const idAmpa = ampa.id_ampa || ampa.id;
                  const imagenUrl = ampa.imagen ? limpiarRutaImagen(ampa.imagen) : null;

                  return (
                    <tr key={idAmpa}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div style={{ width: '45px', height: '45px', flexShrink: 0 }} className="bg-light rounded-circle border overflow-hidden d-flex align-items-center justify-content-center">
                            {imagenUrl ? (
                              <img src={imagenUrl} alt="" className="w-100 h-100 object-fit-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                            ) : (
                              <span>🛡️</span>
                            )}
                          </div>
                          <div>
                            <span className="fw-bold d-block">{ampa.nombre}</span>
                            <small className="text-muted">ID: {idAmpa}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="d-block small">✉️ {ampa.correo || 'Sin correo'}</span>
                        <small className="text-muted">📞 {ampa.telefono || 'Sin teléfono'}</small>
                      </td>
                      <td>
                        <div className="small">
                          {ampa.instagram && <span className="d-block text-muted">📷 {ampa.instagram}</span>}
                          {ampa.facebook && <span className="d-block text-muted">📘 {ampa.facebook}</span>}
                          {!ampa.instagram && !ampa.facebook && <span className="text-muted">Sin redes</span>}
                        </div>
                      </td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditar(ampa)}>Editar</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleEliminar(ampa)}>Eliminar</button>
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

export default AdminAmpas;