import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const SeleccionHorarios = () => {
    const [selectedMaterias, setSelectedMaterias] = useState([]);
    const [franjasHorarias, setFranjasHorarias] = useState([]);
    const [selectedHorarios, setSelectedHorarios] = useState({});
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = 'https://aplicacionbackweb-d5bxb7bvhefjgcd0.canadacentral-01.azurewebsites.net';

    const diasCombinaciones = [
        { id: 1, dias: ['Lunes', 'Miércoles'] },
        { id: 2, dias: ['Martes', 'Jueves'] },
        { id: 3, dias: ['Lunes', 'Miércoles', 'Viernes'] },
        { id: 4, dias: ['Martes', 'Jueves', 'Viernes'] },
        { id: 5, dias: ['Lunes', 'Miércoles', 'Jueves'] },
        { id: 6, dias: ['Martes', 'Miércoles', 'Jueves'] }
    ];

    // Constantes para los límites de IDs
    const ID_LIMITE_MATUTINO = 18; // Las primeras 18 materias

    const getAuthHeaders = useCallback(() => {
        const token = localStorage.getItem('token');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }, []);

    // Función para determinar si una franja horaria es matutina o vespertina
    const esHorarioVespertino = (horaInicio) => {
        const hora = parseInt(horaInicio.split(':')[0]);
        return hora >= 13; // Consideramos vespertino después de la 1 PM
    };

    // Función para determinar si una materia debe ser vespertina basada en su ID
    const requiereHorarioVespertino = (materiaId) => {
        return materiaId > ID_LIMITE_MATUTINO;
    };

    // Función para filtrar franjas horarias según el ID de la materia
    const getFranjasDisponibles = (materiaId) => {
        const debeSerVespertino = requiereHorarioVespertino(materiaId);
        
        return franjasHorarias.filter(franja => {
            const esVespertino = esHorarioVespertino(franja.hora_inicio);
            return debeSerVespertino ? esVespertino : !esVespertino;
        });
    };

    const fetchData = useCallback(async () => {
        try {
            const storedMaterias = JSON.parse(localStorage.getItem('selectedMaterias') || '[]');
            setSelectedMaterias(storedMaterias);

            const franjasResponse = await axios.get(`${API_URL}/api/franjas-horarias`, { headers: getAuthHeaders() });
            console.log('Franjas horarias received:', franjasResponse.data);
            setFranjasHorarias(franjasResponse.data);
        } catch (error) {
            console.error('Error al obtener datos:', error);
            setError('No se pudieron cargar los intervalos de tiempo. Por favor inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    }, [getAuthHeaders]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const checkHorarioConflict = (materiaId, combinacionId, franjaId) => {
        if (!combinacionId || !franjaId) return false;
        const diasSeleccionados = diasCombinaciones.find(c => c.id === parseInt(combinacionId)).dias;

        for (const [existingMateriaId, horario] of Object.entries(selectedHorarios)) {
            if (existingMateriaId === materiaId) continue;
            if (!horario.combinacionId || !horario.franjaId) continue;

            const diasExistentes = diasCombinaciones.find(c => c.id === parseInt(horario.combinacionId)).dias;
            const diasComunes = diasSeleccionados.some(dia => diasExistentes.includes(dia));

            if (diasComunes && parseInt(horario.franjaId) === parseInt(franjaId)) {
                return true;
            }
        }
        return false;
    };

    const handleHorarioSelection = (materiaId, combinacionId, franjaId) => {
        const franjasDisponibles = getFranjasDisponibles(materiaId);

        // Verificar si la franja seleccionada está dentro de las franjas disponibles
        if (franjaId && !franjasDisponibles.some(f => f.franja_id === parseInt(franjaId))) {
            const tipoHorario = requiereHorarioVespertino(materiaId) ? 'vespertino' : 'matutino';
            setError(`Esta materia debe ser programada en horario ${tipoHorario}`);
            return;
        }

        const newHorario = {
            ...selectedHorarios[materiaId],
            combinacionId: combinacionId || selectedHorarios[materiaId]?.combinacionId,
            franjaId: franjaId || selectedHorarios[materiaId]?.franjaId
        };

        if (checkHorarioConflict(materiaId, newHorario.combinacionId, newHorario.franjaId)) {
            setError('Ya existe una materia programada en ese horario');
            return;
        }

        setError(null);
        setSelectedHorarios(prev => ({
            ...prev,
            [materiaId]: newHorario
        }));
    };

    const handleSubmit = async () => {
        if (Object.keys(selectedHorarios).length !== selectedMaterias.length) {
            setError('Seleccione un horario para cada curso.');
            return;
        }

        try {
            const data = selectedMaterias.map(materia => {
                const horario = selectedHorarios[materia.materia_id];
                const diasSeleccionados = diasCombinaciones.find(c => c.id === parseInt(horario.combinacionId)).dias;
                return {
                    materia_id: materia.materia_id,
                    dia_1: diasSeleccionados[0],
                    dia_2: diasSeleccionados[1],
                    dia_3: diasSeleccionados[2] || null,
                    franja_id: parseInt(horario.franjaId),
                    semestre: 1
                };
            });

            await axios.post(`${API_URL}/api/guardar-horarios`, data, { headers: getAuthHeaders() });
            setSuccess('Horarios guardados exitosamente');
            setError(null);
            localStorage.removeItem('selectedMaterias');
        } catch (error) {
            console.error('Error al guardar horarios:', error);
            setError('No se pudieron guardar los horarios. Por favor inténtalo de nuevo.');
            setSuccess(null);
        }
    };

    if (loading) {
        return <div>....Cargando...:</div>;
    }

    return (
        <div className="materias-container">
            <h2 className="titulo-materias">Selección de Horarios</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            {success && <p style={{color: 'green'}}>{success}</p>}
            {selectedMaterias.map((materia) => (
                <div className="materia-item" key={materia.materia_id}>
                    <h3 className="label-materia">
                        {materia.materia_name}
                        <span className="horario-tipo">
                            {requiereHorarioVespertino(materia.materia_id) 
                                ? " (Horario Vespertino)"
                                : " (Horario Matutino)"}
                        </span>
                    </h3>
                    {diasCombinaciones.length > 0 && (
                        <select
                            className="dropdown-horario"
                            value={selectedHorarios[materia.materia_id]?.combinacionId || ""}
                            onChange={(e) =>
                                handleHorarioSelection(materia.materia_id, e.target.value, selectedHorarios[materia.materia_id]?.franjaId)
                            }
                        >
                            <option value="" disabled>
                                Selecciona Días
                            </option>
                            {diasCombinaciones.map((combinacion) => (
                                <option key={combinacion.id} value={combinacion.id}>
                                    {combinacion.dias.join(' y ')}
                                </option>
                            ))}
                        </select>
                    )}
                    <select
                        className="dropdown-horario"
                        value={selectedHorarios[materia.materia_id]?.franjaId || ""}
                        onChange={(e) =>
                            handleHorarioSelection(materia.materia_id, selectedHorarios[materia.materia_id]?.combinacionId, e.target.value)
                        }
                    >
                        <option value="" disabled>
                            Selecciona Horario
                        </option>
                        {getFranjasDisponibles(materia.materia_id).map((franja) => (
                            <option key={franja.franja_id} value={franja.franja_id}>
                                {franja.hora_inicio} - {franja.hora_fin}
                            </option>
                        ))}
                    </select>
                </div>
            ))}
            <button className="boton-guardar" onClick={handleSubmit}>Guardar Selección</button>
        </div>
    );
};

export default SeleccionHorarios;
