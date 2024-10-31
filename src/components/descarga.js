import React, { useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [downloadError, setDownloadError] = useState('');
    const API_URL = 'https://aplicacionbackweb-d5bxb7bvhefjgcd0.canadacentral-01.azurewebsites.net';

    const handleDownloadDocumentation = async () => {
        setDownloadError('');
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No se encontró token de autenticación');
            }

            const response = await axios.get(`${API_URL}/api/horarios-documentation`, {  // URL actualizada
                headers: {
                    Authorization: `Bearer ${token}`
                },
                responseType: 'blob'
            });

            console.log('Descargando Respuestas: ', response);

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'horarios_documentacion.xlsx');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error descargando documentación:', error);
            setDownloadError(error.response?.data?.message || error.message || 'Error al descargar la documentación');
        }
    };

    return (
        <div>
            <h1>Panel de Administración</h1>
            <button onClick={handleDownloadDocumentation}>
               Descargar información
            </button>
            {downloadError && <p style={{color: 'red'}}>{downloadError}</p>}
        </div>
    );
};

export default AdminDashboard;
