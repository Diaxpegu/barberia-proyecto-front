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
        setHistorial(data);
      } catch (err) {
        console.error("Error al cargar historial:", err);
      }
    };
    cargarHistorial();
  }, [backendUrl]);

  const columnas = ["fecha", "hora", "id_cliente", "id_servicio", "estado"];

  return (
    <DashboardLayoutBarbero usuario={barbero?.usuario}>
      <h2>Historial de Citas Completadas</h2>
      <p>Visualiza tus citas atendidas anteriormente.</p>
      <DataTable data={historial} columnas={columnas} />
    </DashboardLayoutBarbero>
  );
}