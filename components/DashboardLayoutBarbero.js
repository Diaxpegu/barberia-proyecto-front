import Link from "next/link";
import { useRouter } from "next/router";

export default function DashboardLayoutBarbero({ children, usuario }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("barberUser");
    localStorage.removeItem("barberId");
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
    router.push("/login");
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Panel del Barbero</h2>
          <p className="usuario">👤 {usuario || "Barbero"}</p>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link href="/Panel-Barbero">Agenda</Link>
            </li>
            <li>
              <Link href="/Panel-Barbero/historial">Historial</Link>
            </li>
            <li>
              <Link href="/Panel-Barbero/perfil">Perfil</Link>
            </li>
          </ul>
        </nav>

        <div className="logout-container">
          <button onClick={handleLogout} className="btn-logout">
            <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="main-content">{children}</main>

      <style jsx>{`
        .dashboard-layout {
          display: grid;
          grid-template-columns: 260px 1fr;
          min-height: 100vh;
          background: #f4f6f8;
        }

        .sidebar {
          background: #1e1e2f;
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 2rem 1.5rem;
        }

        .sidebar-header h2 {
          margin: 0 0 0.5rem;
          font-size: 1.5rem;
          font-weight: bold;
          color: #ffffff;
        }

        .usuario {
          font-size: 0.95rem;
          color: #cfcfcf;
          margin-bottom: 1rem;
        }

        .sidebar-nav ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .sidebar-nav li {
          margin: 1rem 0;
        }

        .sidebar-nav a {
          color: #cfcfcf;
          text-decoration: none;
          font-weight: 500;
          display: block;
          transition: color 0.3s ease;
        }

        .sidebar-nav a:hover {
          color: #ffffff;
        }

        .logout-container {
          margin-top: auto;
        }

        .btn-logout {
          background: #e74c3c;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.3s ease;
          width: 100%;
          text-align: center;
        }

        .btn-logout:hover {
          background: #c0392b;
        }

        .main-content {
          padding: 2rem;
          background: #f4f6f8;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
}
