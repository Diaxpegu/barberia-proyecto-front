import { useEffect, useState } from "react";
import DashboardLayoutAdmin from "../../components/DashboardLayoutAdmin";
import DataTable from "../../components/DataTable";

export default function ClientesAdmin() {
  const [rows, setRows] = useState([]);
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://barberia-proyecto-back-production-f876.up.railway.app";

  useEffect(() => {
    const cargar = async () => {
      try {
        const r = await fetch(`${backendUrl}/clientes/`);
        const data = await r.json();
        const form = (Array.isArray(data) ? data : []).map((c) => ({
          nombre: c.nombre || "-",
          apellido: c.apellido || "-",
          email: c.email || "-",
          telefono: c.telefono || "-",
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
      <h2>Clientes</h2>
      <DataTable columnas={["nombre", "apellido", "email", "telefono"]} data={rows} />
    </DashboardLayoutAdmin>
  );
}
