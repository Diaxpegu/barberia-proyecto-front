import { useEffect, useState } from "react";
import DashboardLayoutAdmin from "../../components/DashboardLayoutAdmin";
import DataTable from "../../components/DataTable";

export default function ServiciosAdmin() {
  const [data, setData] = useState([]);
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://barberia-proyecto-back-production-f876.up.railway.app";

  useEffect(() => {
    const cargar = async () => {
      const res = await fetch(`${backendUrl}/servicios/`);
      const resultado = await res.json();
      setData(resultado);
    };
    cargar();
  }, [backendUrl]);

  return (
    <DashboardLayoutAdmin usuario="Administrador">
      <h2>Gestión de Servicios</h2>
      <DataTable data={data} columnas={["nombre_servicio", "precio", "duracion"]} />
    </DashboardLayoutAdmin>
  );
}
