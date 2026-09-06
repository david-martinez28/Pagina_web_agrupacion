import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

function AdminCalendario() {
  const [calendarios, setCalendarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [editandoId, setEditandoId] = useState(null);
  const [gradoEducativo, setGradoEducativo] = useState('');
  const [enlace, setEnlace] = useState('');
  const [imagen, setImagen] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [guardando, setGuardando] = useState(false);

  // ============================================================
  // CARGAR CALENDARIOS
  // ============================================================
  const cargarCalendarios = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/calendarios');
      const data = res.data?.data ?? res.data;
      setCalendarios(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando calendarios:', err);
      setError(
        err.response?.data?.message ||
        'No se pudieron cargar los calendarios.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCalendarios();
  }, []);

  // ============================================================
  // SELECCIONAR IMAGEN
  // ============================================================
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

    if (imagenPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(imagenPreview);
    }

    setImagen(file);
    setImagenPreview(URL.createObjectURL(file));
  };

  // ============================================================
  // GUARDAR / ACTUALIZAR
  // ============================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!gradoEducativo.trim()) {
      setError('Debes indicar el grado educativo.');
      return;
    }

    setGuardando(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('grado_educativo', gradoEducativo.trim());
      formData.append('enlace', enlace.trim());

      if (imagen && imagen instanceof File) {
        formData.append('imagen', imagen, imagen.name);
      }

      if (editandoId) {
        formData.append('_method', 'PUT');
        await api.post(`/calendarios/${editandoId}`, formData);
        setSuccess(
          imagen
            ? 'Calendario e imagen actualizados correctamente.'
            : 'Calendario actualizado correctamente.'
        );
      } else {
        await api.post('/calendarios', formData);
        setSuccess('Calendario creado correctamente.');
      }

      limpiarFormulario();
      await cargarCalendarios();
    } catch (err) {
      console.error('Error guardando calendario:', err);

      if (err.response?.status === 422) {
        const errores = err.response?.data?.errors;
        if (errores) {
          const mensajes = Object.entries(errores)
            .map(([campo, mensajesCampo]) => `${campo}: ${mensajesCampo.join(', ')}`)
            .join('\n');
          setError(mensajes);
        } else {
          setError(err.response?.data?.message || 'Los datos enviados no son válidos.');
        }
      } else {
        setError(err.response?.data?.message || 'Ocurrió un error al guardar el calendario.');
      }
    } finally {
      setGuardando(false);
    }
  };

  // ============================================================
  // EDITAR
  // ============================================================
  const handleEditar = (cal) => {
    setEditandoId(cal.id_calendario);
    setGradoEducativo(cal.grado_educativo || '');
    setEnlace(cal.enlace || '');
    setImagen(null);
    setImagenPreview(cal.imagen || null);
    setError('');
    setSuccess('');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ============================================================
  // ELIMINAR
  // ============================================================
  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este calendario?')) {
      return;
    }
    try {
      setError('');
      setSuccess('');
      await api.delete(`/calendarios/${id}`);
      setSuccess('Registro eliminado correctamente.');
      await cargarCalendarios();
    } catch (err) {
      console.error('Error eliminando calendario:', err);
      setError(err.response?.data?.message || 'No se pudo eliminar el registro.');
    }
  };

  // ============================================================
  // LIMPIAR FORMULARIO
  // ============================================================
  const limpiarFormulario = () => {
    if (imagenPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(imagenPreview);
    }
    setEditandoId(null);
    setGradoEducativo('');
    setEnlace('');
    setImagen(null);
    setImagenPreview(null);

    const input = document.getElementById('imagen');
    if (input) {
      input.value = '';
    }
  };

  // ============================================================
  // ERROR DE IMAGEN
  // ============================================================
  const handleImagenError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = 'https://placehold.co/600x400?text=Sin+Imagen';
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="container-xl py-5">
      
      {/* CABECERA */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <Link to="/admin/dashboard" className="text-decoration-none text-secondary">
          &larr; Volver al Panel
        </Link>
        <h1 className="h3 fw-light m-0">
          Gestión de Calendario de Matriculaciones
        </h1>
      </div>

      {/* ALERTA ERROR */}
      {error && (
        <div className="alert alert-danger" role="alert" style={{ whiteSpace: 'pre-line' }}>
          {error}
        </div>
      )}

      {/* ALERTA ÉXITO */}
      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}

      {/* FORMULARIO */}
      <div className="card shadow-sm border-0 p-4 mb-5 bg-light">
        <h3 className="h5 fw-bold mb-4">
          {editandoId ? 'Editar Calendario' : 'Añadir Nuevo Calendario'}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            
            {/* GRADO */}
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

            {/* ENLACE */}
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

            {/* IMAGEN */}
            <div className="col-12 col-md-6">
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
              <div className="form-text">
                Formatos permitidos: JPG, JPEG, PNG, GIF o WEBP. Máximo 2 MB.
              </div>
              {editandoId && !imagen && (
                <div className="form-text text-primary mt-2">
                  La imagen actual se conservará si no seleccionas una nueva.
                </div>
              )}
            </div>

            {/* PREVIEW */}
            {imagenPreview && (
              <div className="col-12 mt-4">
                <div className="text-center">
                  <p className="text-muted small mb-2">
                    {imagen ? 'Vista previa de la nueva imagen:' : 'Imagen actual:'}
                  </p>
                  <div
                    className="d-flex justify-content-center align-items-center bg-white border rounded p-3"
                    style={{ minHeight: '180px' }}
                  >
                    <img
                      src={imagenPreview}
                      alt="Vista previa del calendario"
                      className="img-fluid rounded"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '250px',
                        objectFit: 'contain',
                      }}
                      onError={handleImagenError}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* BOTONES */}
            <div className="col-12 d-flex gap-2 justify-content-end mt-4">
              {editandoId && (
                <button
                  type="button"
                  className="btn btn-secondary px-4"
                  onClick={limpiarFormulario}
                  disabled={guardando}
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                className="btn btn-dark px-4"
                disabled={guardando}
              >
                {guardando
                  ? 'Guardando...'
                  : editandoId
                    ? 'Actualizar Calendario'
                    : 'Guardar Calendario'}
              </button>
            </div>

          </div>
        </form>
      </div>

      {/* LISTADO */}
      <h2 className="h4 fw-bold mb-3">Calendarios Registrados</h2>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-secondary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-muted mt-3">Cargando registros...</p>
        </div>
      ) : calendarios.length > 0 ? (
        <div className="row g-4">
          {calendarios.map((cal) => (
            <div className="col-12 col-md-6 col-lg-4" key={cal.id_calendario}>
              <div className="card h-100 shadow-sm border-0 d-flex flex-column">
                
                {/* IMAGEN */}
                <div
                  className="bg-light p-3 text-center border-bottom"
                  style={{ height: '220px', overflow: 'hidden' }}
                >
                  {cal.imagen ? (
                    <img
                      src={cal.imagen}
                      alt={cal.grado_educativo || 'Calendario'}
                      className="w-100 h-100"
                      style={{ objectFit: 'contain' }}
                      onError={handleImagenError}
                    />
                  ) : (
                    <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                      <div className="text-center text-muted">
                        <div style={{ fontSize: '3rem' }}>📅</div>
                        <small>Sin imagen</small>
                      </div>
                    </div>
                  )}
                </div>

                {/* CONTENIDO */}
                <div className="card-body d-flex flex-column p-4">
                  <h5 className="card-title fw-bold mb-3">
                    {cal.grado_educativo}
                  </h5>

                  {cal.enlace ? (
                    <div className="mb-3">
                      <small className="text-muted d-block mb-1">Enlace:</small>
                      <a
                        href={cal.enlace}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none text-truncate d-block"
                        title={cal.enlace}
                      >
                        Ver PDF / documento ↗
                      </a>
                    </div>
                  ) : (
                    <p className="text-muted small mb-3">Sin enlace PDF asociado</p>
                  )}

                  <div className="d-flex gap-2 mt-auto">
                    <button
                      type="button"
                      onClick={() => handleEditar(cal)}
                      className="btn btn-outline-primary btn-sm w-50"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEliminar(cal.id_calendario)}
                      className="btn btn-outline-danger btn-sm w-50"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <div className="text-muted mb-3" style={{ fontSize: '3rem' }}>📅</div>
          <p className="text-muted">No hay calendarios registrados actualmente.</p>
        </div>
      )}

    </div>
  );
}

export default AdminCalendario;