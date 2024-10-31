import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Menu = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const fetchUserInfo = () => {
            const userRole = localStorage.getItem('userRole');
            const storedUserName = localStorage.getItem('userName');
            const token = localStorage.getItem('token');

            console.log('Retrieved from localStorage:', { userRole, storedUserName, token });

            setIsAdmin(userRole === 'admin');
            setUserName(storedUserName || '');
        };

        fetchUserInfo();
        const intervalId = setInterval(fetchUserInfo, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const handleViewProgress = () => {
        navigate('/progreso-estudiantes');
    };

    const handlePersonalProgress = () => {
        navigate('/mi-progreso');
    };

    const handleChooseSubjects = () => {
        navigate('/SeleccionMateriashorarios');
    };

    const handleDownloadData = () => {
        navigate('/Descarga');
    };

    const handleUpdateSubjects = () => {
        navigate('/seleccion-materias');
    };

    return (
        <div className="container">
            <h1>Hola, {userName || 'Usuario'}!</h1>
            <h2>Menú Principal</h2>
            
            {/* Botones para estudiantes */}
            {!isAdmin && (
                <>
                    <div>
                        <button onClick={handleUpdateSubjects}>
                            Generar Historial
                        </button>
                    </div>
                    <div>
                        <button onClick={handlePersonalProgress}>
                            Ver Mi Progreso
                        </button>
                    </div>
                    <div>
                        <button onClick={handleChooseSubjects}>
                            Selección de Horarios
                        </button>
                    </div>
                </>
            )}

            {/* Botones para administradores */}
            {isAdmin && (
                <>
                    <div>
                        <button onClick={handleViewProgress}>
                            Ver Progreso Estudiantes
                        </button>
                    </div>
                    <div>
                        <button onClick={handleChooseSubjects}>
                            Selección de Horarios
                        </button>
                    </div>
                    <div>
                        <button onClick={handleDownloadData}>
                            Descargar Información
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Menu;