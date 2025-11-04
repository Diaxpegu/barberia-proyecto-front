import Link from "next/link";
import { useRouter } from "next/router";

export default function DashboardLayoutAdmin({ usuario = "Admin", children }) {
  const router = useRouter();

  const logout = () => {
    try {
      localStorage.removeItem("usuario");
      localStorage.removeItem("rol");
      localStorage.removeItem("barberUser");
      localStorage.removeItem("barberId");
    } catch (_) {}
    router.push("/login");
  };

  return (
    <div className="dash-wrap">
      <aside className="sidebar">
        <div className="brand">
          <Link href="/Panel-Admin">VALIANT • Admin</Link>
          <small>{usuario}</small>
        </div>

        <nav className="menu">
          <Link href="/Panel-Admin">Inicio</Link>
          <Link href="/Panel-Admin/barberos">Barberos</Link>
          <Link href="/Panel-Admin/clientes">Clientes</Link>
          <Link href="/Panel-Admin/servicios">Servicios</Link>
          <Link href="/Panel-Admin/reservas">Reservas</Link>
          <Link href="/Panel-Admin/reportes">Reportes</Link>
          <Link href="/Panel-Admin/configuracion">Configuración</Link>
        </nav>

        <button className="btn-logout" onClick={logout}>
          Cerrar sesión
        </button>
      </aside>

      <main className="content">{children}</main>

      <style jsx>{`
        .dash-wrap {
          display: grid;
          grid-template-columns: 280px 1fr;
          min-height: 100vh;
          background: #f7f8fb;
        }
        .sidebar {
          background: #0f172a;
          color: #fff;
          display: flex;
          flex-direction: column;
          padding: 20px;
          gap: 24px;
        }
        .brand a {
          color: #fff;
          font-weight: 700;
          font-size: 18px;
        }
        .brand small {
          display: block;
          opacity: 0.6;
          margin-top: 6px;
        }
        .menu {
          display: grid;
          gap: 10px;
        }
        .menu a {
          color: #e2e8f0;
          padding: 10px 12px;
          border-radius: 8px;
          transition: 0.15s;
        }
        .menu a:hover {
          background: #1f2937;
        }
        .btn-logout {
          margin-top: auto;
          background: #ef4444;
          border: 0;
          color: #fff;
          padding: 10px 12px;
          border-radius: 8px;
          cursor: pointer;
        }
        .content {
          padding: 28px 32px;
        }
      `}</style>
    </div>
  );
}
