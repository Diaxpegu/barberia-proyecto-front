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

  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableHours, setAvailableHours] = useState({});

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'https://barberia-proyecto-back-production-f876.up.railway.app';

  // Cargar datos del barbero
  useEffect(() => {
    if (!slug) return;

    const cargarBarbero = async () => {
      try {
        const resBarberos = await fetch(`${backendUrl}/barberos/`);
        const todos = await resBarberos.json();

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

  // Actualizar horas
  useEffect(() => {
    if (selectedDate && peluquero && peluquero.horarios[selectedDate]) {
      setAvailableHours(peluquero.horarios[selectedDate]);
    } else {
      setAvailableHours({});
    }
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
    window.scrollTo(0, 0);
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
      <div className="reserva-container loading-container" style={{ textAlign: 'center', marginTop: '50px', display: 'block' }}>
        <h3>Cargando información del profesional...</h3>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Reserva | Valiant Barbería</title>
      </Head>

      <div style={{ background: '#f8f8f8', minHeight: '100vh', padding: '2rem 1rem' }}>

        {/* Encabezado */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '3rem', margin: 0 }}>AGENDAR CITA</h2>
          {peluquero && <p style={{ color: '#666' }}>Reserva tu experiencia con <strong style={{ color: 'var(--color-secondary)' }}>{peluquero.nombre}</strong></p>}
        </div>

        {/* Contenedor Principal Flex */}
        <section className="reserva-container">

          <div className="reserva-content-wrapper">

            {/* Stepper */}
            <div className="reserva-steps">
              <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                <div className="step-number">{currentStep > 1 ? <i className="fas fa-check"></i> : '1'}</div>
                <div className="step-label">Selección</div>
              </div>
              <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                <div className="step-number">2</div>
                <div className="step-label">Tus Datos</div>
              </div>
            </div>

            {error && (
              <div className="error-message">
                <i className="fas fa-exclamation-circle"></i>
                <span>{error}</span>
              </div>
            )}

            {peluquero && (
              <form onSubmit={handleSubmit} className="reserva-form">

                {/*  PASO 1  */}
                {currentStep === 1 && (
                  <div className="form-step active">

                    {/* Fecha */}
                    <div className="form-group">
                      <label className="input-label"><i className="far fa-calendar-alt"></i> ¿Qué día prefieres?</label>
                      <input
                        type="date"
                        className="modern-input"
                        value={formData.fecha}
                        onChange={handleDateChange}
                        min={new Date().toISOString().split('T')[0]}
                        style={{ cursor: 'pointer' }}
                      />
                    </div>

                    {/* Horarios Grid */}
                    <div className="form-group">
                      <label className="input-label"><i className="far fa-clock"></i> Horarios Disponibles</label>

                      {!selectedDate ? (
                        <div style={{ padding: '20px', background: '#f0f0f0', borderRadius: '8px', textAlign: 'center', color: '#888' }}>
                          <i className="fas fa-arrow-up"></i> Primero selecciona una fecha arriba.
                        </div>
                      ) : (
                        <div className="horarios-grid">
                          {Object.keys(availableHours).length > 0 ? (
                            Object.keys(availableHours).map((hora) => (
                              <div key={hora} className={`hora-slot ${availableHours[hora]}`}>
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
                      <label className="input-label"><i className="fas fa-cut"></i> Selecciona el Servicio</label>
                      <select
                        value={formData.servicio}
                        name="servicio"
                        onChange={handleChange}
                        required
                        className="modern-select"
                      >
                        <option value="">-- Seleccionar --</option>
                        {peluquero.servicios.map((s) => (
                          <option key={s} value={s}>
                            {s} — {peluquero.precios[s] ? `$${peluquero.precios[s].toLocaleString('es-CL')}` : 'Consultar'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-navigation" style={{ marginTop: '30px', textAlign: 'right' }}>
                      <button type="button" onClick={handleNextStep} className="btn-next">
                        Siguiente Paso <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }}></i>
                      </button>
                    </div>
                  </div>
                )}

                {/* PASO 2 */}
                {currentStep === 2 && (
                  <div className="form-step active">
                    <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', color: '#333' }}>Información de Contacto</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div className="form-group">
                        <label className="input-label">Nombre *</label>
                        <div className="input-icon-wrapper">
                          <i className="fas fa-user input-icon"></i>
                          <input name="nombre" className="modern-input input-with-icon" value={formData.nombre} onChange={handleChange} required placeholder="Ej: Juan" />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="input-label">Apellido *</label>
                        <div className="input-icon-wrapper">
                          <i className="fas fa-user input-icon"></i>
                          <input name="apellido" className="modern-input input-with-icon" value={formData.apellido} onChange={handleChange} required placeholder="Ej: Pérez" />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="input-label">Correo Electrónico *</label>
                      <div className="input-icon-wrapper">
                        <i className="fas fa-envelope input-icon"></i>
                        <input name="email" type="email" className="modern-input input-with-icon" value={formData.email} onChange={handleChange} required placeholder="nombre@correo.com" />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div className="form-group">
                        <label className="input-label">Teléfono *</label>
                        <div className="input-icon-wrapper">
                          <i className="fas fa-phone input-icon"></i>
                          <input name="telefono" className="modern-input input-with-icon" value={formData.telefono} onChange={handleChange} required placeholder="+56 9..." />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="input-label">RUT (Opcional)</label>
                        <div className="input-icon-wrapper">
                          <i className="fas fa-id-card input-icon"></i>
                          <input name="rut" className="modern-input input-with-icon" value={formData.rut} onChange={handleChange} placeholder="12.345.678-9" />
                        </div>
                      </div>
                    </div>

                    <div className="form-navigation" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                      <button type="button" onClick={handlePrevStep} className="btn-prev">
                        <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i> Volver
                      </button>
                      <button type="submit" className="btn-confirmar">
                        Confirmar Cita <i className="fas fa-check-circle" style={{ marginLeft: '8px' }}></i>
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>

          {/* RESUMEN LATERAL */}
          <aside className="reserva-summary">
            <h4><i className="fas fa-receipt"></i> Tu Resumen</h4>

            <div className="summary-row">
              <span>Barbero:</span>
              <strong>{peluquero?.nombre || 'Seleccionando...'}</strong>
            </div>
            <div className="summary-row">
              <span>Fecha:</span>
              <strong>{formData.fecha ? new Date(formData.fecha).toLocaleDateString() : '--/--/--'}</strong>
            </div>
            <div className="summary-row">
              <span>Hora:</span>
              <strong>{formData.hora || '--:--'}</strong>
            </div>

            <div style={{ margin: '15px 0', borderBottom: '1px solid #eee' }}></div>

            <div className="summary-row">
              <span>Servicio:</span>
              <span style={{ textAlign: 'right', maxWidth: '150px' }}>{formData.servicio || '---'}</span>
            </div>

            {peluquero?.precios[formData.servicio] && (
              <div className="summary-row total">
                <span>TOTAL A PAGAR</span>
                <span>${peluquero.precios[formData.servicio].toLocaleString('es-CL')}</span>
              </div>
            )}

            {!peluquero?.precios[formData.servicio] && (
              <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '20px', textAlign: 'center' }}>
                * El precio final se confirmará en el local.
              </p>
            )}
          </aside>

        </section>
      </div>
    </>
  );
}