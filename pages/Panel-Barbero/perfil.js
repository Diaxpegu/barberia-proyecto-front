import { useEffect, useState } from "react";
import DashboardLayoutBarbero from "../../components/DashboardLayoutBarbero";

export default function PerfilBarbero() {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://barberia-proyecto-back-production-f876.up.railway.app";

  const [barbero, setBarbero] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevaEspecialidad, setNuevaEspecialidad] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("barberId") || localStorage.getItem("_id");
    if (!id) {
      window.location.href = "/login";
      return;
    }
    const cargarBarbero = async () => {
      try {
        const res = await fetch(`${backendUrl}/barberos/${id}`);
        if (!res.ok) throw new Error("Error al cargar barbero");
        const data = await res.json();
        setBarbero(data);
        setNuevoNombre(data.nombre || "");
        setNuevaEspecialidad(data.especialidad || "");
      } catch (err) {
        console.error(err);
      }
    };
    cargarBarbero();
  }, [backendUrl]);

  const guardarCambios = async () => {
    alert("Funcionalidad pendiente (PUT en desarrollo)");
  };

  if (!barbero) return <p>Cargando perfil...</p>;

  return (
    <DashboardLayoutBarbero usuario={barbero.usuario}>
      <h2>Mi Perfil</h2>

      <div className="perfil-card">
        <img src="/valiant.jpg" alt="Foto" className="perfil-foto" />
        <div className="perfil-info">
          <label>Nombre:</label>
          <input
            type="text"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
          />

          <label>Usuario:</label>
          <input type="text" value={barbero.usuario} disabled />

          <label>Especialidad:</label>
          <input
            type="text"
            value={nuevaEspecialidad}
            onChange={(e) => setNuevaEspecialidad(e.target.value)}
          />

          <button onClick={guardarCambios} className="btn-guardar">
            Guardar cambios
          </button>
        </div>
      </div>

      <style jsx>{`
        .perfil-card {
          display: flex;
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
          gap: 2rem;
          align-items: center;
          max-width: 600px;
        }
        .perfil-foto {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
        }
        .perfil-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        input {
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 6px;
        }
        .btn-guardar {
          margin-top: 1rem;
          background: #28a745;
          color: white;
          border: none;
          padding: 0.6rem;
          border-radius: 6px;
          cursor: pointer;
        }
      `}</style>
    </DashboardLayoutBarbero>
  );
}
