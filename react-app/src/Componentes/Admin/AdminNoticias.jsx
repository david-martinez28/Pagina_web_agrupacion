import { useState, useEffect } from 'react';
import api from '../../api';

function AdminNoticias() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vista, setVista] = useState('lista');

  const [formData, setFormData] = useState({
    id_publicacion: '',
    titulo: '',
    descripcion: '',
    imagen: null,
    video: '',
    enlace: '',
    pdf_descarga: null,
    role: 'Noticia',
    fecha_publicacion: '',
    visibilidad: 1
  });

  useEffect(() => {
    fetchNoticias();
  }, []);

  // =========================================================
  // CARGAR NOTICIAS DESDE LA API
  // =========================================================
  const fetchNoticias = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get('/noticias');
      const data = res.data.data ? res.data.data : res.data;
      setNoticias(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar noticias:', err);
      setError('No se pudieron cargar las noticias.');
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // CREAR / NUEVA NOTICIA
  // =========================================================
  const handleNuevaNoticia = () => {
    const ahora = new Date();
    ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
    const fechaActual = ahora.toISOString().slice(0, 16);

    setFormData({
      id_publicacion: '',
      titulo: '',
      descripcion: '',
      imagen: null,
      video: '',
      enlace: '',
      pdf_descarga: null,
      role: 'Noticia',
      fecha_publicacion: fechaActual,
      visibilidad: 1
    });

    setVista('formulario');
  };

  // =========================================================
  // EDITAR NOTICIA EXISTENTE
  // =========================================================
  const handleEditar = (noticia) => {
    const id = noticia.id_publicacion || noticia.id;
    let fechaFormateada = '';

    if (noticia.fecha_publicacion) {
      const fecha = new Date(noticia.fecha_publicacion);
      if (!isNaN(fecha.getTime())) {
        fechaFormateada = fecha.toISOString().slice(0, 16);
      }
    }

    setFormData({
      id_publicacion: id,
      titulo: noticia.titulo || '',
      descripcion: noticia.descripcion || '',
      imagen: noticia.imagen || null,
      video: noticia.video || '',
      enlace: noticia.enlace || '',
      pdf_descarga: noticia.pdf_descarga || null,
      role: noticia.role || 'Noticia',
      fecha_publicacion: fechaFormateada,
      visibilidad: noticia.visibilidad === true || noticia.visibilidad === 1 || noticia.visibilidad === '1' ? 1 : 0
    });

    setVista('formulario');
  };

  // =========================================================
  // ELIMINAR NOTICIA
  // =========================================================
  const handleEliminar = async (noticia) => {
    const id = noticia.id_publicacion || noticia.id;

    if (!window.confirm(`¿Estás seguro de que quieres eliminar: "${noticia.titulo}"?`)) {
      return;
    }

    try {
      await api.delete(`/noticias/${id}`);
      setNoticias(noticias.filter((n) => (n.id_publicacion || n.id) !== id));
      alert('Publicación eliminada correctamente');
    } catch (err) {
      console.error('Error eliminando:', err);
      alert('Hubo un error al eliminar la publicación');
    }
  };

  // =========================================================
  // GESTIÓN DE ARCHIVOS (INPUT FILE)
  // =========================================================
  const handleFileChange = (e, fieldName) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({
        ...formData,
        [fieldName]: e.target.files[0]
      });
    }
  };

  // =========================================================
  // GUARDAR / ACTUALIZAR (SUBMIT)
  // =========================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const adminData = JSON.parse(localStorage.getItem('admin_data') || '{}');
      const submitData = new FormData();

      submitData.append('titulo', formData.titulo);
      submitData.append('descripcion', formData.descripcion);
      submitData.append('role', formData.role);
      submitData.append('fecha_publicacion', formData.fecha_publicacion.replace('T', ' '));
      submitData.append('visibilidad', formData.visibilidad === 1 ? '1' : '0');

      // Enviamos el vídeo (si está vacío, enviamos cadena vacía para que Laravel lo borre en la BD)
      submitData.append('video', formData.video ? formData.video.trim() : '');
      
      // Enviamos el enlace (si está vacío, igual)
      submitData.append('enlace', formData.enlace ? formData.enlace.trim() : '');

      if (adminData.id_administrador) {
        submitData.append('id_administrador', adminData.id_administrador);
      }
      if (formData.imagen instanceof File) {
        submitData.append('imagen', formData.imagen);
      }
      if (formData.pdf_descarga instanceof File) {
        submitData.append('pdf_descarga', formData.pdf_descarga);
      }

      if (formData.id_publicacion) {
        submitData.append('_method', 'PUT');
        await api.post(`/noticias/${formData.id_publicacion}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Publicación actualizada correctamente');
      } else {
        await api.post('/noticias', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Publicación creada correctamente');
      }

      setVista('lista');
      await fetchNoticias();
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
        alert('Error de conexión al guardar la noticia.');
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // VISTA: FORMULARIO (CREAR / EDITAR)
  // =========================================================
  if (vista === 'formulario') {
    return (
      <div className="container-xl py-5">
        <button className="btn btn-outline-secondary mb-4" onClick={() => setVista('lista')}>
          &larr; Volver a la lista
        </button>

        <div className="card shadow-sm border-0 p-4">
          <h2 className="mb-4">
            {formData.id_publicacion ? 'Editar Publicación' : 'Crear Nueva Publicación'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-12 col-md-8 mb-3">
                <label className="form-label fw-bold">Título</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  maxLength="200"
                  required
                />
              </div>

              <div className="col-12 col-md-4 mb-3">
                <label className="form-label fw-bold">Tipo (Role)</label>
                <select
                  className="form-select"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="Noticia">Noticia</option>
                  <option value="Actividades">Actividades</option>
                  <option value="Formación">Formación</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label fw-bold">Fecha de Publicación</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={formData.fecha_publicacion}
                  onChange={(e) => setFormData({ ...formData, fecha_publicacion: e.target.value })}
                  required
                />
              </div>

              <div className="col-12 col-md-6 mb-3 d-flex align-items-center mt-md-4 pt-md-2">
                <div className="form-check form-switch fs-5">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={formData.visibilidad === 1}
                    onChange={(e) => setFormData({ ...formData, visibilidad: e.target.checked ? 1 : 0 })}
                  />
                  <label className="form-check-label ms-2 fs-6">
                    {formData.visibilidad === 1 ? 'Público (Visible)' : 'Oculto (Borrador)'}
                  </label>
                </div>
              </div>
            </div>

            <hr className="my-4 text-muted" />

            <h5 className="mb-3">Contenido Multimedia y Descargas</h5>
            <div className="row">
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label text-secondary small fw-bold">Subir Imagen</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={(e) => handleFileChange(e, 'imagen')}
                />
                {typeof formData.imagen === 'string' && formData.imagen && (
                  <div className="form-text text-primary mt-1">
                    Imagen actual guardada. Sube una nueva para reemplazarla.
                  </div>
                )}
              </div>

              <div className="col-12 col-md-6 mb-3">
                <label className="form-label text-secondary small fw-bold">Subir PDF Adjunto</label>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  className="form-control"
                  onChange={(e) => handleFileChange(e, 'pdf_descarga')}
                />
                {typeof formData.pdf_descarga === 'string' && formData.pdf_descarga && (
                  <div className="form-text text-primary mt-1">
                    PDF actual guardado. Sube uno nuevo para reemplazarlo.
                  </div>
                )}
              </div>

              {/* CAMPO DE VÍDEO CON BOTÓN PARA ELIMINARLO FÁCILMENTE */}
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label text-secondary small">URL Vídeo</label>
                <div className="input-group">
                  <input
                    type="url"
                    className="form-control"
                    value={formData.video || ''}
                    onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                    placeholder="Ej: https://youtube.com/..."
                  />
                  {formData.video && (
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => setFormData({ ...formData, video: '' })}
                      title="Borrar vídeo"
                    >
                      ✕ Quitar
                    </button>
                  )}
                </div>
              </div>

              <div className="col-12 col-md-6 mb-3">
                <label className="form-label text-secondary small">Enlace Externo</label>
                <div className="input-group">
                  <input
                    type="url"
                    className="form-control"
                    value={formData.enlace || ''}
                    onChange={(e) => setFormData({ ...formData, enlace: e.target.value })}
                    placeholder="Ej: https://ejemplo.com"
                  />
                  {formData.enlace && (
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => setFormData({ ...formData, enlace: '' })}
                      title="Borrar enlace"
                    >
                      ✕ Quitar
                    </button>
                  )}
                </div>
              </div>
            </div>

            <hr className="my-4 text-muted" />

            <div className="mb-4">
              <label className="form-label fw-bold">Descripción / Contenido</label>
              <textarea
                className="form-control"
                rows="8"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-dark w-100 py-2 fs-5" disabled={loading}>
              {loading ? 'Guardando...' : formData.id_publicacion ? 'Actualizar Publicación' : 'Publicar Ahora'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================
  // VISTA: LISTA DE PUBLICACIONES
  // =========================================================
  return (
    <div className="container-xl py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <h1 className="fw-light m-0">Gestión de Publicaciones</h1>
        <button className="btn btn-dark" onClick={handleNuevaNoticia}>
          + Nueva Publicación
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm border-0 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Imagen</th>
                <th>Datos</th>
                <th>Adjuntos</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">Cargando...</td>
                </tr>
              ) : noticias.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">No hay publicaciones registradas todavía.</td>
                </tr>
              ) : (
                noticias.map((noticia, idx) => {
                  const limpiarRutaImagen = (img) => {
                    if (!img) return null;
                    if (img.startsWith('http')) return img;
                    const rutaLimpia = String(img).replace(/\\/g, '').replace(/^\/?(storage\/)?/, '');
                    return `/storage/${rutaLimpia}`;
                  };

                  const imagenUrl = noticia.imagen_url || limpiarRutaImagen(noticia.imagen) || `https://ui-avatars.com/api/?name=Noticia+${idx}&background=random`;

                  return (
                    <tr key={noticia.id_publicacion || idx}>
                      <td style={{ width: '80px' }}>
                        <img
                          src={imagenUrl}
                          alt={noticia.titulo || 'Miniatura'}
                          className="img-fluid rounded shadow-sm"
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=Error&background=ff0000&color=fff`;
                          }}
                        />
                      </td>

                      <td>
                        <span className="fw-bold d-block">{noticia.titulo}</span>
                        <span className="badge bg-secondary me-2">{noticia.role}</span>
                        <small className="text-muted">
                          {noticia.fecha_publicacion ? new Date(noticia.fecha_publicacion).toLocaleDateString() : ''}
                        </small>
                      </td>

                      <td>
                        {noticia.pdf_descarga ? (
                          <span className="badge bg-danger text-white">📄 PDF</span>
                        ) : (
                          <span className="text-muted small">Ninguno</span>
                        )}
                      </td>

                      <td>
                        {noticia.visibilidad === 1 || noticia.visibilidad === true || noticia.visibilidad === '1' ? (
                          <span className="badge bg-success">Visible</span>
                        ) : (
                          <span className="badge bg-warning text-dark">Oculto</span>
                        )}
                      </td>

                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEditar(noticia)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleEliminar(noticia)}
                        >
                          Eliminar
                        </button>
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

export default AdminNoticias;