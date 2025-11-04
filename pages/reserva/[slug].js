import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

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

  useEffect(() => {
    if (!slug) return;

    const cargarBarbero = async () => {
      try {
        const resBarberos = await fetch(`${backendUrl}/barberos/`);
        const todos = await resBarberos.json();
        
        // Función para crear slugs (igual a la de la pág principal)
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
      <section className="reserva-container loading-container">
        <p>Cargando información del barbero...</p>
      </section>
    );
  }

  return (
    <>
      <section className="reserva-container">
        
        {/* FORMULARIO */}
        <div className="reserva-form-wrapper">
          {error && <div className="error-message">{error}</div>}

          {peluquero && (
            <>
              <h2>Reserva con {peluquero.nombre}</h2>

              <form onSubmit={handleSubmit} className="reserva-form">
                {currentStep === 1 && (
                  <div className="form-step active">
                    <div className="form-group">
                      <label>Fecha:</label>
                      <input
                        type="date"
                        className="datepicker"
                        value={formData.fecha}
                        onChange={handleDateChange}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div className="form-group">
                      <label>Horarios disponibles:</label>
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
                          <p>No hay horas para esta fecha. Selecciona otro día.</p>
                        )}
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Servicio:</label>
                      <select
                        value={formData.servicio}
                        name="servicio"
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seleccionar servicio</option>
                        {peluquero.servicios.map((s) => (
                          <option key={s} value={s}>
                            {s} - ${peluquero.precios[s]}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-navigation">
                      <button type="button" onClick={handleNextStep} className="btn-next">
                        Siguiente
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="form-step active">
                    <div className="form-group">
                      <label>Nombre*</label>
                      <input name="nombre" value={formData.nombre} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label>Apellido*</label>
                      <input name="apellido" value={formData.apellido} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label>Email*</label>
                      <input name="email" type="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label>Teléfono*</label>
                      <input name="telefono" value={formData.telefono} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label>RUT (Opcional)</label>
                      <input name="rut" value={formData.rut} onChange={handleChange} />
                    </div>

                    <div className="form-navigation">
                      <button type="button" onClick={handlePrevStep} className="btn-prev">
                        Anterior
                      </button>
                      <button type="submit" className="btn-confirmar">
                        Agendar
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </>
          )}
        </div>

        {/* RESUMEN DE LA RESERVA */}
        <aside className="reserva-summary">
          <h4>Resumen de tu Reserva</h4>
          <div className="summary-content">
            <div className="summary-item">
              <strong>Barbero:</strong>
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
              <span>{formData.servicio || '---'}</span>
            </div>
            <div className="summary-item">
              <strong>Cliente:</strong>
              <span>{formData.nombre || '---'}</span>
            </div>
          </div>
        </aside>

      </section>
    </>
  );
}