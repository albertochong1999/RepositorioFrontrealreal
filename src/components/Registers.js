import React, { useState, useEffect } from 'react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [isUniversityEmail, setIsUniversityEmail] = useState(false);

  const API_URL = 'https://aplicacionbackweb-d5bxb7bvhefjgcd0.canadacentral-01.azurewebsites.net';

  // Validación de correo electrónico de la universidad
  useEffect(() => {
    // Regex para validar el formato de correo de alumnos UACJ
    const universityEmailRegex = /^al\d{6}@alumnos\.uacj\.mx$/;
    setIsUniversityEmail(universityEmailRegex.test(email));
  }, [email]);

  useEffect(() => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    setIsPasswordValid(passwordRegex.test(password));
  }, [password]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validaciones adicionales
    if (!isUniversityEmail) {
      setMessage('Solo se permiten correos de alumnos de la UACJ (@alumnos.uacj.mx)');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }

    if (!isPasswordValid) {
      setMessage('La contraseña no cumple con los requisitos');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          password,
        }),
      });
      
      const result = await response.json();

      if (response.ok) {
        setMessage('Registro exitoso');
        setEmail('');
        setName('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setMessage(result.message || 'Error en el registro');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al conectar con el servidor');
    }
  };

  return (
    <div className="container">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="password-input-container">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setShowPasswordRequirements(true)}
            onBlur={() => setShowPasswordRequirements(false)}
            required
          />
          {showPasswordRequirements && (
            <p className="errpassword-requirementsor">
              La contraseña debe tener al menos 6 caracteres, incluyendo números, letras y signos de puntuación.
            </p>
          )}
          {!isPasswordValid && password && (
            <p className="error">La contraseña no cumple con los requisitos</p>
          )}
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Registrarse</button>
      </form>
      {message && <p className={message === 'Registro exitoso' ? 'success-msg' : 'error'}>{message}</p>}
    </div>
  );
};

export default Register;
