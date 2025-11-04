import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminPanel() {
  const [panelActivo, setPanelActivo] = useState(null);
  const [data, setData] = useState([]);
  const [columnas, setColumnas] = useState([]);
  const [resumen, setResumen] = useState({});
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://barberia-proyecto-back-production-f876.up.railway.app";


  useEffect(() => {
    const cargarResumen = async () => {
      try {
        const [clientes, barberos, reservas] = await Promise.all([
          fetch(`${backendUrl}/clientes/`).then((r) => r.json()),
          fetch(`${backendUrl}/barberos/`).then((r) => r.json()),
          fetch(`${backendUrl}/reservas/pendientes/`).then((r) => r.json()),
        ]);
        setResumen({
          clientes: clientes.length,
          barberos: barberos.length,
          reservas: reservas.length,
        });
      } catch (e) {
        console.error("Error al cargar resumen:", e);
      }
    };
    cargarResumen();
  }, [backendUrl]);


  const BuscarData = async (endpoint, panelName) => {
    try {
      const url = `${backendUrl}${endpoint}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Error al obtener datos (${panelName})`);
      const resultado = await res.json();


      if (Array.isArray(resultado) && resultado.length > 0) {
        const filtrados = resultado.map((row) => {
          const r = { ...row };
          delete r._id;
          delete r.id_barbero;
          delete r.id_cliente;
          delete r.id_servicio;
          return r;
        });
        setColumnas(Object.keys(filtrados[0]));
        setData(filtrados);
      } else {
        setData([]);
        setColumnas([]);
      }
      setPanelActivo(panelName);
    } catch (err) {
      console.error(err);
      alert(`Error al cargar ${panelName}: ${err.message}`);
      setData([]);
      setColumnas([]);
      setPanelActivo(panelName);
    }
  };


  const mostrarClientes = () => BuscarData("/clientes/", "clientes");
  const mostrarBarberos = () => BuscarData("/barberos/", "barberos");
  const mostrarServicios = () => BuscarData("/servicios/", "servicios");
  const mostrarProductos = () => BuscarData("/productos/", "productos");
  const mostrarDisponibilidad = () => BuscarData("/disponibilidad/libre/", "disponibilidad");
  const mostrarReservasPendientes = () => BuscarData("/reservas/pendientes/", "reservasPendientes");
  const mostrarReservasDetalle = () => BuscarData("/reservas/detalle/", "reservasDetalle");


  const agregarBarberos = async () => {
    const nombre = prompt("Ingrese el nombre del barbero:");
    const especialidad = prompt("Ingrese la especialidad (ej: Barba, Corte, Tintura):");
    const usuario = prompt("Ingrese un nombre de usuario para el barbero:");
    const contrasena = prompt("Ingrese una contraseña para el barbero:");
    if (!nombre || !usuario || !contrasena) {
      alert("El nombre, usuario y contraseña son obligatorios.");
      return;
    }

    const nuevoBarbero = {
      nombre,
      especialidad: especialidad || "General",
      usuario,
      contrasena,
      disponibilidades: [],
    };

    try {
      const res = await fetch(`${backendUrl}/barberos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoBarbero),
      });
      const resultado = await res.json();
      if (!res.ok) throw new Error(resultado.detail || "Error del servidor");
      alert(resultado.mensaje);
      mostrarBarberos();
    } catch (err) {
      alert(`Error al agregar barbero: ${err.message}`);
    }
  };

  const eliminarBarberos = async () => {
    const id = prompt("Ingrese el ID del barbero a eliminar:");
    if (!id) return;
    try {
      const res = await fetch(`${backendUrl}/barberos/${id}`, { method: "DELETE" });
      const resultado = await res.json();
      if (!res.ok) throw new Error(resultado.detail);
      alert(resultado.mensaje);
      mostrarBarberos();
    } catch (err) {
      alert(`Error al eliminar barbero: ${err.message}`);
    }
  };

  const bloquearHorario = async () => {
    const id = prompt("Ingrese el ID del barbero:");
    const fecha = prompt("Ingrese la fecha a bloquear (YYYY-MM-DD):");
    const hora = prompt("Ingrese la hora (HH:MM):");
    if (!id || !fecha || !hora) return alert("Datos incompletos.");
    try {
      const res = await fetch(`${backendUrl}/disponibilidad/bloquear/${id}/${fecha}/${hora}`, { method: "PUT" });
      const resultado = await res.json();
      if (!res.ok) throw new Error(resultado.detail);
      alert(resultado.mensaje);
    } catch (err) {
      alert(`Error al bloquear horario: ${err.message}`);
    }
  };

  const confirmarReserva = async () => {
    const id = prompt("Ingrese el ID de la reserva a confirmar:");
    if (!id) return;
    try {
      const res = await fetch(`${backendUrl}/reservas/confirmar/${id}`, { method: "PUT" });
      const resultado = await res.json();
      if (!res.ok) throw new Error(resultado.detail);
      alert(resultado.mensaje);
    } catch (err) {
      alert(`Error al confirmar reserva: ${err.message}`);
    }
  };

  const cancelarReserva = async () => {
    const id = prompt("Ingrese el ID de la reserva a cancelar:");
    if (!id) return;
    try {
      const res = await fetch(`${backendUrl}/reservas/cancelar/${id}`, { method: "DELETE" });
      const resultado = await res.json();
      if (!res.ok) throw new Error(resultado.detail);
      alert(resultado.mensaje);
    } catch (err) {
      alert(`Error al cancelar reserva: ${err.message}`);
    }
  };

  const renderPanel = () => {
    if (!panelActivo)
      return <p className="no-panel">Selecciona una categoría para ver los datos.</p>;

    return (
      <div className="data-panel">
        <h3 className="panel-title">
          {panelActivo.charAt(0).toUpperCase() + panelActivo.slice(1)}
        </h3>

        {data.length === 0 ? (
          <p>No hay datos disponibles</p>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  {columnas.map((col) => (
                    <th key={col}>{col.replaceAll("_", " ")}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx}>
                    {columnas.map((col) => (
                      <td key={col}>{String(row[col] ?? "-")}</td>
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
    <section className="admin-dashboard">
      <header className="dashboard-header">
        <h2>Panel de Administración</h2>
        <p>Gestione toda la barbería desde un solo lugar</p>
      </header>

      {/* Resumen */}
      <div className="resumen-grid">
        <div className="resumen-card clientes">
          <h4>Clientes</h4>
          <span>{resumen.clientes || 0}</span>
        </div>
        <div className="resumen-card barberos">
          <h4>Barberos</h4>
          <span>{resumen.barberos || 0}</span>
        </div>
        <div className="resumen-card reservas">
          <h4>Reservas Pendientes</h4>
          <span>{resumen.reservas || 0}</span>
        </div>
      </div>

      {/* Botones principales */}
      <div className="admin-actions">
        <button onClick={mostrarClientes}>👤 Clientes</button>
        <button onClick={mostrarBarberos}>💈 Barberos</button>
        <button onClick={agregarBarberos}>➕ Agregar Barbero</button>
        <button onClick={eliminarBarberos}>❌ Eliminar Barbero</button>
        <button onClick={mostrarServicios}>🧾 Servicios</button>
        <button onClick={mostrarProductos}>🧴 Productos</button>
        <button onClick={mostrarDisponibilidad}>🕓 Disponibilidad</button>
        <button onClick={mostrarReservasPendientes}>📋 Reservas Pendientes</button>
        <button onClick={mostrarReservasDetalle}>📅 Detalle Reservas</button>
        <button onClick={bloquearHorario}>⛔ Bloquear Horario</button>
        <button onClick={confirmarReserva}>✅ Confirmar Reserva</button>
        <button onClick={cancelarReserva}>🚫 Cancelar Reserva</button>
      </div>

      {/* Contenido dinámico */}
      <div className="admin-content">{renderPanel()}</div>

      <div className="admin-footer">
        <Link href="/" className="btn-back-home">
          <i className="fas fa-arrow-left"></i> Volver al Inicio
        </Link>
      </div>

      {/* Estilos */}
      <style jsx>{`
        .admin-dashboard {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 1rem 2rem;
          font-family: 'Poppins', sans-serif;
          color: #222;
        }
        .dashboard-header {
          text-align: center;
          margin-bottom: 1rem;
        }
        .resumen-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .resumen-card {
          padding: 1rem;
          border-radius: 12px;
          text-align: center;
          font-weight: bold;
          color: white;
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        .resumen-card span {
          display: block;
          font-size: 2rem;
          margin-top: 0.3rem;
        }
        .clientes { background: linear-gradient(135deg, #007bff, #5bc0de); }
        .barberos { background: linear-gradient(135deg, #28a745, #8cd17d); }
        .reservas { background: linear-gradient(135deg, #ffc107, #ff9800); }

        .admin-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
          justify-content: center;
          margin-bottom: 2rem;
        }
        .admin-actions button {
          padding: 0.7rem 1.2rem;
          border: none;
          border-radius: 8px;
          background-color: #343a40;
          color: #fff;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.95rem;
        }
        .admin-actions button:hover {
          background-color: #495057;
          transform: scale(1.05);
        }

        .data-panel {
          background: #fff;
          padding: 1rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          overflow-x: auto;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
        }
        .data-table th {
          background: #343a40;
          color: white;
          text-transform: capitalize;
          padding: 0.6rem;
        }
        .data-table td {
          padding: 0.5rem;
          border-bottom: 1px solid #ddd;
        }
        .data-table tr:hover td {
          background-color: #f8f9fa;
        }
        .btn-back-home {
          display: inline-block;
          padding: 0.8rem 1.5rem;
          background-color: #007bff;
          color: white;
          border-radius: 8px;
          text-decoration: none;
          transition: 0.3s;
        }
        .btn-back-home:hover {
          background-color: #0056b3;
        }
      `}</style>
    </section>
  );
}
