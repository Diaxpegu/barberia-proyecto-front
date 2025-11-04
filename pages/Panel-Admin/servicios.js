import { useEffect, useState } from "react";
import DashboardLayoutAdmin from "../../components/DashboardLayoutAdmin";
import DataTable from "../../components/DataTable";

export default function ServiciosAdmin() {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://barberia-proyecto-back-production-f876.up.railway.app";

  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    const cargarServicios = async () => {
      try {
        const res = await fetch(`${backendUrl}/servicios/`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const limpio = data.map((s) => ({
            nombre: s.nombre_servicio,
            precio: s.precio ? `$${s.precio}` : "N/A",
            duracion: s.duracion || "N/A",
          }));
          setServicios(limpio);
        }
      } catch (err) {
        console.error("Error cargando servicios:", err);
      }
    };
    cargarServicios();
  }, [backendUrl]);

  const columnas = ["nombre", "precio", "duracion"];

  return (
    <DashboardLayoutAdmin usuario="Administrador">
      <h2>Servicios y Precios</h2>
      <DataTable data={servicios} columnas={columnas} />
    </DashboardLayoutAdmin>
  );
}
