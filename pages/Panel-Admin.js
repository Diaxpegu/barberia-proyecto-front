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

      if (!res.ok) throw new Error(`Error al obtener datos: ${res.statusText}`);

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
      console.error(`Error en BuscarData (${panelName}):`, err);
      alert(`Error al cargar ${panelName}: ${err.message}`);
      setColumnas([]);
      setData([]);
      setPanelActivo(panelName);
    }
  };

  const agregarBarberos = async () => {
    const nombre = prompt('Ingrese el nombre del barbero:');
    const especialidad = prompt('Ingrese la especialidad (ej: Cortes, Barba):');
    const usuario = prompt('Ingrese un nombre de usuario para el barbero:');
    const contrasena = prompt('Ingrese una contraseña para el barbero:');

    if (!nombre || !usuario || !contrasena) {
      alert('El nombre, usuario y contraseña son obligatorios.');
      return;
    }

    const nuevoBarbero = {
      nombre,
      especialidad: especialidad || null,
      usuario,
      contrasena,
      disponibilidades: []
    };

    try {
      const res = await fetch(`${backendUrl}/barberos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoBarbero)
      });

      const resultado = await res.json();
      if (!res.ok) throw new Error(resultado.detail || 'Error del servidor');

      alert(resultado.mensaje || 'Barbero agregado correctamente');
      mostrarBarberos();
    } catch (err) {
      console.error(err);
      alert(`Error al agregar barbero: ${err.message}`);
    }
  };

  const eliminarBarberos = async () => {
    const id = prompt('Ingrese el ID del barbero a eliminar:');
    if (!id) return;

    try {
      const res = await fetch(`${backendUrl}/barberos/${id}`, {
        method: 'DELETE'
      });
      const resultado = await res.json();
      if (!res.ok) throw new Error(resultado.detail || 'Error del servidor');

      alert(resultado.mensaje || 'Barbero eliminado correctamente');
      mostrarBarberos();
    } catch (err) {
      console.error(err);
      alert(`Error al eliminar barbero: ${err.message}`);
    }
  };

  const agregarDisponibilidad = async () => {
    const barberoId = prompt('Ingrese el ID del barbero:');
    const fecha = prompt('Ingrese la fecha (YYYY-MM-DD):');
    const hora = prompt('Ingrese la hora (HH:MM):');

    if (!barberoId || !fecha || !hora) {
      alert('Debe ingresar todos los datos.');
      return;
    }

    try {

      const res = await fetch(`${backendUrl}/disponibilidad/bloquear/${barberoId}/${fecha}/${hora}`, {
        method: 'PUT'
      });
      const resultado = await res.json();
      if (!res.ok) throw new Error(resultado.detail || 'Error del servidor');
      alert('Se agregó o actualizó la disponibilidad correctamente.');
      mostrarDisponibilidad();
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    }
  };
  const mostrarClientes = () => BuscarData('/clientes/', 'clientes');
  const mostrarBarberos = () => BuscarData('/barberos/', 'barberos');
  const mostrarServicios = () => BuscarData('/servicios/', 'servicios');
  const mostrarProductos = () => BuscarData('/productos/', 'productos');
  const mostrarDisponibilidad = () => BuscarData('/disponibilidad/libre/', 'disponibilidad');
  const mostrarReservasPendientes = () => BuscarData('/reservas/pendientes/', 'reservasPendientes');
  const mostrarReservasDetalle = () => BuscarData('/reservas/detalle/', 'reservasDetalle');

  const bloquearHorario = async () => {
    const barberoId = prompt('Ingrese el ID del barbero:');
    const fecha = prompt('Ingrese la fecha (YYYY-MM-DD):');
    const hora = prompt('Ingrese la hora (HH:MM):');
    if (!barberoId || !fecha || !hora) return alert('Todos los datos son obligatorios.');

    try {
      const res = await fetch(`${backendUrl}/disponibilidad/bloquear/${barberoId}/${fecha}/${hora}`, {
        method: 'PUT'
      });
      const resultado = await res.json();
      if (!res.ok) throw new Error(resultado.detail);
      alert(resultado.mensaje || 'Horario bloqueado correctamente');
    } catch (err) {
      console.error(err);
      alert(`Error al bloquear horario: ${err.message}`);
    }
  };

  const confirmarReserva = async () => {
    const id = prompt('Ingrese el ID de la reserva a confirmar:');
    if (!id) return;

    try {
      const res = await fetch(`${backendUrl}/reservas/confirmar/${id}`, {
        method: 'PUT'
      });
      const resultado = await res.json();
      if (!res.ok) throw new Error(resultado.detail);
      alert(resultado.mensaje || 'Reserva confirmada correctamente');
    } catch (err) {
      console.error(err);
      alert(`Error al confirmar reserva: ${err.message}`);
    }
  };

  const cancelarReserva = async () => {
    const id = prompt('Ingrese el ID de la reserva a cancelar:');
    if (!id) return;

    try {
      const res = await fetch(`${backendUrl}/reservas/cancelar/${id}`, {
        method: 'DELETE'
      });
      const resultado = await res.json();
      if (!res.ok) throw new Error(resultado.detail);
      alert(resultado.mensaje || 'Reserva cancelada correctamente');
    } catch (err) {
      console.error(err);
      alert(`Error al cancelar reserva: ${err.message}`);
    }
  };

  const renderPanel = () => {
    if (!panelActivo) return <p>Seleccione una consulta para ver los resultados.</p>;

    return (
      <div className="admin-subpanel">
        <h3>
          {panelActivo === 'clientes' && 'Clientes Registrados'}
          {panelActivo === 'barberos' && 'Barberos Disponibles'}
          {panelActivo === 'servicios' && 'Servicios y Precios'}
          {panelActivo === 'productos' && 'Productos y Precios'}
          {panelActivo === 'disponibilidad' && 'Disponibilidad Libre'}
          {panelActivo === 'reservasPendientes' && 'Reservas Pendientes'}
          {panelActivo === 'reservasDetalle' && 'Todas las Reservas - Detalle Completo'}
        </h3>

        {data.length === 0 ? (
          <p>No hay datos disponibles</p>
        ) : (
          <div className="tabla-scroll">
            <table>
              <thead>
                <tr>{columnas.map(col => <th key={col}>{col}</th>)}</tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx}>
                    {columnas.map(col => (
                      <td key={col}>{String(row[col])}</td>
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
      <p>Gestione los datos principales de la barbería.</p>

      <div className="admin-actions-grid">
        {/* Clientes */}
        <button className="admin-btn" onClick={mostrarClientes}>
          Mostrar Clientes
        </button>

        {/* Barberos */}
        <button className="admin-btn" onClick={mostrarBarberos}>
          Mostrar Barberos
        </button>
        <button className="admin-btn" onClick={agregarBarberos}>
          Agregar Barbero
        </button>
        <button className="admin-btn" onClick={eliminarBarberos}>
          Eliminar Barbero
        </button>

        {/* Servicios / Productos */}
        <button className="admin-btn" onClick={mostrarServicios}>
          Servicios y Precios
        </button>
        <button className="admin-btn" onClick={mostrarProductos}>
          Productos y Precios
        </button>

        {/* Disponibilidad */}
        <button className="admin-btn" onClick={mostrarDisponibilidad}>
          Ver Disponibilidad Libre
        </button>
        <button className="admin-btn" onClick={agregarDisponibilidad}>
          Agregar / Modificar Disponibilidad
        </button>

        {/* Reservas */}
        <button className="admin-btn" onClick={mostrarReservasPendientes}>
          Ver Reservas Pendientes
        </button>
        <button className="admin-btn" onClick={confirmarReserva}>
          Confirmar Reserva
        </button>
        <button className="admin-btn" onClick={cancelarReserva}>
          Cancelar Reserva
        </button>
        <button className="admin-btn" onClick={mostrarReservasDetalle}>
          Ver Detalle Completo de Reservas
        </button>

        {/* Bloqueo manual */}
        <button className="admin-btn" onClick={bloquearHorario}>
          Bloquear Horario
        </button>
      </div>

      {/* Panel dinámico */}
      <div className="admin-panel-display">{renderPanel()}</div>

      {/* Footer */}
      <div className="admin-footer-actions">
        <Link href="/" className="btn-back-home">
          Volver al Inicio
        </Link>
      </div>
    </section>
  );
}
