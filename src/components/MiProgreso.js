import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MiProgreso = () => {
    const [progreso, setProgreso] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const API_URL = 'https://aplicacionbackweb-d5bxb7bvhefjgcd0.canadacentral-01.azurewebsites.net';
    useEffect(() => {
        const fetchProgreso = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/api/mi-progreso`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setProgreso(response.data);
            } catch (err) {
                console.error('Error:', err);
                setError('Error al cargar tu progreso');
            }
        };

        fetchProgreso();
    }, []);

    const handleBack = () => {
        navigate('/menu');
    };

    if (error) {
        return (
            <div className="materias-container">
                <p className="error-msg">{error}</p>
                <button onClick={handleBack} className="boton-guardar">
                    Volver al Menú
                </button>
            </div>
        );
    }

    if (!progreso) {
        return (
            <div className="materias-container">
                <p>...Cargando tu progreso...</p>
            </div>
        );
    }

    return (
        <div className="materias-container">
            <h2>Mi Progreso Académico</h2>
            
            <div className="progreso-card">
                <p>{progreso.nombre}</p>
                <p><strong>Carrera:</strong> {progreso.carrera}</p>
                <p><strong>Email:</strong> {progreso.email}</p>
                
                <div className="progreso-stats">
                    <p>
                        <strong>Materias Aprobadas:</strong> {progreso.materiasAprobadas} de {progreso.totalMaterias}
                    </p>
                    <p>
                        <strong>Créditos Acumulados:</strong> {progreso.creditosAcumulados} de {progreso.totalCreditos}
                    </p>
                </div>

                <div className="progress-bar-container">
                    <div 
                        className="progress-bar"
                        style={{
                            width: `${progreso.porcentajeAvance}%`,
                            backgroundColor: '#FFD700'
                        }}
                    >
                        {progreso.porcentajeAvance}%
                    </div>
                </div>
            </div>

            <button onClick={handleBack} className="boton-guardar">
                Volver al Menú
            </button>
        </div>
    );
};

export default MiProgreso;