import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function PanelBarbero() {
  const router = useRouter();

  const [barbero, setBarbero] = useState(null);
  const [vistaActual, setVistaActual] = useState('agenda'); // 'agenda' | 'historial' | 'disponibilidad'

  const [agenda, setAgenda] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [disponibilidad, setDisponibilidad] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingVista, setLoadingVista] = useState(false);
  const [error, setError] = useState('');

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'https://barberia-proyecto-back-production-f876.up.railway.app';

  // Autenticación básica
  useEffect(() => {
    const usuarioBarbero = typeof window !== 'undefined' ? localStorage.getItem('barberUser') : null;
    const barberoId = typeof window !== 'undefined' ? localStorage.getItem('barberId') : null;

    if (!usuarioBarbero || !barberoId) {
      router.replace('/login');
      return;
    }

    const cargarBarbero = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(`${backendUrl}/barberos/${barberoId}`);
        if (!res.ok) throw new Error('No se pudieron cargar los datos del barbero.');
        const data = await res.json();
        setBarbero(data);
      } catch (err) {
        setError(err.message || 'Error al cargar barbero');
        // limpiar sesión corrupta
        localStorage.removeItem('barberUser');
        localStorage.removeItem('barberId');
        localStorage.removeItem('usuario');
        localStorage.removeItem('rol');
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    cargarBarbero();
  }, [router, backendUrl]);

  // Cargar vistas del panel cuando hay barbero
  useEffect(() => {
    if (!barbero) return;

    const cargarPanel = async () => {
      try {
        setLoadingVista(true);
        setError('');

        const barberoId = barbero._id;
        const [resAgenda, resHistorial, resDispo] = await Promise.all([
          fetch(`${backendUrl}/barbero/agenda/${barberoId}`),
          fetch(`${backendUrl}/barbero/historial/${barberoId}`),
          fetch(`${backendUrl}/barberos/${barberoId}/disponibilidades`)
        ]);

        if (!resAgenda.ok || !resHistorial.ok || !resDispo.ok) {
          throw new Error('No se pudo cargar la información del panel.');
        }

        const [dataAgenda, dataHistorial, dataDispo] = await Promise.all([
          resAgenda.json(),
          resHistorial.json(),
          resDispo.json()
        ]);

        setAgenda(Array.isArray(dataAgenda) ? dataAgenda : []);
        setHistorial(Array.isArray(dataHistorial) ? dataHistorial : []);
        // Normalizar disponibilidad a objetos {fecha, hora, estado}
        const dispoNorm = Array.isArray(dataDispo)
          ? dataDispo
              .filter(d => d && d.fecha && d.hora)
              .map(d => ({ fecha: d.fecha, hora: d.hora, estado: d.estado || 'disponible' }))
          : [];
        setDisponibilidad(dispoNorm);
      } catch (err) {
        setError(err.message || 'Error al cargar panel');
      } finally {
        setLoadingVista(false);
      }
    };

    cargarPanel();
  }, [barbero, backendUrl]);

  // Acciones
  const bloquearDisponibilidad = async (fecha, hora) => {
    if (!barbero || !fecha || !hora) {
      alert('Faltan datos para bloquear.');
      return;
    }
    const ok = confirm(`¿Bloquear ${fecha} a las ${hora}?`);
    if (!ok) return;

    try {
      const res = await fetch(`${backendUrl}/disponibilidad/bloquear/${barbero._id}/${fecha}/${hora}`, {
        method: 'PUT'
      });
      const resultado = await res.json();
      if (!res.ok) throw new Error(resultado.detail || 'Error al bloquear');

      // Actualizar estado local
      setDisponibilidad(prev =>
        prev.map(d => (d.fecha === fecha && d.hora === hora ? { ...d, estado: 'ocupado' } : d))
      );
      alert(resultado.mensaje || 'Horario bloqueado correctamente');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('barberUser');
    localStorage.removeItem('barberId');
    localStorage.removeItem('usuario');
    localStorage.removeItem('rol');
    router.push('/login');
  };

  // Render tabla genérica
  const RenderTabla = ({ items, tipo }) => {
    if (loadingVista) {
      return (
        <div className="admin-subpanel">
          <h3>{tituloVista(tipo)}</h3>
          <p>Cargando...</p>
        </div>
      );
    }

    if (!items || items.length === 0) {
      return (
        <div className="admin-subpanel">
          <h3>{tituloVista(tipo)}</h3>
          <p>No hay datos para mostrar.</p>
        </div>
      );
    }

    let columnas = [];
    if (tipo === 'agenda' || tipo === 'historial') {
      columnas = ['Fecha', 'Hora', 'ID Cliente', 'ID Servicio', 'Estado'];
    } else if (tipo === 'disponibilidad') {
      columnas = ['Fecha', 'Hora', 'Estado', 'Acciones'];
    }

    return (
      <div className="admin-subpanel">
        <h3>{tituloVista(tipo)}</h3>
        <table>
          <thead>
            <tr>{columnas.map(col => <th key={col}>{col}</th>)}</tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item._id || `${tipo}-${index}`}>
                {tipo === 'agenda' && (
                  <>
                    <td>{item.fecha}</td>
                    <td>{item.hora}</td>
                    <td>{String(item.id_cliente || 'N/A')}</td>
                    <td>{String(item.id_servicio || 'N/A')}</td>
                    <td>{item.estado}</td>
                  </>
                )}
                {tipo === 'historial' && (
                  <>
                    <td>{item.fecha}</td>
                    <td>{item.hora}</td>
                    <td>{String(item.id_cliente || 'N/A')}</td>
                    <td>{String(item.id_servicio || 'N/A')}</td>
                    <td>{item.estado}</td>
                  </>
                )}
                {tipo === 'disponibilidad' && (
                  <>
                    <td>{item.fecha}</td>
                    <td>{item.hora}</td>
                    <td>{item.estado}</td>
                    <td>
                      {item.estado === 'disponible' ? (
                        <button
                          className="btn-accion-bloquear"
                          onClick={() => bloquearDisponibilidad(item.fecha, item.hora)}
                        >
                          Bloquear
                        </button>
                      ) : (
                        <span>—</span>
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
  };

  const tituloVista = (tipo) => {
    if (tipo === 'agenda') return 'Mi Agenda';
    if (tipo === 'historial') return 'Historial de Citas';
    if (tipo === 'disponibilidad') return 'Gestionar Horarios';
    return '';
  };

  if (loading) {
    return <p className="loading-container">Cargando panel...</p>;
  }
  if (error) {
    return (
      <p className="error-message" style={{ padding: '2rem', textAlign: 'center' }}>
        Error: {error}
      </p>
    );
  }
  if (!barbero) return null;

  return (
    <section className="admin-panel-container">
      <h2>Panel de Barbero: {barbero.nombre}</h2>
      <p>Bienvenido a tu panel de gestión.</p>

      <div className="admin-actions-grid">
        <button
          className={`admin-btn ${vistaActual === 'agenda' ? 'active' : ''}`}
          onClick={() => setVistaActual('agenda')}
        >
          Mi Agenda ({agenda.length})
        </button>
        <button
          className={`admin-btn ${vistaActual === 'historial' ? 'active' : ''}`}
          onClick={() => setVistaActual('historial')}
        >
          Historial de Citas ({historial.length})
        </button>
        <button
          className={`admin-btn ${vistaActual === 'disponibilidad' ? 'active' : ''}`}
          onClick={() => setVistaActual('disponibilidad')}
        >
          Gestionar Horarios
        </button>
      </div>

      <div className="admin-panel-display">
        {vistaActual === 'agenda' && <RenderTabla items={agenda} tipo="agenda" />}
        {vistaActual === 'historial' && <RenderTabla items={historial} tipo="historial" />}
        {vistaActual === 'disponibilidad' && <RenderTabla items={disponibilidad} tipo="disponibilidad" />}
      </div>

      <div className="admin-footer-actions">
        <button onClick={handleLogout} className="btn-logout">
          Cerrar Sesión
        </button>
      </div>
    </section>
  );
}
