import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function PanelBarbero() {
  const router = useRouter();
  const [barbero, setBarbero] = useState(null);
  const [vistaActual, setVistaActual] = useState('agenda');
  
  const [agenda, setAgenda] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [disponibilidad, setDisponibilidad] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'https://barberia-proyecto-back-production-f876.up.railway.app';

  // Verificar autenticacion
  useEffect(() => {
    const usuarioBarbero = localStorage.getItem('barberUser');
    if (!usuarioBarbero) {
      router.push('/login');
      return;
    }

    const BuscarBarberoData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${backendUrl}/barbero/datos/${usuarioBarbero}`);
        if (!res.ok) {
          throw new Error('No se pudieron cargar los datos del barbero.');
        }
        const data = await res.json();
        setBarbero(data);
      } catch (err) {
        setError(err.message);
        localStorage.removeItem('barberUser');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    BuscarBarberoData();
  }, [router]);

  useEffect(() => {
    if (!barbero) return;

    const BuscarPaneles = async () => {
      try {
        const barberoId = barbero._id;
        const [resAgenda, resHistorial, resDispo] = await Promise.all([
          fetch(`${backendUrl}/barbero/agenda/${barberoId}`),
          fetch(`${backendUrl}/barbero/historial/${barberoId}`),
          fetch(`${backendUrl}/barbero/disponibilidad/${barberoId}`)
        ]);
        if (!resAgenda.ok || !resHistorial.ok || !resDispo.ok) {
            throw new Error("No se pudo cargar la información del panel.");
        }
        const dataAgenda = await resAgenda.json();
        const dataHistorial = await resHistorial.json();
        const dataDispo = await resDispo.json();
        setAgenda(dataAgenda);
        setHistorial(dataHistorial);
        setDisponibilidad(dataDispo);
      } catch (err) {
        setError(err.message);
      }
    };

    BuscarPaneles();
  }, [barbero, backendUrl]);

  // --- Funciones de Acción ---

  const agregarDisponibilidad = async () => {
    if (!barbero) return;
    const fecha = prompt("Ingrese la fecha (YYYY-MM-DD):");
    const hora_inicio = prompt("Ingrese la hora de inicio (HH:MM):");
    const hora_fin = prompt("Ingrese la hora de fin (HH:MM):");
    if (!fecha || !hora_inicio || !hora_fin) {
      alert("Todos los campos son requeridos.");
      return;
    }
    try {
      const res = await fetch(`${backendUrl}/disponibilidad/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fecha,
          hora_inicio,
          hora_fin,
          estado: 'disponible',
          id_barbero: barbero._id 
        }),
      });
      const resultado = await res.json();
      if (!res.ok) throw new Error(resultado.detail || "Error al guardar");
      alert("Horario agregado con éxito.");
      const resDispo = await fetch(`${backendUrl}/barbero/disponibilidad/${barbero._id}`);
      const dataDispo = await resDispo.json();
      setDisponibilidad(dataDispo);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const BloquearDisponibilidad = async (dispoId) => {
    if (!barbero || !dispoId) return;
    try {
      const res = await fetch(`${backendUrl}/disponibilidad/bloquear/${dispoId}`, {
        method: 'PUT',
      });
      const resultado = await res.json();
      if (!res.ok) throw new Error(resultado.detail || "Error al bloquear");
      alert(resultado.mensaje);
      setDisponibilidad(prev => 
        prev.map(d => 
          d._id === dispoId ? { ...d, estado: 'bloqueado' } : d
        )
      );
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('barberUser');
    localStorage.removeItem('isBarberLoggedIn');
    router.push('/login');
  };

  // --- Renderizado ---

  if (loading) {
    return <p className="loading-container">Cargando panel...</p>;
  }

  if (error) {
    return <p className="error-message">Error: {error}</p>;
  }

  if (!barbero) {
    return null; 
  }

  // Función para el panel activo
  const renderVista = () => {
    switch (vistaActual) {
      case 'agenda':
        return <RenderTabla items={agenda} tipo="agenda" />;
      case 'historial':
        return <RenderTabla items={historial} tipo="historial" />;
      case 'disponibilidad':
        return (
          <RenderTabla
            items={disponibilidad}
            tipo="disponibilidad"
            onBlock={BloquearDisponibilidad}
            onAdd={agregarDisponibilidad}
          />
        );
      default:
        return null;
    }
  };

  return (
    <section className="admin-panel-container">
      <h2>Panel de Barbero: {barbero.nombre}</h2>
      <p>Bienvenido a tu panel de gestión.</p>
      <div className="admin-actions-grid">
        <button 
          className={`admin-btn ${vistaActual === 'agenda' ? 'active' : ''}`} 
          onClick={() => setVistaActual('agenda')}
        >
          <i className="fas fa-calendar-check"></i> Mi Agenda ({agenda.length})
        </button>
        <button 
          className={`admin-btn ${vistaActual === 'historial' ? 'active' : ''}`} 
          onClick={() => setVistaActual('historial')}
        >
          <i className="fas fa-history"></i> Historial de Citas ({historial.length})
        </button>
        <button 
          className={`admin-btn ${vistaActual === 'disponibilidad' ? 'active' : ''}`} 
          onClick={() => setVistaActual('disponibilidad')}
        >
          <i className="fas fa-clock"></i> Gestionar Horarios
        </button>
      </div>
      <div className="admin-panel-display">
        {renderVista()}
      </div>

      <div className="admin-footer-actions">
        <button onClick={handleLogout} className="btn-logout">
          <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
        </button>
      </div>
    </section>
  );
}

