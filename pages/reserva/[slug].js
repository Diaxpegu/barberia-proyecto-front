import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Reserva() {
  const router = useRouter();
  const { slug } = router.query;

  const [peluquero, setPeluquero] = useState(null);
  const [formData, setFormData] = useState({
    fecha: '',
    hora: '',
    servicio: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    rut: '',
  });

  // Control de pasos del formulario
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableHours, setAvailableHours] = useState({});

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'https://barberia-proyecto-back-production-f876.up.railway.app';

  // 1. Cargar datos del barbero
  useEffect(() => {
    if (!slug) return;

    const cargarBarbero = async () => {
      try {
        const resBarberos = await fetch(`${backendUrl}/barberos/`);
        const todos = await resBarberos.json();

        // Función para normalizar slugs
        const crearSlug = (nombre) =>
          nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');

        const barberoEncontrado = todos.find(
          (b) => crearSlug(b.nombre) === slug.toLowerCase()
        );

        if (!barberoEncontrado) {
          setError('Barbero no encontrado.');
          return;
        }

        // Cargar horarios del barbero
        const resHorarios = await fetch(
          `${backendUrl}/barberos/${barberoEncontrado._id}/disponibilidades`
        );
        const dataHorarios = await resHorarios.json();

        const formateado = {};
        dataHorarios.forEach((slot) => {
          if (!formateado[slot.fecha]) formateado[slot.fecha] = {};
          formateado[slot.fecha][slot.hora] = slot.estado;
        });

        setPeluquero({
          ...barberoEncontrado,
          horarios: formateado,
          // Definimos servicios por defecto o los que vengan de la BD si existieran
          servicios: ['Corte básico', 'Corte premium', 'Tintura', 'Lavado', 'Peinado'],
          precios: {
            'Corte básico': 15000,
            'Corte premium': 20000,
            Tintura: 25000,
            Lavado: 5000,
            Peinado: 10000,
          },
        });
      } catch (err) {
        console.error('Error al cargar barbero:', err);
        setError('Error al cargar datos del barbero.');
      }
    };

    cargarBarbero();
  }, [slug, backendUrl]);

  // 2. Actualizar horas disponibles cuando cambia la fecha
  useEffect(() => {
    if (selectedDate && peluquero && peluquero.horarios[selectedDate]) {
      setAvailableHours(peluquero.horarios[selectedDate]);
    } else {
      setAvailableHours({});
    }
    // Resetear hora al cambiar fecha
    setFormData((prev) => ({ ...prev, hora: '' }));
  }, [selectedDate, peluquero]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    setFormData((prev) => ({ ...prev, fecha: newDate }));
    setError('');
  };

  const handleHourChange = (e) => {
    setFormData((prev) => ({ ...prev, hora: e.target.value }));
    setError('');
  };

  const handleNextStep = () => {
    setError('');
    if (currentStep === 1) {
      if (!formData.fecha) return setError('Por favor, seleccione una fecha.');
      if (!formData.hora) return setError('Por favor, seleccione un horario.');
      if (!formData.servicio) return setError('Por favor, seleccione un servicio.');
    }
    setCurrentStep((prev) => prev + 1);
    window.scrollTo(0, 0); // Subir al inicio al cambiar de paso
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.nombre || !formData.apellido || !formData.email || !formData.telefono) {
      setError('Por favor, completa todos los campos obligatorios (*).');
      return;
    }

    const datosReserva = {
      id_barbero: peluquero._id,
      fecha: formData.fecha,
      hora: formData.hora,
      nombre_cliente: formData.nombre,
      apellido_cliente: formData.apellido,
      email_cliente: formData.email,
      telefono_cliente: formData.telefono,
      rut_cliente: formData.rut,
      servicio_nombre: formData.servicio,
    };

    try {
      const res = await fetch(`${backendUrl}/reservas/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosReserva),
      });

      const resultado = await res.json();
      if (!res.ok) {
        throw new Error(resultado.detail || 'Error al guardar la reserva');
      }

      router.push({
        pathname: '/confirmacion',
        query: {
          peluqueroNombre: peluquero.nombre,
          servicio: formData.servicio,
          fecha: formData.fecha,
          hora: formData.hora,
          clienteNombre: formData.nombre,
          clienteApellido: formData.apellido,
          clienteEmail: formData.email,
          clienteTelefono: formData.telefono,
          clienteRut: formData.rut,
          reservaId: resultado.id_reserva ? resultado.id_reserva.slice(-6).toUpperCase() : 'N/A',
        },
      });
    } catch (err) {
      console.error('Error al procesar la reserva:', err);
      setError(`Hubo un problema al agendar tu reserva: ${err.message}`);
    }
  };

  if (!peluquero && !error) {
    return (
      <div className="reserva-container loading-container" style={{ textAlign: 'center', marginTop: '50px' }}>
        <h3>Cargando información del profesional...</h3>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Reserva | Valiant Barbería</title>
      </Head>

      <section className="reserva-container">

        {/* Título Principal */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2>AGENDAR CITA</h2>
          {peluquero && <p style={{ color: '#666' }}>Reserva tu espacio con <strong>{peluquero.nombre}</strong></p>}
        </div>

        {/* Indicador de Pasos (Estilo Globals.css) */}
        <div className="reserva-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Cita</div>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Tus Datos</div>
          </div>
        </div>

        <div className="reserva-content-wrapper">

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}

          {peluquero && (
            <form onSubmit={handleSubmit} className="reserva-form">

              {/* PASO 1: SELECCIÓN DE FECHA, HORA Y SERVICIO */}
              {currentStep === 1 && (
                <div className="form-step active">

                  {/* Fecha */}
                  <div className="form-group">
                    <label> <i className="far fa-calendar-alt"></i> Selecciona una Fecha:</label>
                    <input
                      type="date"
                      className="datepicker"
                      value={formData.fecha}
                      onChange={handleDateChange}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  {/* Horarios */}
                  <div className="form-group">
                    <label><i className="far fa-clock"></i> Horarios Disponibles:</label>

                    {!selectedDate ? (
                      <p style={{ fontStyle: 'italic', color: '#888' }}>Primero selecciona una fecha.</p>
                    ) : (
                      <div className="horarios-grid">
                        {Object.keys(availableHours).length > 0 ? (
                          Object.keys(availableHours).map((hora) => (
                            <div
                              key={hora}
                              className={`hora-slot ${availableHours[hora]}`}
                            >
                              <input
                                type="radio"
                                name="hora"
                                id={`hora-${hora}`}
                                value={hora}
                                checked={formData.hora === hora}
                                onChange={handleHourChange}
                                disabled={availableHours[hora] !== 'disponible'}
                              />
                              <label htmlFor={`hora-${hora}`}>{hora}</label>
                            </div>
                          ))
                        ) : (
                          <p className="no-hours">No hay horas disponibles para esta fecha.</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Servicio */}
                  <div className="form-group">
                    <label><i className="fas fa-cut"></i> Servicio:</label>
                    <select
                      value={formData.servicio}
                      name="servicio"
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                      <option value="">-- Seleccionar servicio --</option>
                      {peluquero.servicios.map((s) => (
                        <option key={s} value={s}>
                          {s} - ${peluquero.precios[s]?.toLocaleString('es-CL') || 'Consultar'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-navigation">
                    <div></div>
                    <button type="button" onClick={handleNextStep} className="btn-next">
                      Siguiente <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              )}

              {/* DATOS DEL CLIENTE */}
              {currentStep === 2 && (
                <div className="form-step active">
                  <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Datos de Contacto</h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                      <label>Nombre *</label>
                      <input name="nombre" value={formData.nombre} onChange={handleChange} required placeholder="Ej: Juan" />
                    </div>
                    <div className="form-group">
                      <label>Apellido *</label>
                      <input name="apellido" value={formData.apellido} onChange={handleChange} required placeholder="Ej: Pérez" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email *</label>
                    <input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="correo@ejemplo.com" />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                      <label>Teléfono *</label>
                      <input name="telefono" value={formData.telefono} onChange={handleChange} required placeholder="+56 9..." />
                    </div>
                    <div className="form-group">
                      <label>RUT (Opcional)</label>
                      <input name="rut" value={formData.rut} onChange={handleChange} placeholder="12.345.678-9" />
                    </div>
                  </div>

                  <div className="form-navigation">
                    <button type="button" onClick={handlePrevStep} className="btn-prev">
                      <i className="fas fa-arrow-left"></i> Volver
                    </button>
                    <button type="submit" className="btn-confirmar">
                      Confirmar Reserva <i className="fas fa-check"></i>
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>

        {/* RESUMEN LATERAL */}
        <aside className="reserva-summary">
          <h4>Resumen de Reserva</h4>
          <div className="summary-content">
            <div className="summary-item">
              <strong>Profesional:</strong>
              <span>{peluquero?.nombre || '---'}</span>
            </div>
            <div className="summary-item">
              <strong>Fecha:</strong>
              <span>{formData.fecha || '---'}</span>
            </div>
            <div className="summary-item">
              <strong>Hora:</strong>
              <span>{formData.hora || '---'}</span>
            </div>
            <div className="summary-item">
              <strong>Servicio:</strong>
              <span style={{ color: 'var(--color-secondary)', fontWeight: 'bold' }}>{formData.servicio || '---'}</span>
            </div>
            {peluquero?.precios[formData.servicio] && (
              <div className="summary-item">
                <strong>Total:</strong>
                <span>${peluquero.precios[formData.servicio].toLocaleString('es-CL')}</span>
              </div>
            )}
          </div>
        </aside>

      </section>
    </>
  );
}