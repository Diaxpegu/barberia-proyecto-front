import { useEffect, useState } from "react";
import DashboardLayoutBarbero from "../../components/DashboardLayoutBarbero";

export default function PerfilBarbero() {
  const [barbero, setBarbero] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevaEspecialidad, setNuevaEspecialidad] = useState("");

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://barberia-proyecto-back-production-f876.up.railway.app";

  useEffect(() => {
    const id = localStorage.getItem("barberId");
    if (!id) return;
    fetch(`${backendUrl}/barberos/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setBarbero(data);
        setNuevoNombre(data.nombre);
        setNuevaEspecialidad(data.especialidad);
      })
      .catch(() => alert("Error al cargar perfil"));
  }, [backendUrl]);

  const guardarCambios = async () => {
    try {
      const res = await fetch(`${backendUrl}/barberos/${barbero._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nuevoNombre,
          especialidad: nuevaEspecialidad,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Error al guardar");
      alert("Perfil actualizado correctamente.");
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <DashboardLayoutBarbero usuario={barbero?.usuario}>
      <h2>Mi Perfil</h2>
      {barbero ? (
        <div className="perfil-container">
          <div className="form-group">
            <label>Nombre:</label>
            <input
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Usuario:</label>
            <input value={barbero.usuario} disabled />
          </div>
          <div className="form-group">
            <label>Especialidad:</label>
            <input
              value={nuevaEspecialidad}
              onChange={(e) => setNuevaEspecialidad(e.target.value)}
            />
          </div>
          <button onClick={guardarCambios} className="btn-guardar">
            Guardar cambios
          </button>
        </div>
      ) : (
        <p>Cargando...</p>
      )}
    </DashboardLayoutBarbero>
  );
}
