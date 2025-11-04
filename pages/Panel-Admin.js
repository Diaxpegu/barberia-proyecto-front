import { useState } from 'react';
import Link from 'next/link';

export default function AdminPanel() {
  const [panelActivo, setPanelActivo] = useState(null);
  const [data, setData] = useState([]);
  const [columnas, setColumnas] = useState([]);

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'https://barberia-proyecto-back-production-f876.up.railway.app';

  const fetchData = async (endpoint, panel) => {
    try {
      const res = await fetch(`${backendUrl}${endpoint}`);
      const jsonData = await res.json();
      setColumns(jsonData.length > 0 ? Object.keys(jsonData[0]) : []);
      setData(jsonData);
      setPanelActivo(panel); // Abrir el panel correspondiente
    } catch (err) {
      console.error(err);
      alert('Error al obtener los datos');
    }
  };

  // Funciones para cada botón
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
<<<<<<< HEAD
    await fetch(`${backendUrl}/disponibilidad/bloquear/${id}`, { method: "PUT" });
    alert("Actualizado ✅");
=======
    try {
      const res = await fetch(`${backendUrl}/disponibilidad/bloquear/${id}`, { method: 'PUT' });
      const result = await res.json();
      alert(result.mensaje);
    } catch (err) {
      console.error(err);
      alert('Error al bloquear el horario.');
    }
>>>>>>> 3b4fcbc6c0618ac8831ff9697f42bc29045a9cc3
  };
  const confirmarReserva = async () => {
    const id = prompt("ID de reserva");
    if (!id) return;
<<<<<<< HEAD
    await fetch(`${backendUrl}/reservas/confirmar/${id}`, { method: "PUT"});
    alert("Actualizado ✅");
=======
    try {
      const res = await fetch(`${backendUrl}/reservas/confirmar/${id}`, { method: 'PUT' });
      const result = await res.json();
      alert(result.mensaje);
    } catch (err) {
      console.error(err);
      alert('Error al confirmar la reserva.');
    }
>>>>>>> 3b4fcbc6c0618ac8831ff9697f42bc29045a9cc3
  };
  const cancelarReserva = async () => {
    const id = prompt("ID de reserva");
    if (!id) return;
<<<<<<< HEAD
    await fetch(`${backendUrl}/reservas/cancelar/${id}`, { method: "DELETE"});
    alert("Cancelado ✅");
  };

=======
    try {
      const res = await fetch(`${backendUrl}/reservas/cancelar/${id}`, { method: 'DELETE' });
      const result = await res.json();
      alert(result.mensaje);
    } catch (err) {
      console.error(err);
      alert('Error al cancelar la reserva.');
    }
  };

  // Render de paneles dinámicos
>>>>>>> 3b4fcbc6c0618ac8831ff9697f42bc29045a9cc3
  const renderPanel = () => {
    if (!panelActivo) return <p>Selecciona una consulta.</p>;

    return (
      <div className="admin-subpanel">
        <h3>Resultados: {panelActivo.toUpperCase()}</h3>

        {data.length === 0 ? (
          <p>No hay datos</p>
        ) : (
          <table>
            <thead>
              <tr>
                {columns.map((col) => <th key={col}>{col}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx}>
                  {columns.map((col) => <td key={col}>{row[col]}</td>)}
                </tr>
<<<<<<< HEAD
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
=======
              ))}
            </tbody>
          </table>
>>>>>>> 3b4fcbc6c0618ac8831ff9697f42bc29045a9cc3
        )}
      </div>
    );
  };

  return (
    <section className="admin-panel-container">
      <h2>Panel de Administración</h2>

      <div className="admin-actions-grid">
<<<<<<< HEAD
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
=======
        <button className="admin-btn" onClick={mostrarClientes}>Mostrar Clientes</button>
        <button className="admin-btn" onClick={mostrarBarberos}>Mostrar Barberos</button>
        <button className="admin-btn" onClick={mostrarServicios}>Servicios y Precios</button>
        <button className="admin-btn" onClick={mostrarProductos}>Productos y Precios</button>
        <button className="admin-btn" onClick={mostrarDisponibilidad}>Disponibilidad Libre</button>
        <button className="admin-btn" onClick={mostrarReservasPendientes}>Reservas Pendientes</button>
        <button className="admin-btn" onClick={bloquearHorario}>Bloquear Horario</button>
        <button className="admin-btn" onClick={confirmarReserva}>Confirmar Reserva</button>
        <button className="admin-btn" onClick={cancelarReserva}>Cancelar Reserva</button>
        <button className="admin-btn" onClick={mostrarReservasDetalle}>Detalle Completo Reservas</button>
>>>>>>> 3b4fcbc6c0618ac8831ff9697f42bc29045a9cc3
      </div>

      {/* Panel dinámico */}
      <div className="admin-panel-display">
        {renderPanel()}
      </div>

      <div className="admin-footer-actions">
        <Link href="/" legacyBehavior>
          <a className="btn-back-home">Volver</a>
        </Link>
      </div>
    </section>
  );
}

