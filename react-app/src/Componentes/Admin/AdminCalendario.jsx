import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

function AdminCalendario() {
  const [calendarios, setCalendarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  const [editandoId, setEditandoId] = useState(null);
  const [gradoEducativo, setGradoEducativo] = useState('');
  const [enlace, setEnlace] = useState('');
  const [imagen, setImagen] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);

  useEffect(() => {
    cargarCalendarios();
  }, []);

  const cargarCalendarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/calendarios');
      const data = res.data?.data ?? res.data;
      setCalendarios(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando calendarios:', err);
      setError('No se pudieron cargar los calendarios.');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!gradoEducativo.trim()) {
      setError('Debes indicar el grado educativo.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const dataForm = new FormData();
      dataForm.append('grado_educativo', gradoEducativo.trim());
      if (enlace) dataForm.append('enlace', enlace.trim());

      if (imagen instanceof File) {
        dataForm.append('imagen', imagen);
      }

      if (editandoId) {
        dataForm.append('_method', 'PUT');
        await api.post(`/calendarios/${editandoId}`, dataForm, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccess('Calendario actualizado correctamente.');
      } else {
        await api.post('/calendarios', dataForm, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccess('Calendario creado correctamente.');
      }

      limpiarFormulario();
      await cargarCalendarios();
    } catch (err) {
      console.error('Error guardando calendario:', err);
      if (err.response?.status === 422) {
        const errores = err.response.data.errors;
        let mensajeAlerta = '⚠️ Laravel ha rechazado los datos:\n\n';
        for (const campo in errores) {
          mensajeAlerta += `❌ ${campo}: ${errores[campo][0]}\n`;
        }
        setError(mensajeAlerta);
      } else {
        setError('Error de conexión al guardar el calendario.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (cal) => {
    const id = cal.id_calendario || cal.id;
    setEditandoId(id);
    setGradoEducativo(cal.grado_educativo || '');
    setEnlace(cal.enlace || '');
    setImagen(null);
    setImagenPreview(limpiarRutaImagen(cal.imagen));
    setError('');
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este calendario?')) return;
    try {
      setError('');
      setSuccess('');
      await api.delete(`/calendarios/${id}`);
      setSuccess('Registro eliminado correctamente.');
      await cargarCalendarios();
    } catch (err) {
      console.error('Error eliminando calendario:', err);
      setError('No se pudo eliminar el registro.');
    }
  };

  const limpiarFormulario = () => {
    if (imagenPreview && imagenPreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagenPreview);
    }
    setEditandoId(null);
    setGradoEducativo('');
    setEnlace('');
    setImagen(null);
    setImagenPreview(null);
  };

  return (
    <div className="container-xl py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <Link to="/admin/dashboard" className="text-decoration-none text-secondary">
          &larr; Volver al Panel
        </Link>
        <h1 className="h3 fw-light m-0">Gestión de Calendario de Matriculaciones</h1>
      </div>

      {error && <div className="alert alert-danger" style={{ whiteSpace: 'pre-line' }}>{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card shadow-sm border-0 p-4 mb-5 bg-light">
        <h3 className="h5 fw-bold mb-4">
          {editandoId ? 'Editar Calendario' : 'Añadir Nuevo Calendario'}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label htmlFor="gradoEducativo" className="form-label fw-medium">
                Grado Educativo / Título
              </label>
              <input
                id="gradoEducativo"
                type="text"
                className="form-control"
                value={gradoEducativo}
                onChange={(e) => setGradoEducativo(e.target.value)}
                placeholder="Ej. EDUCACIÓN SECUNDARIA"
                maxLength="100"
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="enlace" className="form-label fw-medium">
                Enlace Externo / PDF (URL)
              </label>
              <input
                id="enlace"
                type="url"
                className="form-control"
                value={enlace}
                onChange={(e) => setEnlace(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="col-12">
              <label htmlFor="imagen" className="form-label fw-medium">
                Imagen del Calendario
              </label>
              <input
                id="imagen"
                type="file"
                className="form-control"
                accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                onChange={handleImagenChange}
              />
              <div className="form-text">Formatos permitidos: JPG, PNG, WEBP. Máximo 2 MB.</div>
            </div>

            {imagenPreview && (
              <div className="col-12 mt-3">
                <div className="text-center bg-white p-3 rounded border">
                  <p className="text-muted small mb-2">Vista previa:</p>
                  <img
                    src={imagenPreview}
                    alt="Vista previa"
                    className="img-thumbnail rounded"
                    style={{ maxHeight: '200px', objectFit: 'contain' }}
                  />
                </div>
              </div>
            )}

            <div className="col-12 d-flex gap-2 justify-content-end mt-4">
              {editandoId && (
                <button type="button" className="btn btn-secondary px-4" onClick={limpiarFormulario}>
                  Cancelar
                </button>
              )}
              <button type="submit" className="btn btn-dark px-4" disabled={loading}>
                {loading ? 'Guardando...' : editandoId ? 'Actualizar Calendario' : 'Guardar Calendario'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <h2 className="h4 fw-bold mb-3">Calendarios Registrados</h2>

      {loading && !calendarios.length ? (
        <div className="text-center py-5">
          <div className="spinner-border text-secondary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : calendarios.length > 0 ? (
        <div className="row g-4">
          {calendarios.map((cal) => {
            const idCal = cal.id_calendario || cal.id;
            const imagenUrl = limpiarRutaImagen(cal.imagen);

            return (
              <div className="col-12 col-md-6 col-lg-4" key={idCal}>
                <div className="card h-100 shadow-sm border-0 d-flex flex-column">
                  <div className="bg-light p-3 text-center border-bottom" style={{ height: '200px', overflow: 'hidden' }}>
                    {imagenUrl ? (
                      <img
                        src={imagenUrl}
                        alt={cal.grado_educativo}
                        className="w-100 h-100 object-fit-contain"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
                        📅 Sin imagen
                      </div>
                    )}
                  </div>

                  <div className="card-body d-flex flex-column p-4">
                    <h5 className="card-title fw-bold mb-3">{cal.grado_educativo}</h5>
                    {cal.enlace ? (
                      <a href={cal.enlace} target="_blank" rel="noopener noreferrer" className="text-truncate d-block mb-3">
                        Ver documento ↗
                      </a>
                    ) : (
                      <p className="text-muted small mb-3">Sin enlace asociado</p>
                    )}

                    <div className="d-flex gap-2 mt-auto">
                      <button className="btn btn-outline-primary btn-sm w-50" onClick={() => handleEditar(cal)}>
                        Editar
                      </button>
                      <button className="btn btn-outline-danger btn-sm w-50" onClick={() => handleEliminar(idCal)}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-5 text-muted">No hay calendarios registrados actualmente.</div>
      )}
    </div>
  );
}

export default AdminCalendario;