import '../styles/globals.css';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>VALIANT Barbería</title>
        {/* Fuentes y Font Awesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <header>
        <div className="header-container">
          <div>
            <a href="/" className="btn-volver">
              <i className="fas fa-home"></i> Inicio
            </a>
          </div>
          <div>
            <h1>V A L I A N T</h1>
          </div>
          <div></div>
        </div>
      </header>

      <main>
        <Component {...pageProps} />
      </main>

      <footer>
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">VALIANT</div>
            <p>Barbería de calidad con los mejores profesionales y productos.</p>
          </div>
          <div className="footer-section">
            <h4>Contacto</h4>
            <p>
              <i className="fas fa-map-marker-alt"></i> Dirección: Victoria 2486,
              Valparaíso, Chile
            </p>
            <p>
              <i className="fas fa-phone"></i> Teléfono: +56 9 xxxx xxxx
            </p>
            <p>
              <i className="fas fa-envelope"></i> Email: info@valiantbarber.com
            </p>
          </div>
          <div className="footer-section">
            <h4>Síguenos</h4>
            <div className="social-links">
              <a href="#">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 VALIANT barber team - Todos los derechos reservados</p>
        </div>
      </footer>
    </>
  );
}