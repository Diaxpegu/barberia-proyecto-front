import { useState } from 'react';
import Link from 'next/link';

export default function AdminPanel() {
  const [panelActivo, setPanelActivo] = useState(null);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'https://barberia-proyecto-back-production-f876.up.railway.app';

  // ✅ Función universal para obtener datos
  const fetchData = async (endpoint, panel) => {
    try {
      const res = await fetch(`${backendUrl}${endpoint}`);
      if (!res.ok) throw new Error(`Error: ${res.status}`);

      const json = await res.json();

      if (!Array.isArray(json) || json.length === 0) {
        setData([]);
        setColumns([]);
      } else {
        const keys = Object.keys(json[0]);
        setColumns(keys);
        setData(json);
      }

      setPanelActivo(panel);
    } catch (error) {
      console.error(error);
      alert("Error obteniendo datos del backend");
    }
  };

  // ✅ Acciones del panel
  const mostrarClientes = () => fetchData('/clientes/', 'clientes');
  const mostrarBarberos = () => fetchData('/barberos/', 'barberos');
  const mostrarServicios = () => fetchData('/servicios/', 'servicios');
  const mostrarProductos = () => fetchData('/productos/', 'productos');
  const mostrarDisponibilidad = () => fetchData('/disponibilidad/libre/', 'disponibilidad');
  const mostrarReservasPendientes = () => fetchData('/reservas/pendientes/', 'reservasPendientes');
  const mostrarReservasDetalle = () => fetchData('/reservas/detalle/', 'reservasDetalle');

  // ✅ Botones con acciones
  const bloquearHorario = async () => {
    const id = prompt("ID de disponibilidad");
    if (!id) return;
    await fetch(`${backendUrl}/disponibilidad/bloquear/${id}`, { method: "PUT" });
    alert("Actualizado ✅");
  };

  const confirmarReserva = async () => {
    const id = prompt("ID de reserva");
    if (!id) return;
    await fetch(`${backendUrl}/reservas/confirmar/${id}`, { method: "PUT"});
    alert("Actualizado ✅");
  };

  const cancelarReserva = async () => {
    const id = prompt("ID de reserva");
    if (!id) return;
    await fetch(`${backendUrl}/reservas/cancelar/${id}`, { method: "DELETE"});
    alert("Cancelado ✅");
  };

  const renderPanel = () => {
    if (!panelActivo) return <p>Selecciona una consulta.</p>;

    return (
      <div className="admin-subpanel">
        <h3>Resultados: {panelActivo.toUpperCase()}</h3>

        {data.length === 0 ? (
          <p>No hay datos</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col}>{String(row[col] ?? "")}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="admin-panel-container">
      <h2>Panel de Administración</h2>

      <div className="admin-actions-grid">
        <button onClick={mostrarClientes}>Clientes</button>
        <button onClick={mostrarBarberos}>Barberos</button>
        <button onClick={mostrarServicios}>Servicios</button>
        <button onClick={mostrarProductos}>Productos</button>
        <button onClick={mostrarDisponibilidad}>Disponibilidad</button>
        <button onClick={mostrarReservasPendientes}>Pendientes</button>
        <button onClick={mostrarReservasDetalle}>Detalle Reservas</button>

        <button onClick={bloquearHorario}>Bloquear Horario</button>
        <button onClick={confirmarReserva}>Confirmar Reserva</button>
        <button onClick={cancelarReserva}>Cancelar Reserva</button>
      </div>

      <div className="admin-panel-display">{renderPanel()}</div>

      <div className="admin-footer-actions">
        <Link href="/" legacyBehavior>
          <a className="btn-back-home">Volver</a>
        </Link>
      </div>
    </section>
  );
}

