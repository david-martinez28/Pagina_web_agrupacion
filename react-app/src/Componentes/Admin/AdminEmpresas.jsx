import { useState, useEffect } from 'react';
import api from '../../api';
import imagenPorDefecto from '../../assets/imagenes/sin_imagen.jpg';

function AdminEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [erroresFormulario, setErroresFormulario] = useState({});
  const [vista, setVista] = useState('lista');
  const [busqueda, setBusqueda] = useState('');

  const [formData, setFormData] = useState({
    id_empresa: '',
    nombre: '',
    email: '',
    direccion: '',
    telefono: '',
    id_seccion: '',
    web: '',
    instagram: '',
    facebook: '',
    ofertas: '',
    condiciones: '',
    imagen: null,
    imagenActual: ''
  });

  useEffect(() => {
    fetchEmpresas();
    fetchSecciones();
  }, []);

  const fetchEmpresas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/empresas');
      let data = res.data.data ? res.data.data : res.data;
      setEmpresas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar empresas:', err);
      setError('No se pudieron cargar las empresas.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSecciones = async () => {
    try {
      const res = await api.get('/secciones');
      let data = res.data.data ? res.data.data : res.data;
      setSecciones(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar secciones para el selector', err);
    }
  };

  const handleNuevaEmpresa = () => {
    setFormData({
      id_empresa: '',
      nombre: '',
      email: '',
      direccion: '',
      telefono: '',
      id_seccion: '',
      web: '',
      instagram: '',
      facebook: '',
      ofertas: '',
      condiciones: '',
      imagen: null,
      imagenActual: ''
    });
    setErroresFormulario({});
    setVista('formulario');
  };

  const handleEditar = (empresa) => {
    console.log("🛠️ Objeto empresa recibido al hacer clic en editar:", empresa);

    const id = empresa.id_empresa || empresa.id;
    
    // Priorizamos estrictamente el campo plano id_seccion antes de mirar el objeto relacionado
    const seccionIdAsociada = 
      empresa.id_seccion ?? 
      empresa.seccion?.id ?? 
      '';

    setFormData({
      id_empresa: id,
      nombre: empresa.nombre || '',
      email: empresa.email || '',
      direccion: empresa.direccion || '',
      telefono: empresa.telefono || '',
      id_seccion: seccionIdAsociada !== '' ? String(seccionIdAsociada) : '',
      web: empresa.web || '',
      instagram: empresa.instagram || '',
      facebook: empresa.facebook || '',
      ofertas: empresa.ofertas || '',
      condiciones: empresa.condiciones || '',
      imagen: null,
      imagenActual: empresa.imagen || ''
    });
    setErroresFormulario({});
    setVista('formulario');
  };

  const handleEliminar = async (empresa) => {
    const id = empresa.id_empresa || empresa.id;
    if (!window.confirm(`¿Estás seguro de eliminar la empresa: "${empresa.nombre}"?`)) return;

    try {
      await api.delete(`/empresas/${id}`);
      setEmpresas(empresas.filter((e) => (e.id_empresa || e.id) !== id));
      alert('Empresa eliminada correctamente');
    } catch (err) {
      console.error('Error eliminando:', err);
      alert('Hubo un error al eliminar la empresa');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErroresFormulario({});

    try {
      const adminData = JSON.parse(localStorage.getItem('admin_data') || '{}');
      
      const dataToSend = new FormData();
      dataToSend.append('nombre', formData.nombre.trim());
      dataToSend.append('email', formData.email.trim());
      dataToSend.append('direccion', formData.direccion.trim());
      dataToSend.append('telefono', formData.telefono.trim());
      dataToSend.append('id_seccion', formData.id_seccion);

      if (formData.web) dataToSend.append('web', formData.web.trim());
      if (formData.instagram) dataToSend.append('instagram', formData.instagram.trim());
      if (formData.facebook) dataToSend.append('facebook', formData.facebook.trim());
      if (formData.ofertas) dataToSend.append('ofertas', formData.ofertas.trim());
      if (formData.condiciones) dataToSend.append('condiciones', formData.condiciones.trim());
      if (adminData.id_administrador) dataToSend.append('id_administrador', adminData.id_administrador);
      
      if (formData.imagen) {
        dataToSend.append('imagen', formData.imagen);
      }

      if (formData.id_empresa) {
        dataToSend.append('_method', 'PUT');
        await api.post(`/empresas/${formData.id_empresa}`, dataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Empresa actualizada correctamente');
      } else {
        await api.post('/empresas', dataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Empresa creada correctamente');
      }

      setVista('lista');
      await fetchEmpresas();
    } catch (err) {
      console.error('Error guardando:', err);
      if (err.response?.status === 422) {
        setErroresFormulario(err.response.data.errors || {});
      } else {
        alert('Error de conexión al guardar la empresa.');
      }
    } finally {
      setLoading(false);
    }
  };

  const empresasFiltradas = empresas.filter((empresa) => {
    const termino = busqueda.toLowerCase();
    const nombreEmpresa = empresa.nombre ? empresa.nombre.toLowerCase() : '';
    const nombreSeccion = empresa.seccion?.nombre ? empresa.seccion.nombre.toLowerCase() : '';
    return nombreEmpresa.includes(termino) || nombreSeccion.includes(termino);
  });

  if (vista === 'formulario') {
    const queryMapa = encodeURIComponent(
      `${formData.direccion ? formData.direccion + ',' : ''} Elda, Alicante, España`
    );
    const urlMapaGoogle = `https://maps.google.com/maps?q=${queryMapa}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

    return (
      <div className="container-xl py-5">
        <button className="btn btn-outline-secondary mb-4" onClick={() => setVista('lista')}>
          &larr; Volver a la lista
        </button>

        <div className="card shadow-sm border-0 p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="m-0">{formData.id_empresa ? 'Editar Empresa Colaboradora' : 'Crear Nueva Empresa Colaboradora'}</h2>
            <span className="text-muted small">Los campos marcados con <span className="text-danger fw-bold">*</span> son obligatorios</span>
          </div>

          {Object.keys(erroresFormulario).length > 0 && (
            <div className="alert alert-danger mb-4">
              <strong>⚠️ Por favor, revisa los errores en el formulario:</strong>
              <ul className="mb-0 mt-2">
                {Object.entries(erroresFormulario).map(([campo, mensajes], index) => (
                  <li key={index}><strong>{campo}:</strong> {mensajes[0]}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label fw-bold">Nombre de la Empresa <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className={`form-control ${erroresFormulario.nombre ? 'is-invalid' : ''}`}
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  maxLength="150"
                  required
                />
                {erroresFormulario.nombre && <div className="invalid-feedback">{erroresFormulario.nombre[0]}</div>}
              </div>

              <div className="col-12 col-md-6 mb-3">
                <label className="form-label fw-bold">Correo Electrónico <span className="text-danger">*</span></label>
                <input
                  type="email"
                  className={`form-control ${erroresFormulario.email ? 'is-invalid' : ''}`}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  maxLength="150"
                  required
                />
                {erroresFormulario.email && <div className="invalid-feedback">{erroresFormulario.email[0]}</div>}
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label fw-bold">Sección a la que pertenece <span className="text-danger">*</span></label>
                <select
                  className={`form-select ${erroresFormulario.id_seccion ? 'is-invalid' : ''}`}
                  value={formData.id_seccion}
                  onChange={(e) => setFormData({ ...formData, id_seccion: e.target.value })}
                  required
                >
                  <option value="">-- Selecciona una Sección --</option>
                  {secciones.map((sec) => {
                    const idSec = sec.id_seccion || sec.id;
                    return (
                      <option key={idSec} value={String(idSec)}>
                        {sec.nombre}
                      </option>
                    );
                  })}
                </select>
                {erroresFormulario.id_seccion && <div className="invalid-feedback">{erroresFormulario.id_seccion[0]}</div>}
              </div>

              <div className="col-12 col-md-6 mb-3">
                <label className="form-label fw-bold">Teléfono <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className={`form-control ${erroresFormulario.telefono ? 'is-invalid' : ''}`}
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="Ej: 965000000"
                  maxLength="20"
                  required
                />
                {erroresFormulario.telefono && <div className="invalid-feedback">{erroresFormulario.telefono[0]}</div>}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Imagen de la Empresa <span className="text-muted fw-normal">(Opcional)</span></label>
              <input
                type="file"
                className={`form-control ${erroresFormulario.imagen ? 'is-invalid' : ''}`}
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={(e) => setFormData({ ...formData, imagen: e.target.files[0] })}
              />
              <div className="form-text">Formatos permitidos: JPEG, PNG, JPG, WEBP. Máx: 2MB.</div>
              {erroresFormulario.imagen && <div className="invalid-feedback d-block">{erroresFormulario.imagen[0]}</div>}
              
              {formData.imagenActual && !formData.imagen && (
                <div className="mt-2">
                  <span className="small text-muted d-block mb-1">Imagen actual:</span>
                  <img 
                    src={formData.imagenActual} 
                    alt="Preview" 
                    className="rounded border object-fit-cover" 
                    style={{ width: '100px', height: '100px' }} 
                    onError={(e) => { 
                      e.currentTarget.onerror = null; 
                      e.currentTarget.src = imagenPorDefecto; 
                    }}
                  />
                </div>
              )}
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label fw-bold m-0">Dirección de la Empresa <span className="text-danger">*</span></label>
                <a 
                  href={`https://www.google.com/maps`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="small text-decoration-none fw-bold text-primary"
                >
                  Abrir Google Maps en grande para buscar ubicación ↗
                </a>
              </div>
              
              <div className="input-group mb-3">
                <span className="input-group-text bg-light">📍 Dirección</span>
                <input
                  type="text"
                  className={`form-control ${erroresFormulario.direccion ? 'is-invalid' : ''}`}
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  placeholder="Ej: Calle Nueva, 5, Elda"
                  maxLength="255"
                  required
                />
                {erroresFormulario.direccion && <div className="invalid-feedback">{erroresFormulario.direccion[0]}</div>}
              </div>

              <div className="ratio ratio-21x9 shadow-sm rounded overflow-hidden border">
                <iframe
                  title="Selección de ubicación en Google Maps"
                  src={urlMapaGoogle}
                  className="border-0 w-100 h-100"
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md-4 mb-3">
                <label className="form-label fw-bold">Sitio Web <span className="text-muted fw-normal">(Opcional)</span></label>
                <input
                  type="text"
                  className={`form-control ${erroresFormulario.web ? 'is-invalid' : ''}`}
                  value={formData.web || ''}
                  onChange={(e) => setFormData({ ...formData, web: e.target.value })}
                  placeholder="Ej: https://www.tuweb.com"
                  maxLength="255"
                />
                {erroresFormulario.web && <div className="invalid-feedback">{erroresFormulario.web[0]}</div>}
              </div>

              <div className="col-12 col-md-4 mb-3">
                <label className="form-label fw-bold">Instagram <span className="text-muted fw-normal">(Opcional)</span></label>
                <input
                  type="text"
                  className={`form-control ${erroresFormulario.instagram ? 'is-invalid' : ''}`}
                  value={formData.instagram || ''}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  placeholder="Ej: @empresa"
                  maxLength="100"
                />
                {erroresFormulario.instagram && <div className="invalid-feedback">{erroresFormulario.instagram[0]}</div>}
              </div>

              <div className="col-12 col-md-4 mb-3">
                <label className="form-label fw-bold">Facebook <span className="text-muted fw-normal">(Opcional)</span></label>
                <input
                  type="text"
                  className={`form-control ${erroresFormulario.facebook ? 'is-invalid' : ''}`}
                  value={formData.facebook || ''}
                  onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                  placeholder="Ej: Empresa Oficial"
                  maxLength="100"
                />
                {erroresFormulario.facebook && <div className="invalid-feedback">{erroresFormulario.facebook[0]}</div>}
              </div>
            </div>

            <hr className="my-4 text-muted" />

            <div className="row">
              <div className="col-12 col-md-6 mb-4">
                <label className="form-label fw-bold">Ofertas / Descuentos <span className="text-muted fw-normal">(Opcional)</span></label>
                <textarea
                  className={`form-control ${erroresFormulario.ofertas ? 'is-invalid' : ''}`}
                  rows="4"
                  value={formData.ofertas || ''}
                  onChange={(e) => setFormData({ ...formData, ofertas: e.target.value })}
                  placeholder="Ej: 10% de descuento presentando el carnet..."
                ></textarea>
                {erroresFormulario.ofertas && <div className="invalid-feedback">{erroresFormulario.ofertas[0]}</div>}
              </div>

              <div className="col-12 col-md-6 mb-4">
                <label className="form-label fw-bold">Condiciones <span className="text-muted fw-normal">(Opcional)</span></label>
                <textarea
                  className={`form-control ${erroresFormulario.condiciones ? 'is-invalid' : ''}`}
                  rows="4"
                  value={formData.condiciones || ''}
                  onChange={(e) => setFormData({ ...formData, condiciones: e.target.value })}
                  placeholder="Ej: Válido para compras superiores a 20€..."
                ></textarea>
                {erroresFormulario.condiciones && <div className="invalid-feedback">{erroresFormulario.condiciones[0]}</div>}
              </div>
            </div>

            <button type="submit" className="btn btn-dark w-100 py-2 fs-5" disabled={loading}>
              {loading ? 'Guardando...' : formData.id_empresa ? 'Actualizar Empresa' : 'Crear Empresa'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container-xl py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <h1 className="fw-light m-0">Gestión de Empresas Colaboradoras</h1>
        <button className="btn btn-dark" onClick={handleNuevaEmpresa}>
          + Nueva Empresa
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm border-0 p-3 mb-4 bg-light">
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0">🔍</span>
          <input
            type="text"
            className="form-control border-start-0 shadow-none"
            placeholder="Buscar por nombre de empresa o sección..."
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

      <div className="card shadow-sm border-0 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Empresa</th>
                <th>Sección</th>
                <th>Contacto</th>
                <th>Ubicación</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-4">Cargando...</td></tr>
              ) : empresasFiltradas.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-4 text-muted">No se encontraron empresas coincidentes.</td></tr>
              ) : (
                empresasFiltradas.map((empresa) => {
                  const idEmpresa = empresa.id_empresa || empresa.id;
                  const imgUrl = empresa.imagen || imagenPorDefecto;

                  return (
                    <tr key={idEmpresa}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img 
                            src={imgUrl} 
                            alt={empresa.nombre} 
                            className="rounded object-fit-cover border" 
                            style={{ width: '45px', height: '45px', flexShrink: 0 }}
                            onError={(e) => { e.currentTarget.src = imagenPorDefecto; }}
                          />
                          <div>
                            <span className="fw-bold d-block">{empresa.nombre}</span>
                            <small className="text-muted">✉️ {empresa.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-secondary">
                          {empresa.seccion?.nombre || 'Sin sección'}
                        </span>
                      </td>
                      <td>
                        <span className="d-block small">📞 {empresa.telefono}</span>
                      </td>
                      <td>
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${empresa.nombre}, ${empresa.direccion}`)}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-decoration-none text-dark fw-medium small"
                        >
                          📍 {empresa.direccion} ↗
                        </a>
                      </td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditar(empresa)}>Editar</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleEliminar(empresa)}>Eliminar</button>
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

export default AdminEmpresas;