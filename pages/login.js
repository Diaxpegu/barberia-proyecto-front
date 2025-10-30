import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {
  const [Nombre, EstablecerNombreUsuario] = useState('');
  const [Contraseña, EstablecerContraseña] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('https://back-production-57ce.up.railway.app/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: Nombre, password: Contraseña })
      });

      if (res.ok) {
        // Login exitoso
        localStorage.setItem('isAdminLoggedIn', 'true');
        router.push('/Panel-Admin');
      } else {
        const data = await res.json();
        setError(data.detail || 'Usuario o contraseña incorrectos');
      }
    } catch (err) {
      console.error(err);
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <section className="login-container">
      <div className="login-box">
        <h2>Acceso de Administrador</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="Nombre">Usuario:</label>
            <input
              type="text"
              id="Nombre"
              name="Nombre"
              value={Nombre}
              onChange={(e) => EstablecerNombreUsuario(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="Contraseña">Contraseña:</label>
            <input
              type="password"
              id="Contraseña"
              name="Contraseña"
              value={Contraseña}
              onChange={(e) => EstablecerContraseña(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-login">
            <i className="fas fa-sign-in-alt"></i> Iniciar Sesión
          </button>
        </form>
        <div className="login-footer">
          <Link href="/">
            <a className="btn-back-home">
              <i className="fas fa-home"></i> Volver al Inicio
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
}
