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

        console.log("DATOS CRUDOS DEL BACKEND:", data);

        const form = (Array.isArray(data) ? data : []).map((c) => ({
          _id: c._id,
          nombre: c.nombre || "Sin nombre",
          apellido: c.apellido || c.apellidos || "-",
          email: c.email || c.correo || c.mail || "-",
          telefono: c.telefono || c.celular || "-",
        }));

        setRows(form);
      } catch (e) {
        console.error("Error cargando clientes:", e);
        setRows([]);
      }
    };
    cargar();
  }, [backendUrl]);

  return (
    <DashboardLayoutAdmin usuario="Administrador">
      <h2>Gestión de Clientes</h2>
      <DataTable
        columnas={["nombre", "apellido", "email", "telefono"]}
        data={rows}
      />
    </DashboardLayoutAdmin>
  );
}