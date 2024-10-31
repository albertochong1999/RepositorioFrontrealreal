import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Registers';
import Home from './pages/home';
import Menu from './pages/menu';
import SeleccionMaterias from './components/seleccion-materias';
import SeleccionHorarios from './components/SeleccionHorarios';
import SeleccionMateriashorarios from './components/SeleccionMateriashorarios';
import Descarga from './components/descarga';
import ProgresoEstudiantes from './components/ProgresoEstudiantes';
import MiProgreso from './components/MiProgreso';
import './App.css';
import './Agic.css';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const showNavbar = !['/login', '/register', '/'].includes(location.pathname) && isAuthenticated;

  return (
    <>
      {showNavbar && <Navbar />}
      <div className={showNavbar ? 'content-with-navbar' : ''}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/seleccion-materias" element={<SeleccionMaterias />} />
          <Route path="/SeleccionHorarios" element={<SeleccionHorarios />} />
          <Route path="/SeleccionMateriashorarios" element={<SeleccionMateriashorarios />} />
          <Route path="/descarga" element={<Descarga />} />
          <Route path="/progreso-estudiantes" element={<ProgresoEstudiantes />} />
          <Route path="/mi-progreso" element={<MiProgreso />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <AppContent />
      </div>
    </Router>
  );
}

export default App;