// Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; // Asegúrate de crear este archivo CSS

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implementa aquí la lógica de cierre de sesión
    localStorage.removeItem('token'); // Asumiendo que usas un token para la autenticación
    navigate('/login'); // Redirige al usuario a la página de login
  };

  return (
    <nav className="navbar">
      <Link to="/menu" className="navbar-menu">Menú</Link>
      <button onClick={handleLogout} className="navbar-logout">Cerrar Sesión</button>
    </nav>
  );
};

export default Navbar;