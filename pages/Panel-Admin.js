import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AdminPanel() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Verificar si el administrador está logueado
    const verificacion = localStorage.getItem('isAdminLoggedIn');
    if (verificacion === 'true') {
      setIsLoggedIn(true);
    } else {
      router.push('/login'); // Redirigir si no está logueado
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    router.push('/login');
  };

  if (!isLoggedIn) {
    return <p>Redirigiendo al login...</p>;
  }

  return (
    <section className="admin-panel-container">
      <h2>Panel de Administración</h2>
      <p>Bienvenido, Administrador.</p>

      <div className="admin-actions-grid">
        <button className="admin-btn">
          <i className="fas fa-users"></i> Mostrar Clientes Registrados
        </button>
        <button className="admin-btn">
          <i className="fas fa-cut"></i> Mostrar Barberos Disponibles
        </button>
        <button className="admin-btn">
          <i className="fas fa-book-open"></i> Catálogo de Servicios y Precios
        </button>
        <button className="admin-btn">
          <i className="fas fa-book-open"></i> Catálogo de Productos y Precios
        </button>
        <button className="admin-btn">
          <i className="fas fa-calendar-alt"></i> Bloques de Disponibilidad Libres
        </button>
        <button className="admin-btn">
          <i className="fas fa-clock"></i> Reservas Pendientes
        </button>
        <button className="admin-btn">
          <i className="fas fa-ban"></i> Bloquear Horario de Barbero
        </button>
        <button className="admin-btn">
          <i className="fas fa-check-circle"></i> Confirmar una Reserva
        </button>
        <button className="admin-btn">
          <i className="fas fa-times-circle"></i> Cancelar Reserva
        </button>
        <button className="admin-btn">
          <i className="fas fa-list-alt"></i> Todas las Reservas (Detalle Completo)
        </button>
      </div>

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