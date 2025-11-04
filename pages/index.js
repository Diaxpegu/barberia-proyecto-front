import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [barberos, setBarberos] = useState([]);

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'https://barberia-proyecto-back-production-f876.up.railway.app';

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch(`${backendUrl}/barberos/`);
        const data = await res.json();
        setBarberos(Array.isArray(data) ? data : []);
      } catch {
        setBarberos([]);
      }
    };
    cargar();
  }, []);

  const about_info = {
    descripcion:
      'En VALIANT nos especializamos en cortes de cabello modernos, arreglo de barba y tratamientos faciales.',
    historia:
      'Fundada en 2015, nuestra barbería se ha convertido en un referente en la ciudad.',
  };

  const contact_info = {
    direccion: 'Victoria 2486, Valparaíso, Chile',
    telefono: '+56 9 xxxx xxxx',
    email: 'info@valiantbarber.com',
    redes_sociales: {
      instagram: 'https://instagram.com/valiant_barber',
      facebook: '#',
      twitter: '#',
    },
  };

  return (
    <>
      <section className="logo-container">
        <Image
          src="/valiant.jpg"
          alt="Valiant Barber's Team"
          className="logo-img"
          width={350}
          height={200}
          layout="responsive"
          objectFit="cover"
        />
        <p className="instagram-main">
          <i className="fab fa-instagram" />{' '}
          <a href="https://instagram.com/valiant_barber" target="_blank" rel="noopener noreferrer">
            @valiant_barber
          </a>
        </p>
      </section>

      <section className="peluqueros-container">
        <h2 className="section-title">Nuestros Profesionales</h2>
        <h3>Elige tu barbero y reserva tu cita</h3>

        <div className="peluqueros-grid">
          {barberos.length === 0 && (
            <div className="peluquero-card">
              <p>No hay barberos disponibles por ahora.</p>
            </div>
          )}

          {barberos.map((b) => (
            <div className="peluquero-card" key={b._id}>
              <h3>{b.nombre}</h3>
              <p className="instagram-link">
                <i className="fab fa-instagram" />{' '}
                <a href={`https://instagram.com/${b.usuario}`} target="_blank" rel="noopener noreferrer">
                  @{b.usuario}
                </a>
              </p>
              <p><strong>Especialidad:</strong> {b.especialidad || 'No asignada'}</p>
              <a href={`/reserva/${b._id}`} className="btn-reservar">
                <i className="fas fa-calendar-check" /> Reservar
              </a>
            </div>
          ))}
        </div>

        <section className="about-section">
          <h2>¿Quiénes Somos?</h2>
          <div className="about-content">
            <div className="about-text">
              <p>{about_info.descripcion}</p>
              <p>{about_info.historia}</p>
            </div>
            <div className="about-image video container">
              <video src="/Interior.mp4" controls poster="/valiant.jpg" className="full-cover-video" />
            </div>
          </div>
        </section>

        <div className="productos-section">
          <h2>Nuestros Productos</h2>
          <h3>Productos premium para el cuidado de tu cabello y barba</h3>

          <div className="productos-grid">
            <div className="producto-card">
              <Image
                src="/producto1.jpg"
                alt="Polvo texturizador"
                className="producto-img"
                width={280}
                height={250}
                layout="responsive"
                objectFit="cover"
              />
            </div>
            <div className="producto-card">
              <Image
                src="/producto2.jpg"
                alt="Büffel ceras"
                className="producto-img"
                width={280}
                height={250}
                layout="responsive"
                objectFit="cover"
              />
            </div>
          </div>
        </div>

        <section className="contact-section">
          <h2>Contáctanos</h2>
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon"><i className="fas fa-map-marker-alt" /></div>
                <div className="contact-details"><h4>Dirección</h4><p>{contact_info.direccion}</p></div>
              </div>
              <div className="contact-item">
                <div className="contact-icon"><i className="fas fa-phone" /></div>
                <div className="contact-details"><h4>Teléfono</h4><p>{contact_info.telefono}</p></div>
              </div>
              <div className="contact-item">
                <div className="contact-icon"><i className="fas fa-envelope" /></div>
                <div className="contact-details"><h4>Email</h4><p>{contact_info.email}</p></div>
              </div>
              <div className="contact-social">
                <h4>Síguenos</h4>
                <div className="social-icons">
                  <a href={contact_info.redes_sociales.instagram} target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-instagram" />
                  </a>
                  <a href={contact_info.redes_sociales.facebook} target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-facebook" />
                  </a>
                  <a href={contact_info.redes_sociales.twitter} target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-twitter" />
                  </a>
                </div>
              </div>
            </div>

            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3345.234567890123!2d-71.6127049!3d-33.04874"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href="https://www.google.com/maps/place/Victoria+2486,+2340000+Valpara%C3%ADso/"
                target="_blank" rel="noopener noreferrer" className="map-link"
              >
                <i className="fas fa-external-link-alt" /> Abrir en Google Maps
              </a>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
