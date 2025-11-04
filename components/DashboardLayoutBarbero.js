import Link from "next/link";
import { useRouter } from "next/router";

export default function DashboardLayoutBarbero({ usuario, children }) {
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
        <h2>Panel Barbero</h2>
        <p className="user-info">✂️ {usuario}</p>
        <nav>
          <Link href="/Panel-Barbero">📅 Mi Agenda</Link>
          <Link href="/Panel-Barbero/historial">📖 Historial</Link>
          <Link href="/Panel-Barbero/perfil">👤 Perfil</Link>
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
          background: #f3f4f6;
        }
        .sidebar {
          width: 240px;
          background: #1e3a8a;
          color: white;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        nav {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        nav a {
          color: #dbeafe;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        nav a:hover {
          color: #93c5fd;
        }
        .btn-logout {
          background: #ef4444;
          color: white;
          border: none;
          padding: 0.6rem;
          border-radius: 6px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
