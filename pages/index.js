import Image from 'next/image';

export default function Home() {
  const peluqueros = [
    {
      id: 1,
      nombre: 'Lucas Aldair',
      instagram: 'lukas__aldair',
      servicios: ['Corte básico', 'Corte premium', 'Tintura', 'Lavado', 'Peinado'],
      precios: {
        'Corte básico': 15000,
        'Corte premium': 20000,
        Tintura: 25000,
        Lavado: 5000,
        Peinado: 10000,
      },
    },
    {
      id: 2,
      nombre: 'Alejandro',
      instagram: 'ale_.cut',
      servicios: ['Corte básico', 'Corte premium', 'Tintura', 'Lavado', 'Peinado'],
      precios: {
        'Corte básico': 15000,
        'Corte premium': 20000,
        Tintura: 25000,
        Lavado: 5000,
        Peinado: 10000,
      },
    },
  ];

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

  return (
    <>
      {/* Hero Section */}
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

      {/* Peluqueros */}
      <section className="peluqueros-container">
        <h2 className="section-title">Nuestros Profesionales</h2>
        <h3>Elige tu peluquero y reserva tu cita</h3>

        <div className="peluqueros-grid">
          {peluqueros.map((peluquero) => (
            <div className="peluquero-card" key={peluquero.id}>
              <h3>{peluquero.nombre}</h3>
              <p className="instagram-link">
                <i className="fab fa-instagram"></i>{' '}
                <a
                  href={`https://instagram.com/${peluquero.instagram.replace(
                    '@',
                    ''
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {peluquero.instagram}
                </a>
              </p>
              <div className="servicios">
                <h4>Servicios:</h4>
                <ul>
                  {peluquero.servicios.map((servicio, index) => (
                    <li key={index}>
                      {servicio} - ${peluquero.precios[servicio]}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Botón Reservar abre en misma pestaña */}
              <a href={`/reserva/${peluquero.id}`} className="btn-reservar">
                <i className="fas fa-calendar-check"></i> Reservar
              </a>
              <a href={`/panel/${peluquero.id}`} className="btn-panel">
                <i className="fas fa-user-cog"></i> Panel
              </a>
            </div>
          ))}
        </div>

        {/* Quienes somos */}
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

        {/* Productos */}
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

        {/* Contacto */}
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
                href="https://www.google.com/maps/place/Victoria+2486,+2340000+Valpara%C3%ADso/@-33.04874,-71.6127049,17z/data=!3m1!4b1!4m6!3m5!1s0x9689e0db65601d6d:0x2598bceaabfeccfe!8m2!3d-33.04874!4d-71.61013!16s%2Fg%2F11x80xg18t?entry=ttu&g_ep=EgoyMDI1MDkwOS4wIKXMDSoASAFQAw%3D%3D"
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