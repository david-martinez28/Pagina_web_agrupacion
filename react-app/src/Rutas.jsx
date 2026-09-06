import { createBrowserRouter } from 'react-router-dom';

// --- IMPORTACIONES PÚBLICAS ---
import Layout from './Componentes/Layout/Layout';
import PublicacionesLista from './Componentes/Inicio/PublicacionesLista';
import NoticiaDetalle from './Componentes/NOticiaDetalle/NoticiaDetalle';
import CentrosLista from './Componentes/Centro/CentrosLista';
import CentroDetalle from './Componentes/CentroDetalles/CentroDetalle';
import ConcejaliaDetalle from './Componentes/Concejalia/ConcejaliaDEtalle';
import CriteriosEvaluacion from './Componentes/CriteriosEvaluacion/CriteriosEvaluacion';
import SeccionesLista from './Componentes/Secciones/SeccionesLista';
import EmpresasPorSeccion from './Componentes/Secciones/SeccionesPorSeccion';
import CalendarioMatriculaciones from './Componentes/Calendario/CalendarioMatriculaciones';

// --- IMPORTACIONES DE AUTENTICACIÓN Y ADMINISTRACIÓN ---
import Login from './Componentes/Login/Login'; 
import ProtectedRoute from './Componentes/Login/ProtectedRoute'; 
import Dashboard from './Componentes/Admin/Dashboard';
import AdminNoticias from './Componentes/Admin/AdminNoticias';
import AdminEmpresas from './Componentes/Admin/AdminEmpresas';
import AdminCentros from './Componentes/Admin/AdminCentros';
import AdminSecciones from './Componentes/Admin/AdminSecciones'; 
import AdminConcejalia from './Componentes/Admin/AdminConcejalia'; 
import AdminCriterios from './Componentes/Admin/AdminCriterios';
import AdminCalendario from './Componentes/Admin/AdminCalendario'; 


const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // El Layout envuelve todo, por lo que el Navbar y Footer siempre se verán
    children: [
      
      // ==========================================
      // 1. RUTAS PÚBLICAS
      // ==========================================
      {
        index: true, // Ruta por defecto ('/')
        element: <PublicacionesLista />,
      },
      {
        path: 'noticias/:id',
        element: <NoticiaDetalle />,
      },
      {
        path: 'centros',
        element: <CentrosLista />,
      },
      {
        path: 'centros/:id',
        element: <CentroDetalle />,
      },
      {
        path: 'concejalia',
        element: <ConcejaliaDetalle />,
      },
      {
        path: 'criterios-evaluacion',
        element: <CriteriosEvaluacion />,
      }, 
      {
        path: 'secciones',
        element: <SeccionesLista />,
      },
      {
        path: 'secciones/:id',
        element: <EmpresasPorSeccion />,
      },
      {
        path: 'calendario-matriculaciones',
        element: <CalendarioMatriculaciones />,
      },
      
      
      // ==========================================
      // 2. RUTA DE ACCESO (LOGIN)
      // ==========================================
      {
        path: 'login',
        element: <Login />,
      },

      // ==========================================
      // 3. RUTAS PRIVADAS DE ADMINISTRACIÓN
      // ==========================================
      {
        path: 'admin',
        element: <ProtectedRoute />, // El "vigilante" que exige el Token
        children: [
          {
            path: 'dashboard',
            element: <Dashboard />,
          },
          {
            path: 'noticias',
            element: <AdminNoticias />,
          },
          {
            path: 'empresas',
            element: <AdminEmpresas />,
          },
          {
            path: 'centros',
            element: <AdminCentros />,
          },
          {
            path: 'secciones',
            element: <AdminSecciones />, 
          },
          {
            path: 'concejalia',
            element: <AdminConcejalia />, 
          },
          {
            path: 'criterios',
            element: <AdminCriterios />, 
          },
          {
            path: 'calendario',
            element: <AdminCalendario />, 
          }
        ]
      }
    ]
  }
]);

export default router;