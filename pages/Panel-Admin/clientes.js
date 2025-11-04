import { useEffect, useState } from "react";
import DashboardLayoutAdmin from "../../components/DashboardLayoutAdmin";
import DataTable from "../../components/DataTable";

export default function ClientesAdmin() {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://barberia-proyecto-back-production-f876.up.railway.app";

  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const res = await fetch(`${backendUrl}/clientes/`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const limpio = data.map((c) => ({
            nombre: c.nombre,
            correo: c.correo || "N/A",
            telefono: c.telefono || "N/A",
          }));
          setClientes(limpio);
        }
      } catch (err) {
        console.error("Error cargando clientes:", err);
      }
    };
    cargarClientes();
  }, [backendUrl]);

  const columnas = ["nombre", "correo", "telefono"];

  return (
    <DashboardLayoutAdmin usuario="Administrador">
      <h2>Clientes Registrados</h2>
      <DataTable data={clientes} columnas={columnas} />
    </DashboardLayoutAdmin>
  );
}
