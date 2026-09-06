import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
  // Comprobamos si existe el token en el almacenamiento local
  const token = localStorage.getItem('token');

  // Si no hay token, lo redirigimos automáticamente a la página de login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si sí hay token, permitimos que se rendericen las rutas hijas (el panel de admin)
  return <Outlet />;
}

export default ProtectedRoute;