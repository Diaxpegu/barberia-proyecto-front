import { useEffect, useState } from "react";
import DashboardLayoutAdmin from "../../components/DashboardLayoutAdmin";
import DataTable from "../../components/DataTable";

export default function ReservasAdmin() {
  const [rows, setRows] = useState([]);
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://barberia-proyecto-back-production-f876.up.railway.app";

  useEffect(() => {
    const cargar = async () => {
      try {
        const r = await fetch(`${backendUrl}/reservas/detalle/`);
        const data = await r.json();

        const form = (Array.isArray(data) ? data : []).map((x) => ({
          fecha: x.fecha || "-",
          hora: x.hora || "-",
          cliente:
            x.cliente && x.cliente[0]
              ? `${x.cliente[0].nombre || ""} ${x.cliente[0].apellido || ""}`.trim() || "-"
              : "-",
          barbero:
            x.barbero && x.barbero[0]
              ? x.barbero[0].nombre || "-"
              : "-",
          servicio:
            x.servicio && x.servicio[0]
              ? x.servicio[0].nombre_servicio || "-"
              : x.servicio_nombre || "-", // fallback cuando viene plano
          estado: x.estado || "-",
        }));

        setRows(form);
      } catch (e) {
        console.error(e);
        setRows([]);
      }
    };
    cargar();
  }, [backendUrl]);

  return (
    <DashboardLayoutAdmin usuario="Administrador">
      <h2>Reservas (Detalle completo)</h2>
      <DataTable
        columnas={["fecha", "hora", "cliente", "barbero", "servicio", "estado"]}
        data={rows}
      />
    </DashboardLayoutAdmin>
  );
}
