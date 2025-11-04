import { useEffect, useState } from "react";
import DashboardLayoutBarbero from "@/components/DashboardLayoutBarbero";
import DataTable from "@/components/DataTable";

export default function PanelBarbero() {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://barberia-proyecto-back-production-f876.up.railway.app";

  const [agenda, setAgenda] = useState([]);
  const [barbero, setBarbero] = useState(null);

  useEffect(() => {
    const usuario = localStorage.getItem("barberUser");
    const id = localStorage.getItem("barberId");
    if (!usuario || !id) {
      window.location.href = "/login";
      return;
    }
    setBarbero({ usuario, id });

    const cargarAgenda = async () => {
      try {
        const res = await fetch(`${backendUrl}/barbero/agenda/${id}`);
        const data = await res.json();
        setAgenda(data);
      } catch (err) {
        console.error("Error al cargar agenda:", err);
      }
    };
    cargarAgenda();
  }, [backendUrl]);

  const columnas = ["fecha", "hora", "id_cliente", "id_servicio", "estado"];

  return (
    <DashboardLayoutBarbero usuario={barbero?.usuario}>
      <h2>Agenda de Citas</h2>
      <p>Visualiza tus citas pendientes o confirmadas.</p>
      <DataTable data={agenda} columnas={columnas} />
    </DashboardLayoutBarbero>
  );
}
