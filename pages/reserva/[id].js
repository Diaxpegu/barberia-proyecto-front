import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function Reserva() {
  const router = useRouter();
  const { id } = router.query; // Obtiene el ID del peluquero de la URL

  // Datos simulados, estos vendrían de la base de datos
  const peluquerosData = [
    {
      id: '1',
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
      // Horarios simulados
      horarios: {
        '2023-11-20': { // Ejemplo para una fecha
          '08:00': 'disponible',
          '09:00': 'disponible',
          '10:00': 'ocupado',
          '11:00': 'disponible',
          '12:00': 'disponible',
          '13:00': 'disponible',
          '14:00': 'ocupado',
          '15:00': 'disponible',
          '16:00': 'disponible',
          '17:00': 'disponible',
        },
        '2023-11-21': { 
          '08:00': 'disponible',
          '09:00': 'disponible',
          '10:00': 'disponible',
          '11:00': 'disponible',
          '12:00': 'disponible',
          '13:00': 'disponible',
          '14:00': 'disponible',
          '15:00': 'disponible',
          '16:00': 'disponible',
          '17:00': 'disponible',
        },
      },
    },
    {
      id: '2',
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
      horarios: {
        '2023-11-20': {
          '08:00': 'disponible',
          '09:00': 'ocupado',
          '10:00': 'disponible',
          '11:00': 'disponible',
          '12:00': 'disponible',
          '13:00': 'ocupado',
          '14:00': 'disponible',
          '15:00': 'disponible',
          '16:00': 'disponible',
          '17:00': 'disponible',
        },
      },
    },
  ];

  // Busca el peluquero actual por el ID de la URL
  const peluquero = peluquerosData.find((p) => p.id === id);

  // --- Estados del formulario y la UI ---
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
  const [currentStep, setCurrentStep] = useState(1); // Controla el paso actual del formulario
  const [error, setError] = useState(''); // Para mostrar mensajes de error
  const [selectedDate, setSelectedDate] = useState(''); // Fecha seleccionada en el calendario
  const [availableHours, setAvailableHours] = useState({}); // Horarios disponibles para la fecha seleccionada

  // --- Efecto para cargar horarios cuando cambia la fecha seleccionada ---
  useEffect(() => {
    if (selectedDate && peluquero && peluquero.horarios[selectedDate]) {
      setAvailableHours(peluquero.horarios[selectedDate]);
    } else {
      setAvailableHours({}); // No hay horarios para la fecha o peluquero
    }
    // Limpiar la hora seleccionada si la fecha cambia
    setFormData((prev) => ({ ...prev, hora: '' }));
  }, [selectedDate, peluquero]);

  // --- Manejadores de eventos ---

  // Maneja cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(''); // Limpia errores al cambiar un campo
  };

  // Maneja la selección de fecha desde el datepicker
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    setFormData((prev) => ({ ...prev, fecha: newDate }));
    setError('');
  };

  // Maneja la selección de hora (radio buttons)
  const handleHourChange = (e) => {
    setFormData((prev) => ({ ...prev, hora: e.target.value }));
    setError('');
  };

  // Navega al siguiente paso del formulario
  const handleNextStep = () => {
    setError(''); // Limpia errores antes de validar

    // Validar campos del Paso 1
    if (currentStep === 1) {
      if (!formData.fecha) {
        setError('Por favor, seleccione una fecha.');
        return;
      }
      if (!formData.hora) {
        setError('Por favor, seleccione un horario.');
        return;
      }
      if (!formData.servicio) {
        setError('Por favor, seleccione un servicio.');
        return;
      }
    }

    // Si la validación es exitosa, avanza al siguiente paso
    setCurrentStep((prev) => prev + 1);
  };

  // Navega al paso anterior del formulario
  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
    setError(''); // Limpia errores al retroceder
  };

  // --- Envío del formulario ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpia errores antes de enviar

    // Valida campos del Paso 2
    if (!formData.nombre || !formData.apellido || !formData.email || !formData.telefono) {
      setError('Por favor, completa todos los campos obligatorios (*).');
      return;
    }

    // --- Lógica para guardar la reserva en la base de datos ---
    // enviar los datos a tu backend

    try {
      // Buscar ejemplo de cómo enviar los datos a un backend

      
      
      // --- Simulación de éxito (eliminar en producción) ---
      console.log('Datos de la reserva a guardar:', {
        peluqueroId: peluquero.id,
        peluqueroNombre: peluquero.nombre,
        ...formData,
      });

      // Redirigir a la página de confirmación con los datos de la reserva
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
        },
      });

    } catch (err) {
      console.error('Error al procesar la reserva:', err);
      setError(err.message || 'Hubo un problema al agendar tu reserva. Inténtalo de nuevo.');
    }
  };

  // --- Funciones de utilidad para el resumen ---
  // Formatea la fecha
  const formatDisplayDate = (dateString) => {
    if (!dateString) return '-';
    const [year, month, day] = dateString.split('-');
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${parseInt(day)} de ${months[parseInt(month) - 1]} de ${year}`;
  };

  // Obtiene el precio del servicio seleccionado
  const getServicePrice = (serviceName) => {
    if (peluquero && peluquero.precios && serviceName) {
      return `$${peluquero.precios[serviceName]}`;
    }
    return '-';
  };

  // --- JSX de la página de reserva (utilizado por cambiar el html) ---
  return (
    <section className="reserva-container">
      <h2>Reserva con {peluquero.nombre}</h2>
      <p className="instagram">
        <i className="fab fa-instagram"></i>
        <a href={`https://instagram.com/${peluquero.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
          {peluquero.instagram}
        </a>
      </p>

      {/* Mensaje de error */}
      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}

      {/* Indicador de pasos */}
      <div className="reserva-steps">
        <div className={`step ${currentStep === 1 ? 'active' : ''}`} data-step="1">
          <span className="step-number">1</span>
          <span className="step-label">Fecha y Hora</span>
        </div>
        <div className={`step ${currentStep === 2 ? 'active' : ''}`} data-step="2">
          <span className="step-number">2</span>
          <span className="step-label">Datos de Contacto</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="reserva-form" id="reservaForm">
        {/* Paso 1: Fecha y Hora */}
        <div className={`form-step ${currentStep === 1 ? 'active' : ''}`} id="step1">
          <div className="form-group">
            <label htmlFor="fecha">Fecha:</label>
            <input
              type="date"
              id="fecha"
              name="fecha"
              className="datepicker"
              required
              value={formData.fecha}
              onChange={handleDateChange}
              min={new Date().toISOString().split('T')[0]} // No permite fechas pasadas
            />
            <div id="calendar-container"></div>
          </div>

          <div className="form-group">
            <label>Horarios Disponibles:</label>
            <div className="time-sections">
              {/* Horarios de Mañana */}
              <div className="time-section">
                <h4>Mañana</h4>
                <div className="horarios-grid">
                  {['08:00', '09:00', '10:00', '11:00'].map((hora) => {
                    const estado = availableHours[hora] || 'no-disponible'; // 'disponible', 'ocupado', 'no-disponible'
                    return (
                      <div key={hora} className={`hora-slot ${estado}`}>
                        <input
                          type="radio"
                          name="hora"
                          value={hora}
                          id={`hora-${hora}`}
                          checked={formData.hora === hora}
                          onChange={handleHourChange}
                          disabled={estado !== 'disponible'}
                          required
                        />
                        <label htmlFor={`hora-${hora}`}>
                          {hora} - <span className="estado">{estado.replace('-', ' ').capitalize()}</span>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Horarios de Tarde */}
              <div className="time-section">
                <h4>Tarde</h4>
                <div className="horarios-grid">
                  {['12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((hora) => {
                    const estado = availableHours[hora] || 'no-disponible';
                    return (
                      <div key={hora} className={`hora-slot ${estado}`}>
                        <input
                          type="radio"
                          name="hora"
                          value={hora}
                          id={`hora-${hora}`}
                          checked={formData.hora === hora}
                          onChange={handleHourChange}
                          disabled={estado !== 'disponible'}
                          required
                        />
                        <label htmlFor={`hora-${hora}`}>
                          {hora} - <span className="estado">{estado.replace('-', ' ').capitalize()}</span>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="servicio">Servicio:</label>
            <select name="servicio" id="servicio" value={formData.servicio} onChange={handleChange} required>
              <option value="">Seleccione un servicio</option>
              {peluquero.servicios.map((servicio, index) => (
                <option key={index} value={servicio}>
                  {servicio} - ${peluquero.precios[servicio]}
                </option>
              ))}
            </select>
          </div>

          <div className="form-navigation">
            <button type="button" className="btn-next" onClick={handleNextStep}>Siguiente</button>
          </div>
        </div>

        {/* Paso 2: Datos de Contacto */}
        <div className={`form-step ${currentStep === 2 ? 'active' : ''}`} id="step2">
          <h3><i className="fas fa-user-edit"></i> Tus Datos</h3>

          <div className="form-group">
            <label htmlFor="nombre">Nombre *</label>
            <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="apellido">Apellido *</label>
            <input type="text" id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono *</label>
            <input type="tel" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="rut">RUT:</label>
            <input type="text" id="rut" name="rut" value={formData.rut} onChange={handleChange} />
          </div>

          <div className="form-navigation">
            <button type="button" className="btn-prev" onClick={handlePrevStep}>Anterior</button>
            <button type="submit" className="btn-confirmar">
              <i className="fas fa-check-circle"></i> Agendar
            </button>
          </div>
        </div>
      </form>

      {/* Resumen de la reserva*/}
      <div className="reserva-summary">
        <h4>Resumen de tu reserva</h4>
        <div className="summary-content">
          <div className="summary-item">
            <strong>Servicio:</strong>
            <span id="summary-servicio">{formData.servicio || '-'}</span>
          </div>
          <div className="summary-item">
            <strong>Precio:</strong>
            <span id="summary-precio">{getServicePrice(formData.servicio)}</span>
          </div>
          <div className="summary-item">
            <strong>Fecha:</strong>
            <span id="summary-fecha">{formatDisplayDate(formData.fecha)}</span>
          </div>
          <div className="summary-item">
            <strong>Hora:</strong>
            <span id="summary-hora">{formData.hora || '-'}</span>
          </div>
          <div className="summary-item">
            <strong>Barbero:</strong>
            <span>{peluquero.nombre}</span>
          </div>
          <div className="summary-item">
            <strong>Lugar:</strong>
            <span>VALIANT Barbería</span>
          </div>
        </div>
      </div>
    </section>
  );
}
// Esto es para el estado de los horarios (disponible, ocupado)
if (!String.prototype.capitalize) {
  String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  }
}