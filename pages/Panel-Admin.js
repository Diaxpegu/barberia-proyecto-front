import { useState } from 'react';
import Link from 'next/link';

export default function AdminPanel() {
  const [data, setData] = useState([]); // Para resultados de consultas
  const [columns, setColumns] = useState([]); // Para nombres de columnas

  const backendUrl = 'https://back-production-57ce.up.railway.app';

  // Función genérica para obtener datos de un endpoint
  const fetchData = async (endpoint) => {
    try {
      const res = await fetch(`${backendUrl}${endpoint}`);
      const jsonData = await res.json();
      if (jsonData.length > 0) {
        setColumns(Object.keys(jsonData[0]));
        setData(jsonData);
      } else {
        setColumns([]);
        setData([]);
        alert("No hay datos disponibles");
      }
    } catch (err) {
      console.error(err);
      alert('Error al obtener los datos');
    }
  };

  // Consultas CRUD para cada botón
  const mostrarClientes = () => fetchData('/clientes/');
  const mostrarBarberos = () => fetchData('/barberos/');
  const mostrarServicios = () => fetchData('/servicios/');
  const mostrarProductos = () => fetchData('/productos/');
  const mostrarDisponibilidad = () => fetchData('/disponibilidad/libre/');
  const mostrarReservasPendientes = () => fetchData('/reservas/pendientes/');
  const bloquearHorario = async () => {
    const id = prompt("Ingrese ID de disponibilidad a bloquear:");
    if (!id) return;
    try {
      const res = await fetch(`${backendUrl}/disponibilidad/bloquear/${id}`, { method: 'PUT' });
      const result = await res.json();
      alert(result.mensaje);
    } catch (err) {
      console.error(err);
      alert('Error al bloquear horario');
    }
  };
  const confirmarReserva = async () => {
    const id = prompt("Ingrese ID de reserva a confirmar:");
    if (!id) return;
    try {
      const res = await fetch(`${backendUrl}/reservas/confirmar/${id}`, { method: 'PUT' });
      const result = await res.json();
      alert(result.mensaje);
    } catch (err) {
      console.error(err);
      alert('Error al confirmar reserva');
    }
  };
  const cancelarReserva = async () => {
    const id = prompt("Ingrese ID de reserva a cancelar:");
    if (!id) return;
    try {
      const res = await fetch(`${backendUrl}/reservas/cancelar/${id}`, { method: 'DELETE' });
      const result = await res.json();
      alert(result.mensaje);
    } catch (err) {
      console.error(err);
      alert('Error al cancelar reserva');
    }
  };
  const mostrarReservasDetalle = () => fetchData('/reservas/detalle/');

  return (
    <section className="admin-panel-container">
      <h2>Panel de Administración</h2>
      <p>Panel de consultas de ejemplo.</p>

      <div className="admin-actions-grid">
        <button className="admin-btn" onClick={mostrarClientes}>
          <i className="fas fa-users"></i> Mostrar Clientes Registrados
        </button>
        <button className="admin-btn" onClick={mostrarBarberos}>
          <i className="fas fa-cut"></i> Mostrar Barberos Disponibles
        </button>
        <button className="admin-btn" onClick={mostrarServicios}>
          <i className="fas fa-book-open"></i> Catálogo de Servicios y Precios
        </button>
        <button className="admin-btn" onClick={mostrarProductos}>
          <i className="fas fa-book-open"></i> Catálogo de Productos y Precios
        </button>
        <button className="admin-btn" onClick={mostrarDisponibilidad}>
          <i className="fas fa-calendar-alt"></i> Bloques de Disponibilidad Libres
        </button>
        <button className="admin-btn" onClick={mostrarReservasPendientes}>
          <i className="fas fa-clock"></i> Reservas Pendientes
        </button>
        <button className="admin-btn" onClick={bloquearHorario}>
          <i className="fas fa-ban"></i> Bloquear Horario de Barbero
        </button>
        <button className="admin-btn" onClick={confirmarReserva}>
          <i className="fas fa-check-circle"></i> Confirmar una Reserva
        </button>
        <button className="admin-btn" onClick={cancelarReserva}>
          <i className="fas fa-times-circle"></i> Cancelar Reserva
        </button>
        <button className="admin-btn" onClick={mostrarReservasDetalle}>
          <i className="fas fa-list-alt"></i> Todas las Reservas (Detalle Completo)
        </button>
      </div>

      {/* Tabla dinámica */}
      {data.length > 0 && (
        <div className="admin-data-table">
          <h3>Resultados</h3>
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
                    <td key={col}>{row[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="admin-footer-actions">
        <Link href="/">
          <a className="btn-back-home">
            <i className="fas fa-home"></i> Volver al Inicio
          </a>
        </Link>
      </div>
    </section>
  );
}
