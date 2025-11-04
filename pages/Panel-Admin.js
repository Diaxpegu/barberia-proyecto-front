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

  // Cargar resumen inicial (cuenta de registros)
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
        console.error("Error cargando resumen:", e);
      }
    };
    cargarResumen();
  }, [backendUrl]);

  // Cargar datos según el panel activo
  const BuscarData = async (endpoint, panelName) => {
    try {
      const url = `${backendUrl}${endpoint}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Error al obtener datos: ${res.statusText}`);
      const resultado = await res.json();
      setColumnas(resultado.length > 0 ? Object.keys(resultado[0]) : []);
      setData(resultado);
      setPanelActivo(panelName);
    } catch (err) {
      console.error(err);
      alert(`Error al cargar ${panelName}: ${err.message}`);
    }
  };

  // Funciones de gestión
  const mostrarClientes = () => BuscarData("/clientes/", "clientes");
  const mostrarBarberos = () => BuscarData("/barberos/", "barberos");
  const mostrarServicios = () => BuscarData("/servicios/", "servicios");
  const mostrarProductos = () => BuscarData("/productos/", "productos");
  const mostrarDisponibilidad = () => BuscarData("/disponibilidad/libre/", "disponibilidad");
  const mostrarReservas = () => BuscarData("/reservas/detalle/", "reservas");

  // Panel dinámico
  const renderPanel = () => {
    if (!panelActivo) {
      return <p className="no-panel">Selecciona una categoría para visualizar sus datos.</p>;
    }

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
        <p>Gestiona todos los datos de la barbería desde un solo lugar</p>
      </header>

      {/* Resumen rápido */}
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
        <button onClick={mostrarServicios}>🧾 Servicios</button>
        <button onClick={mostrarProductos}>🧴 Productos</button>
        <button onClick={mostrarDisponibilidad}>🕓 Disponibilidad</button>
        <button onClick={mostrarReservas}>📅 Reservas</button>
      </div>

      {/* Contenido dinámico */}
      <div className="admin-content">{renderPanel()}</div>

      {/* Footer */}
      <div className="admin-footer">
        <Link href="/" className="btn-back-home">
          <i className="fas fa-arrow-left"></i> Volver al Inicio
        </Link>
      </div>

      {/* Estilos inline */}
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
        .admin-footer {
          text-align: center;
          margin-top: 2rem;
        }
        .btn-back-home {
          display: inline-block;
          padding: 0.8rem 1.5rem;
          background-color: #007bff;
          color: white;
          border-radius: 8px;
          transition: 0.3s;
          text-decoration: none;
        }
        .btn-back-home:hover {
          background-color: #0056b3;
        }
      `}</style>
    </section>
  );
}
