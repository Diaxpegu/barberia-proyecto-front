import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'https://barberia-proyecto-back-production-f876.up.railway.app';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${backendUrl}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario: usuario,
          contrasena: contrasena,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || 'Usuario o contraseña incorrectos');
        return;
      }
      if (data.rol === 'jefe') {
        localStorage.setItem('isAdminLoggedIn', 'true');
        localStorage.setItem('adminUser', data.usuario);
        router.push('/Panel-Admin');
      } else if (data.rol === 'barbero') {
        localStorage.setItem('isBarberLoggedIn', 'true');
        localStorage.setItem('barberUser', data.usuario); 
        router.push('/Panel-Barbero');
      } else {
        setError('Rol no reconocido por el servidor.');
      }
    } catch (err) {
      console.error(err);
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <section className="login-container">
      <div className="login-box">
        <h2>Acceso de Personal</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="usuario">Usuario:</label>
            <input
              type="text"
              id="usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="contrasena">Contraseña:</label>
            <input
              type="password"
              id="contrasena"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-login">
            Iniciar Sesión
          </button>
        </form>
        <div className="login-footer">
          <Link href="/" legacyBehavior>
            <a className="btn-back-home">
              <i className="fas fa-home"></i> Volver al Inicio
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
}
