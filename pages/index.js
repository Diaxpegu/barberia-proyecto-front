import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  const [barberos, setBarberos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'https://barberia-proyecto-back-production-f876.up.railway.app';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [barberosRes, serviciosRes] = await Promise.all([
          fetch(`${backendUrl}/barberos/`),
          fetch(`${backendUrl}/servicios/`)
        ]);

        if (!barberosRes.ok || !serviciosRes.ok) {
          throw new Error('Error al cargar los datos');
        }

        const barberosData = await barberosRes.json();
        const serviciosData = await serviciosRes.json();

        setBarberos(barberosData);
        setServicios(serviciosData);
      } catch (err) {
        console.error(err);
        setError('Error al conectar con el servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [backendUrl]);

  const about_info = {
    descripcion:
      'En VALIANT nos especializamos en cortes de cabello modernos, arreglo de barba y tratamientos faciales. Nuestro equipo de barberos profesionales está comprometido con brindarte la mejor experiencia y resultados excepcionales.',
    historia:
      'Fundada en 2015, nuestra barbería se ha convertido en un referente en la ciudad gracias a nuestra atención personalizada y ambiente acogedor. Utilizamos productos de primera calidad y las técnicas más actualizadas.',
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

  if (loading) {
    return <p className="loading">Cargando información...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

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
          <i className="fab fa-instagram"></i>{' '}
          <a
            href="https://instagram.com/valiant_barber"
            target="_blank"
            rel="noopener noreferrer"
          >
            @valiant_barber
          </a>
        </p>
      </section>

      <section className="peluqueros-container">
        <h2 className="section-title">Nuestros Profesionales</h2>
        <h3>Elige tu barbero y reserva tu cita</h3>

        <div className="peluqueros-grid">
          {barberos.length === 0 ? (
            <p>No hay barberos registrados actualmente.</p>
          ) : (
            barberos.map((b) => (
              <div className="peluquero-card" key={b._id}>
                <h3>{b.nombre}</h3>

                {b.especialidades && (
                  <p className="especialidades">
                    <strong>Especialidades:</strong>{' '}
                    {b.especialidades.join(', ')}
                  </p>
                )}

                <div className="servicios">
                  <h4>Servicios:</h4>
                  <ul>
                    {servicios.map((s, index) => (
                      <li key={index}>
                        {s.nombre} - ${s.precio}
                      </li>
                    ))}
                  </ul>
                </div>

                <a href={`/reserva/${b._id}`} className="btn-reservar">
                  <i className="fas fa-calendar-check"></i> Reservar
                </a>

                <a href={`/panel/${b._id}`} className="btn-panel">
                  <i className="fas fa-user-cog"></i> Panel
                </a>
              </div>
            ))
          )}
        </div>

        <section className="about-section">
          <h2>¿Quiénes Somos?</h2>
          <div className="about-content">
            <div className="about-text">
              <p>{about_info.descripcion}</p>
              <p>{about_info.historia}</p>
            </div>
            <div className="about-image video container">
              <video
                src="/Interior.mp4"
                controls
                poster="/valiant.jpg"
                className="full-cover-video"
              />
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
                alt="Palva texturizador"
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
                alt="Buffel ceras"
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
                <div className="contact-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="contact-details">
                  <h4>Dirección</h4>
                  <p>{contact_info.direccion}</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-phone"></i>
                </div>
                <div className="contact-details">
                  <h4>Teléfono</h4>
                  <p>{contact_info.telefono}</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="contact-details">
                  <h4>Email</h4>
                  <p>{contact_info.email}</p>
                </div>
              </div>

              <div className="contact-social">
                <h4>Síguenos</h4>
                <div className="social-icons">
                  <a
                    href={contact_info.redes_sociales.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a
                    href={contact_info.redes_sociales.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-facebook"></i>
                  </a>
                  <a
                    href={contact_info.redes_sociales.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-twitter"></i>
                  </a>
                </div>
              </div>
            </div>

            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3345.234567890123!2d-71.6127049!3d-33.04874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9689e0db65601d6d%3A0x2598bceaabfeccfe!2sVictoria%202486%2C%202340000%20Valpara%C3%ADso!5e0!3m2!1ses!2scl!4v1234567890!5m2!1ses!2scl"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>

              <a
                href="https://www.google.com/maps/place/Victoria+2486,+2340000+Valpara%C3%ADso/@-33.04874,-71.6127049,17z"
                target="_blank"
                rel="noopener noreferrer"
                className="map-link"
              >
                <i className="fas fa-external-link-alt"></i> Abrir en Google Maps
              </a>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
