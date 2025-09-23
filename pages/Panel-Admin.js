import { useState } from 'react';
import Link from 'next/link';

export default function AdminPanel() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [inputId, setInputId] = useState(''); // Para ID de acciones

  const backendUrl = 'https://back-production-57ce.up.railway.app';

  // Función genérica para mostrar datos
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

  // Función para acciones que requieren ID
  const ejecutarAccionConId = async (accion, endpointBase) => {
    if (!inputId) return alert('Ingrese un ID');
    try {
      const res = await fetch(`${backendUrl}${endpointBase}/${inputId}`, { method: accion });
      const jsonData = await res.json();
      alert(jsonData.mensaje);
      setInputId('');
    } catch (err) {
      console.error(err);
      alert('Error en la acción');
    }
  };

  return (
    <section className="admin-panel-container">
      <h2>Panel de Administración</h2>
      <p>Consultas y acciones sobre la base de datos de la barbería:</p>

      <div className="admin-actions-grid">
        <button className="admin-btn" onClick={() => fetchData('/clientes/')}>
          <i className="fas fa-users"></i> Mostrar Clientes Registrados
        </button>

        <button className="admin-btn" onClick={() => fetchData('/barberos/')}>
          <i className="fas fa-cut"></i> Mostrar Barberos Disponibles
        </button>

        <button className="admin-btn" onClick={() => fetchData('/servicios/')}>
          <i className="fas fa-book-open"></i> Catálogo de Servicios y Precios
        </button>

        <button className="admin-btn" onClick={() => fetchData('/productos/')}>
          <i className="fas fa-book-open"></i> Catálogo de Productos y Precios
        </button>

        <button className="admin-btn" onClick={() => fetchData('/disponibilidad/libre/')}>
          <i className="fas fa-calendar-alt"></i> Bloques de Disponibilidad Libres
        </button>

        <button className="admin-btn" onClick={() => fetchData('/reservas/pendientes/')}>
          <i className="fas fa-clock"></i> Reservas Pendientes
        </button>

        <button className="admin-btn" onClick={() => ejecutarAccionConId('PUT', '/disponibilidad/bloquear')}>
          <i className="fas fa-ban"></i> Bloquear Horario de Barbero
        </button>

        <button className="admin-btn" onClick={() => ejecutarAccionConId('PUT', '/reservas/confirmar')}>
          <i className="fas fa-check-circle"></i> Confirmar una Reserva
        </button>

        <button className="admin-btn" onClick={() => ejecutarAccionConId('DELETE', '/reservas/cancelar')}>
          <i className="fas fa-times-circle"></i> Cancelar Reserva
        </button>

        <button className="admin-btn" onClick={() => fetchData('/reservas/detalle/')}>
          <i className="fas fa-list-alt"></i> Todas las Reservas (Detalle Completo)
        </button>
      </div>

      {/* Input para las acciones que requieren ID */}
      <div style={{ marginTop: '15px' }}>
        <input
          type="text"
          placeholder="Ingrese ID"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <span>Usar ID correspondiente para bloquear, confirmar o cancelar</span>
      </div>

      {/* Tabla dinámica */}
      {data.length > 0 && (
        <div className="admin-data-table" style={{ marginTop: '20px' }}>
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
              {data.map((row, index) => (
                <tr key={index}>
                  {columns.map((col) => (
                    <td key={col}>{row[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="admin-footer-actions" style={{ marginTop: '20px' }}>
        <Link href="/">
          <a className="btn-back-home">
            <i className="fas fa-home"></i> Volver al Inicio
          </a>
        </Link>
      </div>
    </section>
  );
}
