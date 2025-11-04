"use client";
import { useRouter } from "next/router";
import Link from "next/link";
import React, { useEffect } from "react";

export default function Confirmacion() {
  const router = useRouter();
  const { query } = router; 


  useEffect(() => {

    if (Object.keys(query).length === 0 && router.isReady) {
      router.push("/");
    }
  }, [query, router, router.isReady]);


  if (Object.keys(query).length === 0) {
    return <p className="loading-container">Cargando confirmación...</p>;
  }

  return (
    <section className="confirmacion-page-wrapper">
      
      <div className="confirmacion-card">
        
        <div className="confirmacion-header">
          <i className="fas fa-check-circle"></i>
          <h2>¡Reserva Confirmada!</h2>
          <p>Tu reserva ha sido agendada exitosamente</p>
        </div>

        <div className="confirmacion-detalles">
          <h3>Detalles de tu reserva</h3>
        
          <div className="confirmacion-detalles-grid">
            <div className="detalle-item">
              <strong>Número de reserva:</strong>
              <span>#{query.reservaId || "N/A"}</span>
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

        <div className="confirmacion-info">
          <p>
            <i className="fas fa-info-circle"></i> Recibirás un correo de
            confirmación con los detalles de tu reserva.
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
    </section>
  );
}