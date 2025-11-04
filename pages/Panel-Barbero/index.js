import { useEffect, useState } from "react";
import DashboardLayoutBarbero from "../../components/DashboardLayoutBarbero";


export default function PanelBarbero() {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://barberia-proyecto-back-production-f876.up.railway.app";

  const [agenda, setAgenda] = useState([]);
  const [barbero, setBarbero] = useState(null);

  useEffect(() => {
    const usuario = localStorage.getItem("barberUser");
    const id = localStorage.getItem("barberId") || localStorage.getItem("_id");
    if (!usuario || !id) {
      window.location.href = "/login";
      return;
    }
    setBarbero({ usuario, id });

    const cargarAgenda = async () => {
      try {
        const res = await fetch(`${backendUrl}/barbero/agenda/${id}`);
        if (!res.ok) throw new Error("Error al cargar agenda");
        const data = await res.json();
        setAgenda(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error al cargar agenda:", err);
      }
    };
    cargarAgenda();
  }, [backendUrl]);

  return (
    <DashboardLayoutBarbero usuario={barbero?.usuario}>
      <h2>Agenda de Citas</h2>
      <p>Visualiza tus citas pendientes o confirmadas.</p>

      {agenda.length === 0 ? (
        <p>No tienes citas pendientes por ahora.</p>
      ) : (
        <table className="tabla-estilizada">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Cliente</th>
              <th>Servicio</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {agenda.map((item) => (
              <tr key={item._id}>
                <td>{item.fecha}</td>
                <td>{item.hora}</td>
                <td>{item.cliente?.[0]?.nombre || "N/A"}</td>
                <td>{item.servicio?.[0]?.nombre_servicio || "N/A"}</td>
                <td>{item.estado || "pendiente"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <style jsx>{`
        .tabla-estilizada {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 0.75rem;
          text-align: center;
        }
        th {
          background: #333;
          color: white;
        }
        tr:nth-child(even) {
          background: #f9f9f9;
        }
      `}</style>
    </DashboardLayoutBarbero>
  );
}
