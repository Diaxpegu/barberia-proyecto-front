import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AdminPanel() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [jefes, setJefes] = useState([]);
  const [showJefes, setShowJefes] = useState(false);
  const [showAddJefe, setShowAddJefe] = useState(false);
  const [newJefe, setNewJefe] = useState({
    nombre: '',
    usuario: '',
    contrasena: '',
    rol: 'Jefe de barberos'
  });

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdminLoggedIn');
    const userData = localStorage.getItem('user');
    
    if (isAdmin === 'true' && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    } else {
      router.push('/login');
    }
  }, [router]);

  const cargarJefes = async () => {
    try {
      const response = await fetch('/api/jefes');
      const data = await response.json();
      if (response.ok) {
        setJefes(data.jefes);
      }
    } catch (error) {
      console.error('Error cargando jefes:', error);
    }
  };

  const handleAddJefe = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/jefes/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newJefe),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Jefe agregado exitosamente');
        setNewJefe({ nombre: '', usuario: '', contrasena: '', rol: 'Jefe de barberos' });
        setShowAddJefe(false);
        cargarJefes(); // Recargar la lista
      } else {
        alert(data.message || 'Error al agregar jefe');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!isLoggedIn) {
    return (
      <div className="loading-container">
        <p>Verificando autenticación...</p>
      </div>
    );
  }

  return (
    <section className="admin-panel-container">
      <h2>Panel de Administración</h2>
      <p>Bienvenido, {user?.nombre || user?.username || 'Administrador'}.</p>

      <div className="admin-actions-grid">
        <button 
          className="admin-btn" 
          onClick={() => {
            setShowJefes(!showJefes);
            if (!showJefes) cargarJefes();
          }}
        >
          <i className="fas fa-users"></i> 
          {showJefes ? 'Ocultar Jefes' : 'Mostrar Jefes Registrados'}
        </button>

        <button 
          className="admin-btn"
          onClick={() => setShowAddJefe(true)}
        >
          <i className="fas fa-user-plus"></i> Agregar Nuevo Jefe
        </button>

        <button className="admin-btn">
          <i className="fas fa-cut"></i> Mostrar Barberos Disponibles
        </button>

        <button className="admin-btn">
          <i className="fas fa-book-open"></i> Catálogo de Servicios y Precios
        </button>

        {/* ... otros botones existentes */}
      </div>

      {/* Lista de Jefes */}
      {showJefes && (
        <div className="jefes-section">
          <h3>Jefes Registrados</h3>
          <div className="jefes-list">
            {jefes.map(jefe => (
              <div key={jefe._id} className="jefe-card">
                <h4>{jefe.nombre}</h4>
                <p><strong>Usuario:</strong> {jefe.usuario}</p>
                <p><strong>Rol:</strong> {jefe.rol}</p>
                <p><strong>Fecha creación:</strong> {new Date(jefe.fechaCreacion).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal para agregar nuevo jefe */}
      {showAddJefe && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Agregar Nuevo Jefe</h3>
            <form onSubmit={handleAddJefe}>
              <div className="form-group">
                <label>Nombre completo:</label>
                <input
                  type="text"
                  value={newJefe.nombre}
                  onChange={(e) => setNewJefe({...newJefe, nombre: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Usuario:</label>
                <input
                  type="text"
                  value={newJefe.usuario}
                  onChange={(e) => setNewJefe({...newJefe, usuario: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Contraseña:</label>
                <input
                  type="password"
                  value={newJefe.contrasena}
                  onChange={(e) => setNewJefe({...newJefe, contrasena: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Rol:</label>
                <select
                  value={newJefe.rol}
                  onChange={(e) => setNewJefe({...newJefe, rol: e.target.value})}
                >
                  <option value="Jefe de barberos">Jefe de barberos</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Supervisor">Supervisor</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-confirmar">
                  Agregar Jefe
                </button>
                <button 
                  type="button" 
                  className="btn-cancelar"
                  onClick={() => setShowAddJefe(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-footer-actions">
        <button onClick={handleLogout} className="btn-logout">
          <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
        </button>
        <Link href="/">
          <a className="btn-back-home">
            <i className="fas fa-home"></i> Volver al Inicio
          </a>
        </Link>
      </div>
    </section>
  );
}