import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="container">
        <div className="home-container">
            <h1>Bienvenido</h1>
            <div className="button-group">
                <Link to="/login">
                    <button>Iniciar Sesión</button>
                </Link>
                <Link to="/register">
                    <button>Registrarse</button>
                </Link>
            </div>
        </div>
    </div>
    );
};

export default Home;
