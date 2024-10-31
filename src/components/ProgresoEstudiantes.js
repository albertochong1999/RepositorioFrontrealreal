import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



const ProgresoEstudiantes = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const API_URL = 'https://aplicacionbackweb-d5bxb7bvhefjgcd0.canadacentral-01.azurewebsites.net';

    useEffect(() => {
        const fetchProgreso = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/api/student-progress`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setEstudiantes(response.data);
                setError(null);
            } catch (err) {
                console.error('Error al cargar datos:', err);
                setError('Error al cargar los datos de progreso');
            }
        };

        fetchProgreso();
    }, []);

    const handleBack = () => {
        navigate('/menu');
    };

    return (
        <div className="materias-container">
            {error ? (
                <div>
                    <p className="error-msg">{error}</p>
                    <button 
                        onClick={handleBack}
                        style={{
                            width: '100%',
                            padding: '15px',
                            backgroundColor: '#FFD700',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginTop: '20px'
                        }}
                    >
                        Volver al Menú
                    </button>
                </div>
            ) : (
                <div>
                    <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '20px' }}>
                        Progreso de Estudiantes
                    </h2>
                    
                    {estudiantes.map(estudiante => (
                        <div 
                            key={estudiante.id} 
                            style={{
                                backgroundColor: '#0047AB',
                                margin: '10px 0',
                                padding: '15px',
                                borderRadius: '5px',
                                color: 'white'
                            }}
                        >
                            <div style={{ marginBottom: '10px' }}>
                                <h3 style={{ marginBottom: '5px' }}>{estudiante.nombre}</h3>
                                <p style={{ margin: '5px 0', fontSize: '0.9em' }}>
                                    <strong>Carrera:</strong> {estudiante.carrera}
                                </p>
                                <p style={{ margin: '5px 0', fontSize: '0.9em' }}>
                                    <strong>Email:</strong> {estudiante.email}
                                </p>
                            </div>
                            
                            <div style={{ marginBottom: '10px' }}>
                                <p style={{ margin: '5px 0' }}>
                                    <strong>Materias Aprobadas:</strong> {estudiante.materiasAprobadas} de {estudiante.totalMaterias}
                                </p>
                            </div>

                            <div style={{
                                width: '100%',
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                borderRadius: '5px',
                                marginTop: '10px'
                            }}>
                                <div style={{
                                    width: `${estudiante.porcentajeAvance}%`,
                                    backgroundColor: '#FFD700',
                                    padding: '5px 0',
                                    borderRadius: '5px',
                                    textAlign: 'center',
                                    color: 'black',
                                    transition: 'width 0.5s ease-in-out'
                                }}>
                                    {estudiante.porcentajeAvance}%
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    <button 
                        onClick={handleBack}
                        style={{
                            width: '100%',
                            padding: '15px',
                            backgroundColor: '#FFD700',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginTop: '20px'
                        }}
                    >
                        Volver al Menú
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProgresoEstudiantes;