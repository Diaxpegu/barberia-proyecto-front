import { useEffect, useState } from "react";
import DashboardLayoutAdmin from "../../components/DashboardLayoutAdmin";
import DataTable from "../../components/DataTable";

export default function ReservasAdmin() {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://barberia-proyecto-back-production-f876.up.railway.app";

  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    const cargarReservas = async () => {
      try {
        const res = await fetch(`${backendUrl}/reservas/detalle/`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const limpio = data.map((r) => ({
            fecha: r.fecha,
            hora: r.hora,
            cliente: r.cliente?.[0]?.nombre || "N/A",
            servicio: r.servicio?.[0]?.nombre_servicio || "N/A",
            barbero: r.barbero?.[0]?.nombre || "N/A",
            estado: r.estado,
          }));
          setReservas(limpio);
        }
      } catch (err) {
        console.error("Error cargando reservas:", err);
      }
    };
    cargarReservas();
  }, [backendUrl]);

  const columnas = ["fecha", "hora", "cliente", "servicio", "barbero", "estado"];

  return (
    <DashboardLayoutAdmin usuario="Administrador">
      <h2>Reservas (Detalle Completo)</h2>
      <DataTable data={reservas} columnas={columnas} />
    </DashboardLayoutAdmin>
  );
}
