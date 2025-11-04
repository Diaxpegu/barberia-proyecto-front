import Link from "next/link";
import { useRouter } from "next/router";

export default function DashboardLayoutAdmin({ usuario, children }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
    localStorage.removeItem("barberUser");
    localStorage.removeItem("barberId");
    router.push("/login");
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <p className="user-info">👤 {usuario}</p>
        <nav>
          <Link href="/Panel-Admin">🏠 Inicio</Link>
          <Link href="/Panel-Admin/barberos">💈 Barberos</Link>
          <Link href="/Panel-Admin/clientes">👥 Clientes</Link>
          <Link href="/Panel-Admin/servicios">✂️ Servicios</Link>
          <Link href="/Panel-Admin/reservas">📅 Reservas</Link>
          <Link href="/Panel-Admin/reportes">📊 Reportes</Link>
          <Link href="/Panel-Admin/configuracion">⚙️ Configuración</Link>
        </nav>
        <button onClick={handleLogout} className="btn-logout">
          🚪 Cerrar Sesión
        </button>
      </aside>

      <main className="dashboard-content">{children}</main>

      <style jsx>{`
        .dashboard-container {
          display: flex;
          min-height: 100vh;
          background: #f9fafb;
        }
        .sidebar {
          width: 240px;
          background: #111827;
          color: white;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        nav {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }
        nav a {
          color: #e5e7eb;
          text-decoration: none;
          transition: color 0.2s;
        }
        nav a:hover {
          color: #60a5fa;
        }
        .btn-logout {
          background: #ef4444;
          color: white;
          border: none;
          padding: 0.6rem;
          border-radius: 6px;
          cursor: pointer;
          margin-top: 2rem;
        }
      `}</style>
    </div>
  );
}
