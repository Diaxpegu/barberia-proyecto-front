import { useState } from 'react';
import Link from 'next/link';

export default function AdminPanel() {
  const [panelActivo, setPanelActivo] = useState(null);
  const [data, setData] = useState([]);
  const [columnas, setColumnas] = useState([]);
  const backendUrl = 'https://barberia-proyecto-back-production-f876.up.railway.app';

  const BuscarData = async (endpoint, panelName) => {
    try {
      const url = `${backendUrl}${endpoint}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Error al obtener datos: ${res.statusText}`);
      }

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

  //  Funciones de Gestión de Barberos 
  const agregarBarberos = async () => {
    const nombre = prompt("Ingrese el nombre del barbero:");
    const especialidad = prompt("Ingrese la especialidad (ej: Cortes, Barba):");
    if (!nombre) {
      alert("El nombre es obligatorio.");
      return;
    }
    const nuevoBarbero = {
      nombre: nombre,
      especialidad: especialidad || null
    };
    try {
      const res = await fetch(`${backendUrl}/barberos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoBarbero),
      });
      if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.detail || 'Error del servidor');
      }
      const resultado = await res.json();
      alert(resultado.mensaje || "Barbero agregado");
      mostrarBarberos(); 
    } catch (err) {
      console.error(err);
      alert(`Error al agregar barbero: ${err.message}`);
    }
  };

  const eliminarBarberos = async () => {
    const id = prompt("Ingrese el ID del barbero a eliminar:");
    if (!id) return;
    try {
      const res = await fetch(`${backendUrl}/barberos/${id}`, { 
        method: 'DELETE' 
      });
      if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.detail || 'Error del servidor');
      }
      const resultado = await res.json();
      alert(resultado.mensaje || "Barbero eliminado");
      mostrarBarberos();
    } catch (err) {
      console.error(err);
      alert(`Error al eliminar barbero: ${err.message}`);
    }
  };

  //  Función de Gestión de Disponibilidad 
  const agregarDisponibilidad = async () => {
    const fecha = prompt("Ingrese la fecha (YYYY-MM-DD):");
    const hora_inicio = prompt("Ingrese la hora de inicio (HH:MM):");
    const hora_fin = prompt("Ingrese la hora de fin (HH:MM):");
    const estado = "disponible";
    if (!fecha || !hora_inicio || !hora_fin) {
      alert("Debe completar todos los campos.");
      return;
    }
    const nuevaDisponibilidad = {
      fecha,
      hora_inicio,
      hora_fin,
      estado,
      id_barbero: null
    };
    try {
      const res = await fetch(`${backendUrl}/disponibilidad/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaDisponibilidad),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Error del servidor');
      }
      const resultado = await res.json();
      alert(resultado.mensaje || "Disponibilidad agregada correctamente");
      mostrarDisponibilidad();
    } catch (err) {
      console.error(err);
      alert(`Error al agregar disponibilidad: ${err.message}`);
    }
  };

  // Funciones de botones
  const mostrarBarberos = () => BuscarData('/barberos/', 'barberos');
  const mostrarClientes = () => BuscarData('/clientes/', 'clientes');
  const mostrarServicios = () => BuscarData('/servicios/', 'servicios');
  const mostrarProductos = () => BuscarData('/productos/', 'productos');
  const mostrarDisponibilidad = () => BuscarData('/disponibilidad/libre/', 'disponibilidad');
  const mostrarReservasPendientes = () => BuscarData('/reservas/pendientes/', 'reservasPendientes');
  const mostrarReservasDetalle = () => BuscarData('/reservas/detalle/', 'reservasDetalle');

  // Acciones del administrador
  const bloquearHorario = async () => {
    const id = prompt('Ingrese el ID de la disponibilidad a bloquear:');
    if (!id) return;
    try {
      const res = await fetch(`${backendUrl}/disponibilidad/bloquear/${id}`, { method: 'PUT' });
      const resultado = await res.json();
      alert(resultado.mensaje);
    } catch (err) {
      console.error(err);
      alert('Error al bloquear el horario.');
    }
  };
  const confirmarReserva = async () => {
    const id = prompt('Ingrese el ID de la reserva a confirmar:');
    if (!id) return;
    try {
      const res = await fetch(`${backendUrl}/reservas/confirmar/${id}`, { method: 'PUT' });
      const resultado = await res.json();
      alert(resultado.mensaje);
    } catch (err) {
      console.error(err);
      alert('Error al confirmar la reserva.');
    }
  };
  const cancelarReserva = async () => {
    const id = prompt('Ingrese el ID de la reserva a cancelar:');
    if (!id) return;
    try {
      const res = await fetch(`${backendUrl}/reservas/cancelar/${id}`, { method: 'DELETE' });
      const resultado = await res.json();
      alert(resultado.mensaje);
    } catch (err) {
      console.error(err);
      alert('Error al cancelar la reserva.');
    }
  };

  // Paneles dinámicos
  const renderPanel = () => {
    if (!panelActivo) return <p>Seleccione una consulta para ver los resultados.</p>;

    return (
      <div className="admin-subpanel">
        <h3>
          {panelActivo === 'clientes' && 'Clientes Registrados'}
          {panelActivo === 'barberos' && 'Barberos Disponibles'}
          {panelActivo === 'servicios' && 'Servicios y Precios'}
          {panelActivo === 'productos' && 'Productos y Precios'}
          {panelActivo === 'disponibilidad' && 'Bloques de Disponibilidad Libres'}
          {panelActivo === 'reservasPendientes' && 'Reservas Pendientes'}
          {panelActivo === 'reservasDetalle' && 'Todas las Reservas - Detalle Completo'}
        </h3>

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
                    <td key={col}>{String(row[col])}</td>
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
        <button className="admin-btn" onClick={mostrarClientes}>Mostrar Clientes</button>
        <button className="admin-btn" onClick={mostrarBarberos}>Mostrar Barberos</button>
        <button className="admin-btn" onClick={agregarBarberos}>Agregar Barbero</button>
        <button className="admin-btn" onClick={eliminarBarberos}>Eliminar Barbero</button>
        <button className="admin-btn" onClick={mostrarServicios}>Servicios y Precios</button>
        <button className="admin-btn" onClick={mostrarProductos}>Productos y Precios</button>
        <button className="admin-btn" onClick={mostrarDisponibilidad}>Disponibilidad Libre</button>
        <button className="admin-btn" onClick={agregarDisponibilidad}>Agregar Disponibilidad</button>
        <button className="admin-btn" onClick={mostrarReservasPendientes}>Reservas Pendientes</button>
        <button className="admin-btn" onClick={bloquearHorario}>Bloquear Horario</button>
        <button className="admin-btn" onClick={confirmarReserva}>Confirmar Reserva</button>
        <button className="admin-btn" onClick={cancelarReserva}>Cancelar Reserva</button>
        <button className="admin-btn" onClick={mostrarReservasDetalle}>Detalle Completo Reservas</button>
      </div>
      <div className="admin-panel-display">
        {renderPanel()}
      </div>

      <div className="admin-footer-actions">
        <Link href="/" className="btn-back-home">
          Volver al Inicio
        </Link>
      </div>
    </section>
  );
}
