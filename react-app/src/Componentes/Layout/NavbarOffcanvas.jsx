import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './navbar.css'; // Importa el archivo CSS para estilos personalizados
import logoagrupacion from '../../assets/imagenes/logo-agrupacion.png';
function NavbarOffcanvas() {
    // Estado para controlar si el menú lateral está abierto o cerrado en móvil
    const [abierto, setAbierto] = useState(false);
    
    // Estado para saber si el administrador está logueado
    const [isAuth, setIsAuth] = useState(false);
    
    // Hook de React Router para detectar cambios de ruta
    const location = useLocation();

    // Cada vez que cambia la ruta (por ejemplo, al hacer login o logout), comprobamos el token
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuth(!!token); // true si hay token, false si no hay
    }, [location]);

    const abrirCerrar = () => setAbierto(!abierto);
    const cerrarMenu = () => setAbierto(false);

    return (
        <>
            {/* BARRA SUPERIOR FIJA */}
            <nav className="navbar navbar-expand-lg navbar-dark  sticky-top shadow-sm navbar-custom">
                <div className="container-xl d-flex justify-content-between align-items-center">

                    {/* LOGO Y NOMBRE */}
                    <Link className="navbar-brand d-flex align-items-center gap-2" to="/" onClick={cerrarMenu}>
                        <span className="fs-5 text-uppercase fw-light">
                            <img src={logoagrupacion} alt="Logo Agrupación" className="" style={{ maxHeight: '50px' }} />
                            Agrupacion local de ampas de elda
                        </span>
                    </Link>

                    {/* --- MENÚ DE ESCRITORIO --- */}
                    <div className="collapse navbar-collapse d-none d-lg-flex w-100">
                        {/* Enlaces principales alineados a la izquierda */}
                        <ul className="navbar-nav align-items-center gap-4 mb-2 mb-lg-0 ms-4">
                            <li className="nav-item">
                                <Link className="nav-link" to="/" onClick={cerrarMenu}>Inicio</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/centros" onClick={cerrarMenu}>Directorio de Centros</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/concejalia" onClick={cerrarMenu}>Concejalía de Educación</Link>
                            </li>
                            
                            <li className="nav-item">
                                <Link className="nav-link" to="/criterios-evaluacion" onClick={cerrarMenu}>Criterios de Evaluación</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/secciones" onClick={cerrarMenu}>Carnet Socio</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/calendario-matriculaciones" onClick={cerrarMenu}>Calendario de Matriculaciones</Link>
                            </li>   
                        </ul>

                        {/* --- BOTÓN DE ADMINISTRACIÓN (ESCRITORIO) DINÁMICO --- */}
                        <ul className="navbar-nav ms-auto align-items-center">
                            <li className="nav-item">
                                {isAuth ? (
                                    <Link to="/admin/dashboard" className="btn btn-light btn-sm px-3 fw-bold" onClick={cerrarMenu}>
                                        Panel Admin
                                    </Link>
                                ) : (
                                    <Link to="/login" className="btn btn-outline-light btn-sm px-3" onClick={cerrarMenu}>
                                        Administración
                                    </Link>
                                )}
                            </li>
                        </ul>
                    </div>

                    {/* BOTÓN HAMBURGUESA (Visible solo en móviles) */}
                    <button
                        className="navbar-toggler border-0 d-lg-none"
                        type="button"
                        onClick={abrirCerrar}
                        aria-label="Alternar navegación"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                </div>
            </nav>

            {/* MENÚ OFFCANVAS (PANEL LATERAL SOLO MÓVIL) */}
            <div
                className={`offcanvas offcanvas-end text-bg-dark ${abierto ? 'show' : ''} d-lg-none`}
                tabIndex="-1"
                style={{
                    visibility: abierto ? 'visible' : 'hidden',
                    transition: 'transform 0.3s ease-in-out'
                }}
            >
                {/* CABECERA DEL MENÚ */}
                <div className="offcanvas-header border-bottom border-secondary">
                    <h5 className="offcanvas-title text-uppercase fw-light">
                        Menú Principal
                    </h5>
                    <button
                        type="button"
                        className="btn-close btn-close-white"
                        onClick={cerrarMenu}
                        aria-label="Cerrar"
                    ></button>
                </div>

                {/* ENLACES DEL MENÚ MÓVIL */}
                <div className="offcanvas-body d-flex flex-column">
                    <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                        <li className="nav-item mb-3">
                            <Link className="nav-link fs-5" to="/" onClick={cerrarMenu}>Inicio</Link>
                        </li>
                        <li className="nav-item mb-3">
                            <Link className="nav-link fs-5" to="/centros" onClick={cerrarMenu}>Directorio de Centros</Link>
                        </li>
                        <li className="nav-item mb-3">
                            <Link className="nav-link fs-5" to="/concejalia" onClick={cerrarMenu}>Concejalía de Educación</Link>
                        </li>
                        
                        <li className="nav-item mb-3">
                            <Link className="nav-link fs-5" to="/criterios-evaluacion" onClick={cerrarMenu}>Criterios de Evaluación</Link>
                        </li>
                        <li className="nav-item mb-3">
                            <Link className="nav-link fs-5" to="/secciones" onClick={cerrarMenu}>Secciones</Link>
                        </li>
                        <li className="nav-item mb-3">
                            <Link className="nav-link fs-5" to="/calendario-matriculaciones" onClick={cerrarMenu}>Calendario de Matriculaciones</Link>
                        </li>
                    </ul>

                    {/* --- BOTÓN DE ADMINISTRACIÓN (MÓVIL) DINÁMICO --- */}
                    <div className="mt-auto border-top border-secondary pt-4">
                        {isAuth ? (
                            <Link to="/admin/dashboard" className="btn btn-light w-100 fw-bold" onClick={cerrarMenu}>
                                Ir al Panel Admin
                            </Link>
                        ) : (
                            <Link to="/login" className="btn btn-outline-light w-100" onClick={cerrarMenu}>
                                Área de Administración
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* CAPA OSCURA DE FONDO (BACKDROP PARA MÓVIL) */}
            {abierto && (
                <div
                    className="offcanvas-backdrop fade show d-lg-none"
                    onClick={cerrarMenu}
                    style={{ zIndex: 1040 }}
                ></div>
            )}
        </>
    );
}

export default NavbarOffcanvas;