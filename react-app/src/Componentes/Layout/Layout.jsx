import { Outlet } from 'react-router-dom';
import NavbarOffcanvas from './NavbarOffcanvas';
import Footer from './Footer'; // 👈 Importa tu componente Footer

function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarOffcanvas />
      
      {/* El <Outlet /> es el hueco donde React Router cargará tus páginas (Inicio, Centros, etc) */}
      <main className="flex-grow-1">
        <Outlet />
      </main>
      
      {/* Pie de página integrado */}
      <Footer />
    </div>
  );
}

export default Layout;