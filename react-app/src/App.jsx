import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './Rutas';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // 👈 Añadido el './' para que cargue correctamente tus estilos y fuentes

function App() {
  return <RouterProvider router={router} />;
}

export default App;