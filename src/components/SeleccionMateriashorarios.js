import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SeleccionMateriasHorarios = () => {
    const [availableMaterias, setAvailableMaterias] = useState([]);
    const [selectedMaterias, setSelectedMaterias] = useState([]);
    const [userCredits, setUserCredits] = useState(0);
    const [passedCourses, setPassedCourses] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

  const API_URL = 'https://aplicacionbackweb-d5bxb7bvhefjgcd0.canadacentral-01.azurewebsites.net';  // URL base actualizada

    const getAuthHeaders = useCallback(() => {
        const token = localStorage.getItem('token');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }, []);

    const fetchUserData = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/user-academic-info`, { headers: getAuthHeaders() });  // URL actualizada
            setUserCredits(response.data.totalCredits);
            setPassedCourses(response.data.approvedSubjects || []);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError('Failed to load your academic information. Please try again.');
        }
    }, [getAuthHeaders]);

    const fetchAvailableMaterias = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/all-subjects`, { headers: getAuthHeaders() });  // URL actualizada
            const filteredMaterias = response.data
                .filter(materia => userCredits >= (materia.requerimiento_Creditos || 0))
                .reduce((acc, current) => {
                    const x = acc.find(item => item.materia_id === current.materia_id);
                    if (!x) {
                        return acc.concat([current]);
                    } else {
                        return acc;
                    }
                }, []);
            setAvailableMaterias(filteredMaterias);
            console.log('Materias filtradas:', filteredMaterias);
        } catch (error) {
            console.error('Error al recuperar materias disponibles:', error);
            setError('No se pueden cargar las materias disponibles. Por favor inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    }, [getAuthHeaders, userCredits]);

    useEffect(() => {
        const loadData = async () => {
            await fetchUserData();
            await fetchAvailableMaterias();
        };
        loadData();
    }, [fetchUserData, fetchAvailableMaterias]);

    const isEligibleForCourse = (materia) => {
        return !materia.prerequisito_materia_id || passedCourses.includes(materia.prerequisito_materia_id);
    };

    const handleSelect = (materia) => {
        if (!isEligibleForCourse(materia)) {
            const prerequisiteMateria = availableMaterias.find(m => m.materia_id === materia.prerequisito_materia_id);
            setError(`No puedes llevar ${materia.materia_name} porque te falta aprobar ${prerequisiteMateria ? prerequisiteMateria.materia_name : 'un prerrequisito'}.`);
            return;
        }

        setSelectedMaterias(prev => {
            const isAlreadySelected = prev.some(m => m.materia_id === materia.materia_id);
            if (isAlreadySelected) {
                return prev.filter(m => m.materia_id !== materia.materia_id);
            } else {
                return [...prev, materia];
            }
        });
        setError(null);
    };

    const handleSubmit = () => {
        if (selectedMaterias.length === 0) {
            setError('Por favor, selecciona al menos una materia.');
            return;
        }
        localStorage.setItem('selectedMaterias', JSON.stringify(selectedMaterias));
        navigate('/SeleccionHorarios');
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="materias-container">
            <h2>Materias Disponibles</h2>
            <p>Créditos acumulados: {userCredits}</p>
            {error && <p className="error-msg">{error}</p>}
            {availableMaterias.length > 0 ? (
                <div className="materias-grid">
                    {availableMaterias.map(materia => (
                        <div key={materia.materia_id} className="materia-item">
                            <input
                                className="checkbox-materia"
                                type="checkbox"
                                id={`materia-${materia.materia_id}`}
                                checked={selectedMaterias.some(m => m.materia_id === materia.materia_id)}
                                onChange={() => handleSelect(materia)}
                            />
                            <label 
                                className={`label-materia ${!isEligibleForCourse(materia) ? 'disabled' : ''}`}
                                htmlFor={`materia-${materia.materia_id}`}
                            >
                                {materia.materia_name} (Créditos: {materia.credits}, Req. Créditos: {materia.requerimiento_Creditos || 0})
                                {!isEligibleForCourse(materia) && 
                                    <span className="prerequisite-warning"> (Prerrequisito no cumplido)</span>
                                }
                            </label>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-materias-msg">No hay materias disponibles para inscripción en este momento.</p>
            )}
            <button 
                className="boton-guardar" 
                onClick={handleSubmit} 
                disabled={selectedMaterias.length === 0}
            >
                Siguiente: Seleccionar Horarios
            </button>
        </div>
    );
};

export default SeleccionMateriasHorarios;
