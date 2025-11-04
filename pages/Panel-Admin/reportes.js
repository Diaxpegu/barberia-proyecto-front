import { useEffect, useState } from "react";
import DashboardLayoutAdmin from "../../components/DashboardLayoutAdmin";

export default function ReportesAdmin() {
  const [kpi, setKpi] = useState({ totales: 0, completadas: 0, barberos: 0 });
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://barberia-proyecto-back-production-f876.up.railway.app";

  useEffect(() => {
    const cargar = async () => {
      try {
        const [resAll, resBarberos] = await Promise.all([
          fetch(`${backendUrl}/reservas/detalle/`).then((r) => r.json()),
          fetch(`${backendUrl}/barberos/`).then((r) => r.json()),
        ]);
        const totales = Array.isArray(resAll) ? resAll.length : 0;
        const completadas = (Array.isArray(resAll) ? resAll : []).filter(
          (x) => x.estado === "completado"
        ).length;
        setKpi({ totales, completadas, barberos: resBarberos.length || 0 });
      } catch (e) {
        console.error(e);
      }
    };
    cargar();
  }, [backendUrl]);

  return (
    <DashboardLayoutAdmin usuario="Administrador">
      <h2>Reportes Generales</h2>
      <div className="cards">
        <div className="card"><h4>Reservas Totales</h4><b>{kpi.totales}</b></div>
        <div className="card"><h4>Completadas</h4><b>{kpi.completadas}</b></div>
        <div className="card"><h4>Barberos Activos</h4><b>{kpi.barberos}</b></div>
      </div>

      <style jsx>{`
        .cards {
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(260px,1fr));
          gap: 16px;
          margin-top: 16px;
        }
        .card {
          background: #fff;
          border-radius: 14px;
          padding: 18px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.06);
        }
        .card h4 { margin: 0 0 6px; color: #334155; }
        .card b { font-size: 28px; color: #1d4ed8; }
      `}</style>
    </DashboardLayoutAdmin>
  );
}
