import { useState, useEffect } from 'react';
import api from '../../api';

function AdminCentros() {
  const [centros, setCentros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [busqueda, setBusqueda] = useState('');

  // Estados del formulario y visibilidad
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    modalidad: '',
    direccion: '',
    telefono: '',
    email: '',
    web: '',
    facebook: '',
    instagram: '',
    video: '',
    ampa_nombre: '',
    ampa_correo: '',
    ampa_telefono: '',
    ampa_instagram: '',
    ampa_facebook: '',
  });

  const [imagen, setImagen] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);

  useEffect(() => {
    fetchCentros();
  }, []);

  const fetchCentros = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/centros');
      let data = res.data.data ? res.data.data : res.data;
      setCentros(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar centros:', err);
      setError('No se pudieron cargar los centros educativos.');
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

  const handleNuevoCentro = () => {
    setEditandoId(null);
    setFormData({
      nombre: '',
      descripcion: '',
      modalidad: '',
      direccion: '',
      telefono: '',
      email: '',
      web: '',
      facebook: '',
      instagram: '',
      video: '',
      ampa_nombre: '',
      ampa_correo: '',
      ampa_telefono: '',
      ampa_instagram: '',
      ampa_facebook: '',
    });
    setImagen(null);
    setImagenPreview(null);
    setError('');
    setSuccess('');
    setMostrarFormulario(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditar = (centro) => {
    const id = centro.id_centro || centro.id;
    setEditandoId(id);
    setFormData({
      nombre: centro.nombre || '',
      descripcion: centro.descripcion || '',
      modalidad: centro.modalidad || '',
      direccion: centro.direccion || '',
      telefono: centro.telefono || '',
      email: centro.email || '',
      web: centro.web || '',
      facebook: centro.facebook || '',
      instagram: centro.instagram || '',
      video: centro.video || '',
      ampa_nombre: centro.ampa?.nombre || '',
      ampa_correo: centro.ampa?.correo || '',
      ampa_telefono: centro.ampa?.telefono || '',
      ampa_instagram: centro.ampa?.instagram || '',
      ampa_facebook: centro.ampa?.facebook || '',
    });
    setImagen(null);
    setImagenPreview(limpiarRutaImagen(centro.imagen));
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

  const handleEliminar = async (centro) => {
    const id = centro.id_centro || centro.id;
    if (!window.confirm(`¿Estás seguro de eliminar el centro educativo: "${centro.nombre}"?`)) return;

    try {
      await api.delete(`/centros/${id}`);
      setCentros(centros.filter((c) => (c.id_centro || c.id) !== id));
      setSuccess('Centro eliminado correctamente.');
    } catch (err) {
      console.error('Error eliminando centro:', err);
      setError('Hubo un error al eliminar el centro educativo.');
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
      if (formData.descripcion) dataForm.append('descripcion', formData.descripcion.trim());
      if (formData.modalidad) dataForm.append('modalidad', formData.modalidad.trim());
      if (formData.direccion) dataForm.append('direccion', formData.direccion.trim());
      if (formData.telefono) dataForm.append('telefono', formData.telefono.trim());
      if (formData.email) dataForm.append('email', formData.email.trim());
      if (formData.web) dataForm.append('web', formData.web.trim());
      if (formData.facebook) dataForm.append('facebook', formData.facebook.trim());
      if (formData.instagram) dataForm.append('instagram', formData.instagram.trim());
      if (formData.video) dataForm.append('video', formData.video.trim());

      // AMPA
      if (formData.ampa_nombre) dataForm.append('ampa_nombre', formData.ampa_nombre.trim());
      if (formData.ampa_correo) dataForm.append('ampa_correo', formData.ampa_correo.trim());
      if (formData.ampa_telefono) dataForm.append('ampa_telefono', formData.ampa_telefono.trim());
      if (formData.ampa_instagram) dataForm.append('ampa_instagram', formData.ampa_instagram.trim());
      if (formData.ampa_facebook) dataForm.append('ampa_facebook', formData.ampa_facebook.trim());

      if (imagen instanceof File) {
        dataForm.append('imagen', imagen);
      }

      const adminData = JSON.parse(localStorage.getItem('admin_data') || '{}');
      if (adminData.id_administrador) {
        dataForm.append('id_administrador', adminData.id_administrador);
      }

      if (editandoId) {
        dataForm.append('_method', 'PUT');
        await api.post(`/centros/${editandoId}`, dataForm, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccess('Centro actualizado correctamente.');
      } else {
        await api.post('/centros', dataForm, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccess('Centro creado correctamente.');
      }

      setMostrarFormulario(false);
      await fetchCentros();
    } catch (err) {
      console.error('Error guardando centro:', err);
      if (err.response?.status === 422) {
        const errores = err.response.data.errors;
        let mensajeAlerta = '⚠️ Laravel ha rechazado los datos:\n\n';
        for (const campo in errores) {
          mensajeAlerta += `❌ ${campo}: ${errores[campo][0]}\n`;
        }
        setError(mensajeAlerta);
      } else {
        setError('Error de conexión al guardar el centro.');
      }
    } finally {
      setLoading(false);
    }
  };

  const centrosFiltrados = centros.filter((centro) => {
    const termino = busqueda.toLowerCase();
    const nombre = centro.nombre ? centro.nombre.toLowerCase() : '';
    const modalidad = centro.modalidad ? centro.modalidad.toLowerCase() : '';
    const direccion = centro.direccion ? centro.direccion.toLowerCase() : '';
    return nombre.includes(termino) || modalidad.includes(termino) || direccion.includes(termino);
  });

  const queryMapa = encodeURIComponent(
    `${formData.direccion ? formData.direccion + ',' : ''} Elda, Alicante, España`
  );
  const urlMapaGoogle = `https://maps.google.com/maps?q=${queryMapa}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="container-xl py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <h1 className="fw-light m-0">Gestión de Centros Educativos</h1>
        {!mostrarFormulario && (
          <button className="btn btn-dark" onClick={handleNuevoCentro}>
            + Nuevo Centro
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger" style={{ whiteSpace: 'pre-line' }}>{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* FORMULARIO DESPLEGABLE / OCULTO */}
      {mostrarFormulario && (
        <div className="card shadow-sm border-0 p-4 mb-5 bg-light">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h4 m-0">{editandoId ? 'Editar Centro Educativo' : 'Crear Nuevo Centro Educativo'}</h2>
            <button className="btn btn-outline-secondary btn-sm" onClick={handleCancelar}>
              ✕ Cancelar
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-12 col-md-8 mb-3">
                <label className="form-label fw-bold">Nombre del Centro</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  maxLength="150"
                  required
                />
              </div>

              <div className="col-12 col-md-4 mb-3">
                <label className="form-label fw-bold">Modalidad (Texto libre)</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.modalidad}
                  onChange={(e) => setFormData({ ...formData, modalidad: e.target.value })}
                  placeholder="Ej: Pública, Concertada..."
                  maxLength="100"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Descripción</label>
              <textarea
                className="form-control"
                rows="3"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Breve descripción del centro..."
              ></textarea>
            </div>

            <div className="row">
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label fw-bold">Correo Electrónico</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="centro@educacion.es"
                  maxLength="150"
                />
              </div>

              <div className="col-12 col-md-6 mb-3">
                <label className="form-label fw-bold">Teléfono</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="Ej: 965000000"
                  maxLength="20"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label fw-bold">Sitio Web</label>
                <input
                  type="url"
                  className="form-control"
                  value={formData.web}
                  onChange={(e) => setFormData({ ...formData, web: e.target.value })}
                  placeholder="https://..."
                  maxLength="150"
                />
              </div>

              <div className="col-12 col-md-6 mb-3">
                <label className="form-label fw-bold">Video (URL)</label>
                <input
                  type="url"
                  className="form-control"
                  value={formData.video}
                  onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                  placeholder="https://youtube.com/..."
                  maxLength="100"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Dirección</label>
              <div className="input-group mb-3">
                <span className="input-group-text bg-white">📍 Dirección</span>
                <input
                  type="text"
                  className="form-control"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  placeholder="Ej: Calle Mayor, 10, Elda"
                  maxLength="255"
                />
              </div>

              <div className="ratio ratio-21x9 shadow-sm rounded overflow-hidden border">
                <iframe
                  title="Mapa de ubicación"
                  src={urlMapaGoogle}
                  className="border-0 w-100 h-100"
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label fw-bold">Instagram</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  placeholder="@usuario"
                  maxLength="100"
                />
              </div>

              <div className="col-12 col-md-6 mb-3">
                <label className="form-label fw-bold">Facebook</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.facebook}
                  onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                  placeholder="Página oficial"
                  maxLength="100"
                />
              </div>
            </div>

            {/* SECCIÓN AMPA */}
            <hr className="my-4 text-muted" />
            <h4 className="h5 fw-bold mb-3 text-dark">Información de la AMPA asociada</h4>

            <div className="row">
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label fw-bold">Nombre AMPA</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.ampa_nombre}
                  onChange={(e) => setFormData({ ...formData, ampa_nombre: e.target.value })}
                  placeholder="AMPA del Centro"
                  maxLength="150"
                />
              </div>

              <div className="col-12 col-md-6 mb-3">
                <label className="form-label fw-bold">Correo AMPA</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.ampa_correo}
                  onChange={(e) => setFormData({ ...formData, ampa_correo: e.target.value })}
                  placeholder="ampa@correo.es"
                  maxLength="150"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md-4 mb-3">
                <label className="form-label fw-bold">Teléfono AMPA</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.ampa_telefono}
                  onChange={(e) => setFormData({ ...formData, ampa_telefono: e.target.value })}
                  placeholder="600000000"
                  maxLength="20"
                />
              </div>

              <div className="col-12 col-md-4 mb-3">
                <label className="form-label fw-bold">Instagram AMPA</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.ampa_instagram}
                  onChange={(e) => setFormData({ ...formData, ampa_instagram: e.target.value })}
                  placeholder="@ampa"
                  maxLength="100"
                />
              </div>

              <div className="col-12 col-md-4 mb-3">
                <label className="form-label fw-bold">Facebook AMPA</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.ampa_facebook}
                  onChange={(e) => setFormData({ ...formData, ampa_facebook: e.target.value })}
                  placeholder="AMPA Facebook"
                  maxLength="100"
                />
              </div>
            </div>

            {/* IMAGEN */}
            <hr className="my-4 text-muted" />
            <div className="mb-4">
              <label className="form-label fw-bold">Imagen del Centro</label>
              <input
                type="file"
                className="form-control"
                accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                onChange={handleImagenChange}
              />
              <div className="form-text">Formatos: JPG, PNG, WEBP. Máximo 2 MB.</div>

              {imagenPreview && (
                <div className="mt-3 text-center bg-white p-3 rounded border">
                  <p className="text-muted small mb-2">Vista previa:</p>
                  <img
                    src={imagenPreview}
                    alt="Vista previa"
                    className="img-thumbnail rounded"
                    style={{ maxHeight: '180px', objectFit: 'contain' }}
                  />
                </div>
              )}
            </div>

            <div className="d-flex gap-2 justify-content-end">
              <button type="button" className="btn btn-secondary px-4" onClick={handleCancelar}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-dark px-4" disabled={loading}>
                {loading ? 'Guardando...' : editandoId ? 'Actualizar Centro' : 'Crear Centro'}
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
            placeholder="Buscar por nombre, modalidad o dirección..."
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
                <th>Centro</th>
                <th>Modalidad</th>
                <th>Contacto</th>
                <th>AMPA</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading && !centros.length ? (
                <tr><td colSpan="5" className="text-center py-4">Cargando...</td></tr>
              ) : centrosFiltrados.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-4 text-muted">No se encontraron centros coincidentes.</td></tr>
              ) : (
                centrosFiltrados.map((centro) => {
                  const idCentro = centro.id_centro || centro.id;
                  const imagenUrl = limpiarRutaImagen(centro.imagen);

                  return (
                    <tr key={idCentro}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div style={{ width: '45px', height: '45px', flexShrink: 0 }} className="bg-light rounded border overflow-hidden d-flex align-items-center justify-content-center">
                            {imagenUrl ? (
                              <img src={imagenUrl} alt="" className="w-100 h-100 object-fit-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                            ) : (
                              <span>🏫</span>
                            )}
                          </div>
                          <div>
                            <span className="fw-bold d-block">{centro.nombre}</span>
                            <small className="text-muted">📍 {centro.direccion || 'Sin dirección'}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        {centro.modalidad ? (
                          <span className="badge bg-secondary">{centro.modalidad}</span>
                        ) : (
                          <span className="text-muted small">No especificada</span>
                        )}
                      </td>
                      <td>
                        <span className="d-block small">📞 {centro.telefono || 'Sin teléfono'}</span>
                        <small className="text-muted">✉️ {centro.email || 'Sin correo'}</small>
                      </td>
                      <td>
                        {centro.ampa?.nombre ? (
                          <span className="badge bg-dark">{centro.ampa.nombre}</span>
                        ) : (
                          <span className="text-muted small">Sin AMPA</span>
                        )}
                      </td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditar(centro)}>Editar</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleEliminar(centro)}>Eliminar</button>
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

export default AdminCentros;