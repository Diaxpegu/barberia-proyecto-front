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

        // FILTRO: Solo clientes con estado "listo"
        const clientesListos = (Array.isArray(data) ? data : []).filter(c => c.estado === 'listo');

        const form = clientesListos.map((c) => ({
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
      <h2>Gestión de Clientes (Atendidos)</h2>
      <p>Mostrando clientes con estado "Listo".</p>
      {/* Columnas solicitadas */}
      <DataTable
        columnas={["nombre", "apellido", "email", "telefono"]}
        data={rows}
      />
    </DashboardLayoutAdmin>
  );
}