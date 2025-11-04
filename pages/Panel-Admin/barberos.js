import { useEffect, useState } from "react";
import DashboardLayoutAdmin from "../../components/DashboardLayoutAdmin";
import DataTable from "../../components/DataTable";

export default function BarberosAdmin() {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://barberia-proyecto-back-production-f876.up.railway.app";

  const [barberos, setBarberos] = useState([]);

  useEffect(() => {
    const cargarBarberos = async () => {
      try {
        const res = await fetch(`${backendUrl}/barberos/`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const limpio = data.map((b) => ({
            nombre: b.nombre,
            especialidad: b.especialidad || "No asignada",
            horarios: b.disponibilidades,
          }));
          setBarberos(limpio);
        }
      } catch (err) {
        console.error("Error cargando barberos:", err);
      }
    };
    cargarBarberos();
  }, [backendUrl]);

  const columnas = ["nombre", "especialidad", "horarios"];

  return (
    <DashboardLayoutAdmin usuario="Administrador">
      <h2>Gestión de Barberos</h2>
      <DataTable data={barberos} columnas={columnas} />
    </DashboardLayoutAdmin>
  );
}
