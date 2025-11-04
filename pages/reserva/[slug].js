import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Reserva() {
  const router = useRouter();
  const { slug } = router.query;

  const [peluquero, setPeluquero] = useState(null);
  const [formData, setFormData] = useState({
    fecha: "",
    hora: "",
    servicio: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    rut: "",
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availableHours, setAvailableHours] = useState({});

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'https://barberia-proyecto-back-production-f876.up.railway.app';

  // Cargar datos del barbero y su disponibilidad
  useEffect(() => {
    if (!slug) return;

    const cargarBarbero = async () => {
      try {
        // buscamos por nombre (slug convertido a mayúsculas/minúsculas)
        const resBarberos = await fetch(`${backendUrl}/barberos/`);
        const todos = await resBarberos.json();
        const barberoEncontrado = todos.find(
          (b) =>
            b.nombre.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
        );

        if (!barberoEncontrado) {
          setPeluquero(null);
          return;
        }

        // obtener sus horarios disponibles
        const resHorarios = await fetch(
          `${backendUrl}/barberos/${barberoEncontrado._id}/disponibilidades`
        );
        const dataHorarios = await resHorarios.json();

        // convertir a formato fecha: hora: 'disponible'
        const formateado = {};
        dataHorarios.forEach((slot) => {
          if (!formateado[slot.fecha]) formateado[slot.fecha] = {};
          formateado[slot.fecha][slot.hora] = slot.estado;
        });

        setPeluquero({
          ...barberoEncontrado,
          horarios: formateado,
          servicios: ["Corte básico", "Corte premium", "Tintura", "Lavado", "Peinado"],
          precios: {
            "Corte básico": 15000,
            "Corte premium": 20000,
            Tintura: 25000,
            Lavado: 5000,
            Peinado: 10000,
          },
        });
      } catch (err) {
        console.error("Error al cargar barbero:", err);
        setPeluquero(null);
      }
    };

    cargarBarbero();
  }, [slug]);

  // manejar horarios según fecha seleccionada
  useEffect(() => {
    if (selectedDate && peluquero && peluquero.horarios[selectedDate]) {
      setAvailableHours(peluquero.horarios[selectedDate]);
    } else {
      setAvailableHours({});
    }
    setFormData((prev) => ({ ...prev, hora: "" }));
  }, [selectedDate, peluquero]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    setFormData((prev) => ({ ...prev, fecha: newDate }));
    setError("");
  };

  const handleHourChange = (e) => {
    setFormData((prev) => ({ ...prev, hora: e.target.value }));
    setError("");
  };

  const handleNextStep = () => {
    setError("");
    if (currentStep === 1) {
      if (!formData.fecha) return setError("Por favor, seleccione una fecha.");
      if (!formData.hora) return setError("Por favor, seleccione un horario.");
      if (!formData.servicio) return setError("Por favor, seleccione un servicio.");
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.nombre || !formData.apellido || !formData.email || !formData.telefono) {
      setError("Por favor, completa todos los campos obligatorios (*).");
      return;
    }

    try {
      console.log("Datos de la reserva a guardar:", {
        peluqueroNombre: peluquero.nombre,
        ...formData,
      });

      router.push({
        pathname: "/confirmacion",
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
          reservaId: Math.random().toString(36).substr(2, 9).toUpperCase(),
        },
      });
    } catch (err) {
      console.error("Error al procesar la reserva:", err);
      setError("Hubo un problema al agendar tu reserva. Inténtalo de nuevo.");
    }
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "-";
    const [year, month, day] = dateString.split("-");
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
    ];
    return `${parseInt(day)} de ${months[parseInt(month) - 1]} de ${year}`;
  };

  const getServicePrice = (serviceName) => {
    if (peluquero && peluquero.precios && serviceName) {
      return `$${peluquero.precios[serviceName]}`;
    }
    return "-";
  };

  if (!peluquero) {
    return (
      <section className="reserva-container">
        <p>Cargando información del barbero...</p>
      </section>
    );
  }

  return (
    <section className="reserva-container">
      <h2>Reserva con {peluquero.nombre}</h2>
      <p className="instagram">
        <i className="fab fa-instagram"></i>
        <a
          href={`https://instagram.com/${peluquero.usuario}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          @{peluquero.usuario}
        </a>
      </p>

      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}

      {/* Indicador de pasos */}
      <div className="reserva-steps">
        <div className={`step ${currentStep === 1 ? "active" : ""}`} data-step="1">
          <span className="step-number">1</span>
          <span className="step-label">Fecha y Hora</span>
        </div>
        <div className={`step ${currentStep === 2 ? "active" : ""}`} data-step="2">
          <span className="step-number">2</span>
          <span className="step-label">Datos de Contacto</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="reserva-form">
        {/* Paso 1: Fecha y Hora */}
        <div className={`form-step ${currentStep === 1 ? "active" : ""}`}>
          <div className="form-group">
            <label htmlFor="fecha">Fecha:</label>
            <input
              type="date"
              id="fecha"
              name="fecha"
              required
              value={formData.fecha}
              onChange={handleDateChange}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="form-group">
            <label>Horarios Disponibles:</label>
            <div className="time-sections">
              {["Mañana", "Tarde"].map((periodo, i) => {
                const horas =
                  i === 0
                    ? ["08:00", "09:00", "10:00", "11:00"]
                    : ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
                return (
                  <div key={periodo} className="time-section">
                    <h4>{periodo}</h4>
                    <div className="horarios-grid">
                      {horas.map((hora) => {
                        const estado = availableHours[hora] || "no-disponible";
                        return (
                          <div key={hora} className={`hora-slot ${estado}`}>
                            <input
                              type="radio"
                              name="hora"
                              value={hora}
                              id={`hora-${hora}`}
                              checked={formData.hora === hora}
                              onChange={handleHourChange}
                              disabled={estado !== "disponible"}
                              required
                            />
                            <label htmlFor={`hora-${hora}`}>
                              {hora} - <span className="estado">{estado}</span>
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="servicio">Servicio:</label>
            <select
              name="servicio"
              id="servicio"
              value={formData.servicio}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un servicio</option>
              {peluquero.servicios.map((servicio, index) => (
                <option key={index} value={servicio}>
                  {servicio} - ${peluquero.precios[servicio]}
                </option>
              ))}
            </select>
          </div>

          <div className="form-navigation">
            <button type="button" className="btn-next" onClick={handleNextStep}>
              Siguiente
            </button>
          </div>
        </div>

        {/* Paso 2: Datos de Contacto */}
        <div className={`form-step ${currentStep === 2 ? "active" : ""}`}>
          <h3>
            <i className="fas fa-user-edit"></i> Tus Datos
          </h3>

          {["nombre", "apellido", "email", "telefono", "rut"].map((campo) => (
            <div className="form-group" key={campo}>
              <label htmlFor={campo}>
                {campo.charAt(0).toUpperCase() + campo.slice(1)}{" "}
                {["nombre", "apellido", "email", "telefono"].includes(campo)
                  ? "*"
                  : ""}
              </label>
              <input
                type={campo === "email" ? "email" : "text"}
                id={campo}
                name={campo}
                value={formData[campo]}
                onChange={handleChange}
                required={["nombre", "apellido", "email", "telefono"].includes(
                  campo
                )}
              />
            </div>
          ))}

          <div className="form-navigation">
            <button type="button" className="btn-prev" onClick={handlePrevStep}>
              Anterior
            </button>
            <button type="submit" className="btn-confirmar">
              <i className="fas fa-check-circle"></i> Agendar
            </button>
          </div>
        </div>
      </form>

      {/* Resumen */}
      <div className="reserva-summary">
        <h4>Resumen de tu reserva</h4>
        <div className="summary-content">
          <div className="summary-item"><strong>Servicio:</strong> <span>{formData.servicio || "-"}</span></div>
          <div className="summary-item"><strong>Precio:</strong> <span>{getServicePrice(formData.servicio)}</span></div>
          <div className="summary-item"><strong>Fecha:</strong> <span>{formatDisplayDate(formData.fecha)}</span></div>
          <div className="summary-item"><strong>Hora:</strong> <span>{formData.hora || "-"}</span></div>
          <div className="summary-item"><strong>Barbero:</strong> <span>{peluquero.nombre}</span></div>
          <div className="summary-item"><strong>Lugar:</strong> <span>VALIANT Barbería</span></div>
        </div>
      </div>
    </section>
  );
}
