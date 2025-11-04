import { useEffect, useState } from "react";
import DashboardLayoutAdmin from "../../components/DashboardLayoutAdmin";
import DataTable from "../../components/DataTable";

export default function ReservasAdmin() {
  const [data, setData] = useState([]);
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://barberia-proyecto-back-production-f876.up.railway.app";

  useEffect(() => {
    const cargar = async () => {
      const res = await fetch(`${backendUrl}/reservas/detalle/`);
      const resultado = await res.json();
      setData(resultado);
    };
    cargar();
  }, [backendUrl]);

  return (
    <DashboardLayoutAdmin usuario="Administrador">
      <h2>Gestión de Reservas</h2>
      <DataTable data={data} columnas={["fecha", "hora", "estado"]} />
    </DashboardLayoutAdmin>
  );
}