function RenderTabla({ items, tipo, onBlock, onAdd }) {
  
  if (items.length === 0) {
    return (
      <div className="admin-subpanel">
        <h3>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</h3>
        {tipo === 'disponibilidad' && (
           <button className="admin-btn" onClick={onAdd} style={{marginBottom: '1rem'}}>
             <i className="fas fa-plus-circle"></i> Agregar Nuevo Horario
           </button>
        )}
        <p>No hay datos para mostrar.</p>
      </div>
    );
  }

  let columnas = [];
  if (tipo === 'agenda' || tipo === 'historial') {
    columnas = ['Fecha', 'Hora', 'Cliente', 'Servicio', 'Estado'];
  } else if (tipo === 'disponibilidad') {
    columnas = ['Fecha', 'Hora Inicio', 'Hora Fin', 'Estado', 'Acciones'];
  }

  return (
    <div className="admin-subpanel">
      {tipo === 'disponibilidad' && (
        <button className="admin-btn" onClick={onAdd} style={{marginBottom: '1rem'}}>
          <i className="fas fa-plus-circle"></i> Agregar Nuevo Horario
        </button>
      )}
      <table>
        <thead>
          <tr>
            {columnas.map((col) => <th key={col}>{col}</th>)}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              {tipo === 'agenda' && (
                <>
                  <td>{item.fecha}</td>
                  <td>{item.hora}</td>
                  <td>{item.cliente && item.cliente[0] ? item.cliente[0].nombre : 'N/A'}</td>
                  <td>{item.servicio && item.servicio[0] ? item.servicio[0].nombre_servicio : 'N/A'}</td>
                  <td><span className="estado-pendiente">{item.estado}</span></td>
                </>
              )}
              {tipo === 'historial' && (
                <>
                  <td>{item.fecha}</td>
                  <td>{item.hora}</td>
                  <td>{item.cliente && item.cliente[0] ? item.cliente[0].nombre : 'N/A'}</td>
                  <td>{item.servicio && item.servicio[0] ? item.servicio[0].nombre_servicio : 'N/A'}</td>
                  <td><span className="estado-confirmado">{item.estado}</span></td>
                </>
              )}
              {tipo === 'disponibilidad' && (
                <>
                  <td>{item.fecha}</td>
                  <td>{item.hora_inicio}</td>
                  <td>{item.hora_fin}</td>
                  <td>{item.estado}</td>
                  <td>
                    {item.estado === 'disponible' && (
                      <button 
                        className="btn-accion-bloquear" 
                        onClick={() => onBlock(item._id)}
                      >
                        Bloquear
                      </button>
                    )}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}