import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRecovering, setIsRecovering] = useState(false);
    const navigate = useNavigate();
    const API_URL = 'https://aplicacionbackweb-d5bxb7bvhefjgcd0.canadacentral-01.azurewebsites.net';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setErrorMessage('Por favor, rellena todos los campos');
            return;
        }
        const loginData = { email, password };
        setLoading(true);
    
        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
              })
            const data = await response.json();
            console.log('Login response:', data);  

            if (response.ok) {
                setErrorMessage('');
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('userName', data.userName || data.name);
                localStorage.setItem('userRole', data.role);

                // Verificar que se guardó correctamente
                console.log('Stored in localStorage:', {
                    token: localStorage.getItem('token'),
                    userId: localStorage.getItem('userId'),
                    userName: localStorage.getItem('userName'),
                    userRole: localStorage.getItem('userRole')
                });

                navigate('/menu');
            } else {
                setErrorMessage(data.message || 'Correo o contraseña incorrectos');
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            setErrorMessage('Error al conectar con el servidor. Por favor, inténtalo de nuevo más tarde.');
        } finally {
            setLoading(false);
        }
    };

    const handleRecoverPassword = async (e) => {
        e.preventDefault();
        if (!email) {
            setErrorMessage('Por favor, ingresa tu correo electrónico');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            
            if (response.ok) {
                setSuccessMessage('Se ha enviado un correo con las instrucciones para recuperar tu contraseña.');
                setErrorMessage('');
                // Opcional: redirigir al usuario después de unos segundos
                setTimeout(() => {
                    setIsRecovering(false);
                }, 5000);
            } else {
                setErrorMessage(data.message || 'Error al procesar la solicitud');
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            setErrorMessage('Error al conectar con el servidor. Por favor, inténtalo de nuevo más tarde.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="login-container">
                <h2>{isRecovering ? 'Recuperar Contraseña' : 'Iniciar Sesión'}</h2>
                {isRecovering ? (
                    <form onSubmit={handleRecoverPassword}>
                        <div className="input-group">
                            <label htmlFor="recover-email">Correo Electrónico</label>
                            <input
                                type="email"
                                id="recover-email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Procesando...' : 'Recuperar Contraseña'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="email">Correo Electrónico</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Iniciando sesión...' : 'Ingresar'}
                        </button>
                    </form>
                )}
                {errorMessage && <p className="error">{errorMessage}</p>}
                {successMessage && <p className="success">{successMessage}</p>}
                <button onClick={() => setIsRecovering(!isRecovering)} className="toggle-recover">
                    {isRecovering ? 'Volver al inicio de sesión' : '¿Olvidaste tu contraseña?'}
                </button>
            </div>
        </div>
    );
};

export default Login;