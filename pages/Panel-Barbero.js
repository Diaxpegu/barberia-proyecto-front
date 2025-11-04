import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function PanelBarbero() {
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('usuario');
    setNombre(user || 'Barbero');
  }, []);

  return (
    <section className="barbero-panel">
      <h2>Bienvenido, {nombre}</h2>
      <p>Panel de control del barbero</p>

      <div className="barbero-actions">
        <p>Próximamente podrás ver tus reservas y disponibilidad aquí.</p>
      </div>

      <Link href="/" legacyBehavior>
        <a className="btn-back-home">Cerrar sesión</a>
      </Link>
    </section>
  );
}
