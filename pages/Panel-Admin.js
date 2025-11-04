import { useState } from 'react';
import Link from 'next/link';

export default function AdminPanel() {
  const [panelActivo, setPanelActivo] = useState(null);
  const [data, setData] = useState([]);
  const [columnas, setColumnas] = useState([]);

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'https://barberia-proyecto-back-production-f876.up.railway.app';

  const BuscarData = async (endpoint, panelName) => {
    try {
      const url = `${backendUrl}${endpoint}`;
      const res = await fetch(url);

      if (!res.ok) throw new Error(`Error: ${res.statusText}`);

      const resultado = await res.json();

      if (resultado && resultado.length > 0) {
        setColumnas(Object.keys(resultado[0]));
        setData(resultado);
      } else {
        setColumnas([]);
        setData([]);
      }

      setPanelActivo(panelName);

    } catch (err) {
      console.error(err);
      alert(`Error al cargar ${panelName}: ${err.message}`);
      setColumnas([]);
      setData([]);
      setPanelActivo(panelName);
    }
  };

  // Botones función consulta
  const mostrarBarberos = () => BuscarData('/barberos/', 'Barberos');
  const mostrarClientes = () => BuscarData('/clientes/', 'Clientes');
  const mostrarServicios = () => BuscarData('/servicios/', 'Servicios');
  const mostrarProductos = () => BuscarData('/productos/', 'Productos');
  const mostrarDisponibilidad = () => BuscarData('/disponibilidad/libre/', 'Disponibilidad');
  const mostrarReservasPendientes = () => BuscarData('/reservas/pendientes/', 'Reservas Pendientes');
  const mostrarReservasDetalle = () => BuscarData('/reservas/detalle/', 'Reservas Detalle');

  // Acciones
  const bloquearHorario = async () => {
    const id = prompt("ID de disponibilidad");
    if (!id) return;
    await fetch(`${backendUrl}/disponibilidad/bloquear/${id}`, { method: "PUT" });
    alert("Horario bloqueado ✅");
  };

  const confirmarReserva = async () => {
    const id = prompt("ID de reserva");
    if (!id) return;
    await fetch(`${backendUrl}/reservas/confirmar/${id}`, { method: "PUT" });
    alert("Reserva confirmada ✅");
  };

  const cancelarReserva = async () => {
    const id = prompt("ID de reserva");
    if (!id) return;
    await fetch(`${backendUrl}/reservas/cancelar/${id}`, { method: "DELETE" });
    alert("Reserva cancelada ✅");
  };

  const renderPanel = () => {
    if (!panelActivo) return <p>Selecciona una consulta.</p>;

    return (
      <div className="admin-subpanel">
        <h3>{panelActivo}</h3>

        {data.length === 0 ? (
          <p>No hay datos disponibles</p>
        ) : (
          <table>
            <thead>
              <tr>
                {columnas.map((col) => <th key={col}>{col}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx}>
                  {columnas.map((col) => (
                    <td key={col}>{String(row[col] ?? "")}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
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
