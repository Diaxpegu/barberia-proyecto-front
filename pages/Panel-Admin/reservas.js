import { useEffect, useState } from "react";
import DashboardLayoutAdmin from "../../components/DashboardLayoutAdmin";

export default function ReservasAdmin() {
  const [reservas, setReservas] = useState([]);
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://barberia-proyecto-back-production-f876.up.railway.app";

  const cargarReservas = async () => {
    try {
      const r = await fetch(`${backendUrl}/reservas/detalle/`);
      const data = await r.json();
      setReservas(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setReservas([]);
    }
  };

  useEffect(() => {
    cargarReservas();
  }, [backendUrl]);

  const actualizarEstado = async (id, nuevoEstado) => {
    if (!confirm(`¿Marcar reserva como "${nuevoEstado}"?`)) return;

    try {
      const res = await fetch(`${backendUrl}/reservas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (res.ok) {
        alert("Estado actualizado correctamente");
        cargarReservas();
      } else {
        alert("Error al actualizar");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    }
  };

  return (
    <DashboardLayoutAdmin usuario="Administrador">
      <h2>Gestión de Reservas</h2>
      <p>Control de asistencia y estados.</p>

      <div className="tabla-container">
        <table className="tabla-custom">
          <thead>
            <tr>
              <th>Fecha/Hora</th>
              <th>Cliente</th>
              <th>Barbero</th>
              <th>Servicio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservas.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  No hay reservas registradas.
                </td>
              </tr>
            ) : (
              reservas.map((reserva) => {
                // Prevenir errores si vienen datos vacíos
                const cliente = reserva.cliente && reserva.cliente[0]
                  ? `${reserva.cliente[0].nombre} ${reserva.cliente[0].apellido || ''}`
                  : "Cliente desconocido";

                const barbero = reserva.barbero && reserva.barbero[0]
                  ? reserva.barbero[0].nombre
                  : "Sin asignar";

                const servicio = reserva.servicio && reserva.servicio[0]
                  ? reserva.servicio[0].nombre_servicio
                  : reserva.servicio_nombre || "-";

                return (
                  <tr key={reserva._id}>
                    <td>
                      {reserva.fecha} <br />
                      <small>{reserva.hora}</small>
                    </td>
                    <td>{cliente}</td>
                    <td>{barbero}</td>
                    <td>{servicio}</td>
                    <td>
                      <span className={`badge ${reserva.estado ? reserva.estado.replace(" ", "-") : "pendiente"}`}>
                        {reserva.estado || "pendiente"}
                      </span>
                    </td>
                    <td>
                      <div className="acciones-btns">
                        <button
                          className="btn-asistio"
                          onClick={() => actualizarEstado(reserva._id, "asistio")}
                          title="Marcar como Asistió"
                        >
                          <i className="fas fa-check"></i> Asistió
                        </button>
                        <button
                          className="btn-no-asistio"
                          onClick={() => actualizarEstado(reserva._id, "no asistio")}
                          title="Marcar como No Asistió"
                        >
                          <i className="fas fa-times"></i> Faltó
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayoutAdmin>
  );
}