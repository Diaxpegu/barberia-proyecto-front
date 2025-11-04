import { useEffect, useState } from "react";
import DashboardLayoutAdmin from "@/components/DashboardLayoutAdmin";
import DataTable from "@/components/DataTable";

export default function BarberosAdmin() {
  const [data, setData] = useState([]);
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://barberia-proyecto-back-production-f876.up.railway.app";

  useEffect(() => {
    const cargar = async () => {
      const res = await fetch(`${backendUrl}/barberos/`);
      const resultado = await res.json();
      const filtrados = resultado.map(({ _id, contrasena, ...resto }) => resto);
      setData(filtrados);
    };
    cargar();
  }, [backendUrl]);

  return (
    <DashboardLayoutAdmin usuario="Administrador">
      <h2>Gestión de Barberos</h2>
      <DataTable data={data} columnas={["nombre", "usuario", "especialidad", "disponibilidades"]} />
    </DashboardLayoutAdmin>
  );
}
