import { useEffect, useState } from "react";
import DashboardLayoutAdmin from "../../components/DashboardLayoutAdmin";
import DataTable from "../../components/DataTable";

export default function BarberosAdmin() {
  const [rows, setRows] = useState([]);
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://barberia-proyecto-back-production-f876.up.railway.app";

  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const [showModalEliminar, setShowModalEliminar] = useState(false);

  // ESTADOS PARA FORMULARIOS 
  const [nuevoBarbero, setNuevoBarbero] = useState({
    nombre: "",
    usuario: "",
    contrasena: "",
    especialidad: ""
  });
  const [idEliminar, setIdEliminar] = useState("");

  const cargar = async () => {
    try {
      const r = await fetch(`${backendUrl}/barberos/`);
      const data = await r.json();
      const form = data.map((b) => ({
        _id: b._id,
        nombre: b.nombre || "-",
        usuario: b.usuario || "-",
        especialidad: b.especialidad || "No asignada",
        disponibilidades:
          typeof b.disponibilidades === "string"
            ? b.disponibilidades
            : Array.isArray(b.disponibilidades)
              ? `${b.disponibilidades.length} horarios`
              : "-",
      }));
      setRows(form);
    } catch (e) {
      console.error(e);
      setRows([]);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  // AGREGAR 
  const confirmarAgregar = async (e) => {
    e.preventDefault();
    if (!nuevoBarbero.nombre || !nuevoBarbero.usuario || !nuevoBarbero.contrasena) {
      alert("Por favor complete los campos obligatorios.");
      return;
    }

    const body = {
      nombre: nuevoBarbero.nombre,
      usuario: nuevoBarbero.usuario,
      contrasena: nuevoBarbero.contrasena,
      especialidad: nuevoBarbero.especialidad || null,
    };

    try {
      const res = await fetch(`${backendUrl}/barberos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const out = await res.json();
      if (!res.ok) return alert(out.detail || "Error al crear");

      alert(out.mensaje || "Barbero creado correctamente");
      setShowModalAgregar(false);
      setNuevoBarbero({ nombre: "", usuario: "", contrasena: "", especialidad: "" });
      cargar();
    } catch (e) {
      alert("Error de conexión al crear barbero");
    }
  };

  // ELIMINAR 
  const confirmarEliminar = async (e) => {
    e.preventDefault();
    if (!idEliminar) return;

    try {
      const res = await fetch(`${backendUrl}/barberos/${idEliminar}`, { method: "DELETE" });
      const out = await res.json();
      if (!res.ok) return alert(out.detail || "Error al eliminar");

      alert(out.mensaje || "Barbero eliminado correctamente");
      setShowModalEliminar(false);
      setIdEliminar("");
      cargar();
    } catch (e) {
      alert("Error de conexión al eliminar barbero");
    }
  };

  return (
    <DashboardLayoutAdmin usuario="Administrador">
      <div className="admin-header">
        <h2>Gestión de Barberos</h2>

        {/* BOTONES*/}
        <div className="admin-toolbar">
          <button className="btn-admin-action btn-verde" onClick={() => setShowModalAgregar(true)}>
            <i className="fas fa-plus"></i> Agregar Barbero
          </button>
          <button className="btn-admin-action btn-rojo" onClick={() => setShowModalEliminar(true)}>
            <i className="fas fa-trash"></i> Eliminar Barbero
          </button>
        </div>
      </div>

      <DataTable
        columnas={["_id", "nombre", "usuario", "especialidad", "disponibilidades"]}
        data={rows}
      />

      {/* MODAL AGREGAR */}
      {showModalAgregar && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Agregar Nuevo Barbero</h3>
            <form onSubmit={confirmarAgregar}>
              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  value={nuevoBarbero.nombre}
                  onChange={(e) => setNuevoBarbero({ ...nuevoBarbero, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Usuario (Login):</label>
                <input
                  type="text"
                  value={nuevoBarbero.usuario}
                  onChange={(e) => setNuevoBarbero({ ...nuevoBarbero, usuario: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Contraseña:</label>
                <input
                  type="password"
                  value={nuevoBarbero.contrasena}
                  onChange={(e) => setNuevoBarbero({ ...nuevoBarbero, contrasena: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Especialidad:</label>
                <input
                  type="text"
                  value={nuevoBarbero.especialidad}
                  onChange={(e) => setNuevoBarbero({ ...nuevoBarbero, especialidad: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-admin-action btn-gris" onClick={() => setShowModalAgregar(false)}>Cancelar</button>
                <button type="submit" className="btn-admin-action btn-verde">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR */}
      {showModalEliminar && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Eliminar Barbero</h3>
            <p>Por favor, ingresa el ID del barbero que deseas eliminar (puedes copiarlo de la tabla).</p>
            <form onSubmit={confirmarEliminar}>
              <div className="form-group">
                <label>ID del Barbero:</label>
                <input
                  type="text"
                  value={idEliminar}
                  onChange={(e) => setIdEliminar(e.target.value)}
                  placeholder="Ej: 64f8a..."
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-admin-action btn-gris" onClick={() => setShowModalEliminar(false)}>Cancelar</button>
                <button type="submit" className="btn-admin-action btn-rojo">Eliminar Definitivamente</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayoutAdmin>
  );
}