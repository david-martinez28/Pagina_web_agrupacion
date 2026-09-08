import { Link } from 'react-router-dom';
import logoagrupacion from '../../assets/imagenes/logo-agrupacion.png'; 
import logoayuntamiento from '../../assets/imagenes/logo-ayuntamiento.png';

function Footer() {
  return (
    <footer className="bg-light pt-5 pb-4 mt-auto border-top border-secondary">
      <div className="container-xl">
        <div className="row g-4 justify-content-between">
          
          {/* Columna 1: Información institucional */}
          <div className="col-12 col-md-4">
            <h5 className="text-uppercase fw-bold mb-3">AMPAs de Elda</h5>
            <p className="small mb-3">
              Agrupación de Asociaciones de Madres y Padres de Alumnos de Elda. Trabajando conjuntamente por una educación pública de calidad y el apoyo a las familias.
            </p>
            <p className="small mb-1">📍 Elda, Alicante, España</p>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div className="col-12 col-md-3">
            <h5 className="text-uppercase fw-bold mb-3">Contacto</h5>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <p className="mb-0">📧  agrupacionapaselda@gmail.com</p>
              </li>
              <li className="mb-2">
                <p className="mb-0">📞  607 635 483</p>
              </li>
              
            </ul>
          </div>

          {/* Columna 3: Colaboración / Concejalía */}
          <div className="col-12 col-md-4">
            <h5 className="text-uppercase fw-bold mb-3">Colaboración Institucional</h5>
            <div className="d-flex justify-content-center align-items-center gap-5 mb-3">
              <img src={logoagrupacion} alt="Logo Agrupación" className="img-fluid" style={{ maxHeight: '50px' }} />
              <img src={logoayuntamiento} alt="Logo Ayuntamiento" className="img-fluid" style={{ maxHeight: '50px' }} />
            </div>
            <p className="small mb-3 text-center text-md-start">
              Proyecto en colaboración con la Concejalía de Educación del Ayuntamiento de Elda y los centros educativos de la localidad.
            </p>
          </div>

        </div>

        <hr className="my-4 border-secondary" />

        {/* Copyright */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small text-muted">
          <p className="mb-0">&copy; {new Date().getFullYear()} AMPAs de Elda. Todos los derechos reservados.</p>
          <p className="mb-0 mt-2 mt-md-0">Desarrollado para la gestión educativa local.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;