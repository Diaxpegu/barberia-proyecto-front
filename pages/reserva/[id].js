"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Reserva({ peluquero }) {
  const router = useRouter();

  // Previene errores si peluquero aún no está listo
  if (!peluquero) {
    return <p>Cargando datos del peluquero...</p>;
  }

  // --- Estados del formulario y la UI ---
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
      if (!formData.fecha)
        return setError("Por favor, seleccione una fecha.");
      if (!formData.hora)
        return setError("Por favor, seleccione un horario.");
      if (!formData.servicio)
        return setError("Por favor, seleccione un servicio.");
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

    if (
      !formData.nombre ||
      !formData.apellido ||
      !formData.email ||
      !formData.telefono
    ) {
      return setError("Por favor, completa todos los campos obligatorios (*).");
    }

    try {
      console.log("Datos de la reserva a guardar:", {
        peluqueroId: peluquero.id,
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
        },
      });
    } catch (err) {
      console.error("Error al procesar la reserva:", err);
      setError(
        err.message ||
          "Hubo un problema al agendar tu reserva. Inténtalo de nuevo."
      );
    }
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "-";
    const [year, month, day] = dateString.split("-");
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    return `${parseInt(day)} de ${months[parseInt(month) - 1]} de ${year}`;
  };

  const getServicePrice = (serviceName) => {
    if (peluquero && peluquero.precios && serviceName) {
      return `$${peluquero.precios[serviceName]}`;
    }
    return "-";
  };

  return (
    <section className="reserva-container">
      <h2>Reserva con {peluquero.nombre}</h2>
      <p className="instagram">
        <i className="fab fa-instagram"></i>
        <a
          href={`https://instagram.com/${peluquero.instagram.replace("@", "")}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {peluquero.instagram}
        </a>
      </p>

      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}

      {/* tu mismo JSX para los pasos y el formulario */}
      {/* ... */}
    </section>
  );
}

// getStaticPaths para definir rutas dinámicas
export async function getStaticPaths() {
  const peluqueroIds = ["1", "2"];
  const paths = peluqueroIds.map((id) => ({ params: { id } }));
  return { paths, fallback: false };
}

// getStaticProps para pasar datos al componente
export async function getStaticProps({ params }) {
  const peluquerosData = [
    {
      id: "1",
      nombre: "Lucas Aldair",
      instagram: "lukas__aldair",
      servicios: ["Corte básico", "Corte premium", "Tintura", "Lavado", "Peinado"],
      precios: {
        "Corte básico": 15000,
        "Corte premium": 20000,
        Tintura: 25000,
        Lavado: 5000,
        Peinado: 10000,
      },
      horarios: {
        "2025-10-23": { "08:00": "disponible", "09:00": "disponible" },
      },
    },
    {
      id: "2",
      nombre: "Alejandro",
      instagram: "ale_.cut",
      servicios: ["Corte básico", "Corte premium", "Tintura", "Lavado", "Peinado"],
      precios: {
        "Corte básico": 15000,
        "Corte premium": 20000,
        Tintura: 25000,
        Lavado: 5000,
        Peinado: 10000,
      },
      horarios: {
        "2025-10-23": { "08:00": "disponible", "09:00": "ocupado" },
      },
    },
  ];

  const peluquero = peluquerosData.find((p) => p.id === params.id);
  if (!peluquero) return { notFound: true };
  return { props: { peluquero } };
}
