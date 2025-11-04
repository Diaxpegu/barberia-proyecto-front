import { useEffect, useState } from "react";
import DashboardLayoutAdmin from "@/components/DashboardLayoutAdmin";

export default function PanelAdmin() {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://barberia-proyecto-back-production-f876.up.railway.app";

  const [resumen, setResumen] = useState({ clientes: 0, barberos: 0, reservas: 0 });

  useEffect(() => {
    const cargarResumen = async () => {
      try {
        const [clientes, barberos, reservas] = await Promise.all([
          fetch(`${backendUrl}/clientes/`).then((r) => r.json()),
          fetch(`${backendUrl}/barberos/`).then((r) => r.json()),
          fetch(`${backendUrl}/reservas/pendientes/`).then((r) => r.json()),
        ]);
        setResumen({
          clientes: clientes.length,
          barberos: barberos.length,
          reservas: reservas.length,
        });
      } catch (err) {
        console.error("Error al cargar resumen:", err);
      }
    };
    cargarResumen();
  }, [backendUrl]);

  return (
    <DashboardLayoutAdmin usuario="Administrador">
      <h2>Resumen General</h2>
      <div className="resumen-grid">
        <div className="card clientes">
          <h4>Clientes</h4>
          <span>{resumen.clientes}</span>
        </div>
        <div className="card barberos">
          <h4>Barberos</h4>
          <span>{resumen.barberos}</span>
        </div>
        <div className="card reservas">
          <h4>Reservas Pendientes</h4>
          <span>{resumen.reservas}</span>
        </div>
      </div>

      <style jsx>{`
        .resumen-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
          margin: 2rem 0;
        }
        .card {
          padding: 1.5rem;
          border-radius: 12px;
          text-align: center;
          color: white;
          font-weight: bold;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .clientes {
          background: linear-gradient(135deg, #007bff, #5bc0de);
        }
        .barberos {
          background: linear-gradient(135deg, #28a745, #8cd17d);
        }
        .reservas {
          background: linear-gradient(135deg, #ffc107, #ff9800);
        }
      `}</style>
    </DashboardLayoutAdmin>
  );
}
