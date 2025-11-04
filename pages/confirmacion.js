"use client";
import { useRouter } from "next/router";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Confirmacion() {
  const router = useRouter();
  const { query } = router;
  const [reserva, setReserva] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://barberia-proyecto-back-production-f876.up.railway.app";

  useEffect(() => {
    if (!router.isReady) return;

    const crearReserva = async () => {
      try {
        const body = {
          id_barbero: query.id_barbero,
          fecha: query.fecha,
          hora: query.hora,
          nombre_cliente: query.clienteNombre,
          apellido_cliente: query.clienteApellido,
          email_cliente: query.clienteEmail,
          telefono_cliente: query.clienteTelefono,
          rut_cliente: query.clienteRut,
          servicio_nombre: query.servicio,
        };

        const res = await fetch(`${backendUrl}/reservas/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.detail || "Error al crear reserva");
        }

        setReserva(data);
        setMensaje("Reserva creada correctamente.");
      } catch (err) {
        console.error(err);
        setMensaje(`Hubo un problema al agendar tu reserva: ${err.message}`);
      }
    };

    crearReserva();
  }, [router.isReady, query, backendUrl]);

  if (!reserva && !mensaje) {
    return <p className="loading-container">Procesando tu reserva...</p>;
  }

  return (
    <section className="confirmacion-page-wrapper">
      <div className="confirmacion-card">
        <div className="confirmacion-header">
          <i className="fas fa-check-circle"></i>
          <h2>¡Reserva Enviada!</h2>
          <p>Tu solicitud de cita ha sido registrada correctamente.</p>
        </div>

        {reserva ? (
          <div className="confirmacion-detalles">
            <h3>Detalles de tu reserva</h3>
            <div className="confirmacion-detalles-grid">
              <div className="detalle-item">
                <strong>Número de reserva:</strong>
                <span>#{reserva.id_reserva || "N/A"}</span>
              </div>
              <div className="detalle-item">
                <strong>Servicio:</strong>
                <span>{query.servicio || "-"}</span>
              </div>
              <div className="detalle-item">
                <strong>Barbero:</strong>
                <span>{query.peluqueroNombre || "-"}</span>
              </div>
              <div className="detalle-item">
                <strong>Fecha:</strong>
                <span>{query.fecha || "-"}</span>
              </div>
              <div className="detalle-item">
                <strong>Hora:</strong>
                <span>{query.hora || "-"}</span>
              </div>
              <div className="detalle-item">
                <strong>Cliente:</strong>
                <span>
                  {query.clienteNombre} {query.clienteApellido}
                </span>
              </div>
              <div className="detalle-item">
                <strong>Email:</strong>
                <span>{query.clienteEmail}</span>
              </div>
              <div className="detalle-item">
                <strong>Teléfono:</strong>
                <span>{query.clienteTelefono}</span>
              </div>
              {query.clienteRut && (
                <div className="detalle-item">
                  <strong>RUT:</strong>
                  <span>{query.clienteRut}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="error-message">{mensaje}</p>
        )}

        <div className="confirmacion-info">
          <p>
            <i className="fas fa-info-circle"></i> Tu reserva será confirmada por
            nuestro administrador. Recibirás un correo cuando sea aprobada.
          </p>
          <p>
            <i className="fas fa-clock"></i> Por favor llega 5 minutos antes de tu
            hora agendada.
          </p>
        </div>

        <div className="confirmacion-acciones">
          <Link href="/" legacyBehavior>
            <a className="btn-back-home">
              <i className="fas fa-home"></i> Volver al Inicio
            </a>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .confirmacion-page-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
        }
        .confirmacion-card {
          background: white;
          max-width: 650px;
          width: 100%;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 2rem;
        }
        .confirmacion-header {
          text-align: center;
          color: #28a745;
        }
        .confirmacion-header i {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        .confirmacion-detalles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 0.5rem 1rem;
          margin-top: 1rem;
        }
        .detalle-item {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 0.6rem;
        }
        .confirmacion-info {
          margin-top: 1.5rem;
          background: #fff3cd;
          padding: 1rem;
          border-radius: 8px;
          color: #856404;
        }
        .btn-back-home {
          display: inline-block;
          margin-top: 1.5rem;
          background: #007bff;
          color: white;
          padding: 0.6rem 1rem;
          border-radius: 8px;
          text-decoration: none;
          text-align: center;
        }
      `}</style>
    </section>
  );
}
