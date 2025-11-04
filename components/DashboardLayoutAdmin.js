import Link from "next/link";
import { useRouter } from "next/router";

export default function DashboardLayoutAdmin({ children, usuario }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="logo-box">
          <img src="/valiant.jpg" alt="Logo" className="logo" />
          <h3>Valiant Admin</h3>
        </div>

        <nav>
          <Link href="/Panel-Admin" className="nav-btn">🏠 Inicio</Link>
          <Link href="/Panel-Admin/barberos" className="nav-btn">💈 Barberos</Link>
          <Link href="/Panel-Admin/servicios" className="nav-btn">✂️ Servicios</Link>
          <Link href="/Panel-Admin/clientes" className="nav-btn">👥 Clientes</Link>
          <Link href="/Panel-Admin/reservas" className="nav-btn">📅 Reservas</Link>
          <Link href="/Panel-Admin/reportes" className="nav-btn">📊 Reportes</Link>
          <Link href="/Panel-Admin/configuracion" className="nav-btn">⚙️ Configuración</Link>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="btn-salir">Salir</button>
          <Link href="/" className="btn-volver">← Volver al inicio</Link>
        </div>
      </aside>

      <main className="contenido">
        <header className="dashboard-header">
          <h2>Panel Administrativo</h2>
          <p>{usuario ? `Bienvenido, ${usuario}` : "Administrador"}</p>
        </header>

        <section className="dashboard-content">{children}</section>
      </main>

      <style jsx>{`
        .dashboard-layout {
          display: flex;
          height: 100vh;
          font-family: 'Poppins', sans-serif;
        }
        .sidebar {
          width: 260px;
          background: #212529;
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1rem;
        }
        .logo-box {
          text-align: center;
        }
        .logo {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          margin-bottom: 0.5rem;
        }
        nav {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .nav-btn {
          padding: 0.6rem 1rem;
          border-radius: 6px;
          background: transparent;
          color: #fff;
          text-decoration: none;
          transition: background 0.3s;
        }
        .nav-btn:hover {
          background: #495057;
        }
        .sidebar-footer {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .btn-salir {
          background: #dc3545;
          border: none;
          color: white;
          padding: 0.6rem;
          border-radius: 6px;
          cursor: pointer;
        }
        .btn-volver {
          text-align: center;
          color: #adb5bd;
          font-size: 0.9rem;
        }
        .contenido {
          flex: 1;
          background: #f8f9fa;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }
        .dashboard-header {
          padding: 1rem 2rem;
          background: white;
          border-bottom: 1px solid #dee2e6;
        }
        .dashboard-content {
          padding: 2rem;
        }
      `}</style>
    </div>
  );
}
