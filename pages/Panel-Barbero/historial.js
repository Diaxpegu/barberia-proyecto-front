import { useEffect, useState } from "react";
import DashboardLayoutBarbero from "../../components/DashboardLayoutBarbero";
import DataTable from "../../components/DataTable";

export default function HistorialBarbero() {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://barberia-proyecto-back-production-f876.up.railway.app";

  const [historial, setHistorial] = useState([]);
  const [barbero, setBarbero] = useState(null);

  useEffect(() => {
    const usuario = localStorage.getItem("barberUser");
    const id = localStorage.getItem("barberId");
    if (!usuario || !id) {
      window.location.href = "/login";
      return;
    }
    setBarbero({ usuario, id });

    const cargarHistorial = async () => {
      try {
        const res = await fetch(`${backendUrl}/barbero/historial/${id}`);
        const data = await res.json();

        const formateado = Array.isArray(data) ? data.map(r => ({
          _id: r._id,
          fecha: r.fecha,
          hora: r.hora,
          cliente: r.cliente?.[0]?.nombre || "Desconocido",
          servicio: r.servicio?.[0]?.nombre_servicio || "Servicio",
          estado: r.estado
        })) : [];

        setHistorial(formateado);
      } catch (err) {
        console.error("Error al cargar historial:", err);
      }
    };
    cargarHistorial();
  }, [backendUrl]);

  return (
    <DashboardLayoutBarbero usuario={barbero?.usuario}>
      <h2>Historial de Citas Atendidas</h2>
      <p>Clientes atendidos (Estado: Listo).</p>

      <DataTable
        data={historial}
        columnas={["fecha", "hora", "cliente", "servicio", "estado"]}
      />
    </DashboardLayoutBarbero>
  );
}