import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

export default function ReservaBarbero() {
  const router = useRouter();
  const { id } = router.query;

  const [barbero, setBarbero] = useState(null);
  const [slots, setSlots] = useState([]);
  const [cargando, setCargando] = useState(true);

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'https://barberia-proyecto-back-production-f876.up.railway.app';

  useEffect(() => {
    if (!id) return;

    const cargar = async () => {
      try {
        const [resBarbero, resDisp] = await Promise.all([
          fetch(`${backendUrl}/barberos/${id}`),
          fetch(`${backendUrl}/barberos/${id}/disponibilidades`)
        ]);

        const b = await resBarbero.json();
        const d = await resDisp.json();

        setBarbero(b && b._id ? b : null);
        setSlots(Array.isArray(d) ? d : []);
      } catch {
        setBarbero(null);
        setSlots([]);
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [id]);

  const porFecha = useMemo(() => {
    const g = {};
    for (const s of slots) {
      const f = s.fecha;
      if (!g[f]) g[f] = [];
      g[f].push(s);
    }
    Object.keys(g).forEach((k) => g[k].sort((a, b) => a.hora.localeCompare(b.hora)));
    return g;
  }, [slots]);

  if (cargando) return <section className="reserva-container"><p>Cargando...</p></section>;

  if (!barbero) {
    return (
      <section className="reserva-container">
        <p>No se encontró el barbero.</p>
        <a href="/" className="btn-back-home">Volver</a>
      </section>
    );
  }

  return (
    <section className="reserva-container">
      <h2>Horarios disponibles para {barbero.nombre}</h2>
      <p>Especialidad: {barbero.especialidad || 'No asignada'}</p>

      {slots.length === 0 ? (
        <p>No hay horarios disponibles en este momento.</p>
      ) : (
        <div className="calendario-disponible">
          {Object.entries(porFecha).map(([fecha, horas]) => (
            <div key={fecha} className="dia-block">
              <h4>{fecha}</h4>
              <div className="horas-grid">
                {horas.map((h) => (
                  <button
                    key={`${fecha}-${h.hora}`}
                    className="hora-slot disponible"
                    onClick={() => alert(`Seleccionado ${fecha} ${h.hora}`)}
                  >
                    {h.hora}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="reserva-back">
        <a href="/" className="btn-back-home">Volver</a>
      </div>
    </section>
  );
}
