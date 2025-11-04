import { useEffect, useState } from "react";
import DashboardLayoutAdmin from "../../components/DashboardLayoutAdmin";

export default function ReportesAdmin() {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://barberia-proyecto-back-production-f876.up.railway.app";

  const [estadisticas, setEstadisticas] = useState({
    reservasTotales: 0,
    reservasCompletadas: 0,
    barberosActivos: 0,
  });

  useEffect(() => {
    const cargarReportes = async () => {
      try {
        const [todas, completadas, barberos] = await Promise.all([
          fetch(`${backendUrl}/reservas/detalle/`).then((r) => r.json()),
          fetch(`${backendUrl}/barberos/`).then((r) => r.json()),
        ]);

        const reservasTotales = todas.length;
        const reservasCompletadas = todas.filter((r) => r.estado === "completado").length;
        const barberosActivos = barberos.length;

        setEstadisticas({ reservasTotales, reservasCompletadas, barberosActivos });
      } catch (err) {
        console.error("Error cargando reportes:", err);
      }
    };
    cargarReportes();
  }, [backendUrl]);

  return (
    <DashboardLayoutAdmin usuario="Administrador">
      <h2>Reportes Generales</h2>
      <div className="cards-grid">
        <div className="card">
          <h4>Reservas Totales</h4>
          <span>{estadisticas.reservasTotales}</span>
        </div>
        <div className="card">
          <h4>Completadas</h4>
          <span>{estadisticas.reservasCompletadas}</span>
        </div>
        <div className="card">
          <h4>Barberos Activos</h4>
          <span>{estadisticas.barberosActivos}</span>
        </div>
      </div>

      <style jsx>{`
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }
        .card {
          padding: 1.5rem;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
          text-align: center;
        }
        h4 {
          margin-bottom: 0.5rem;
          color: #333;
        }
        span {
          font-size: 1.8rem;
          font-weight: bold;
          color: #007bff;
        }
      `}</style>
    </DashboardLayoutAdmin>
  );
}
