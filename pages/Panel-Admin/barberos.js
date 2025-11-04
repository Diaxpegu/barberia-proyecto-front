import { useEffect, useState } from "react";
import DashboardLayoutAdmin from "../../components/DashboardLayoutAdmin";
import DataTable from "../../components/DataTable";

export default function BarberosAdmin() {
  const [rows, setRows] = useState([]);
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://barberia-proyecto-back-production-f876.up.railway.app";

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

  const agregar = async () => {
    const nombre = prompt("Nombre del barbero:");
    const usuario = prompt("Usuario (login):");
    const contrasena = prompt("Contraseña:");
    const especialidad = prompt("Especialidad:");
    if (!nombre || !usuario || !contrasena) return;

    const body = {
      nombre,
      usuario,
      contrasena,
      especialidad: especialidad || null,
    };

    const res = await fetch(`${backendUrl}/barberos/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const out = await res.json();
    if (!res.ok) return alert(out.detail || "Error al crear");
    alert(out.mensaje || "Barbero creado");
    cargar();
  };

  const eliminar = async () => {
    const id = prompt("ID del barbero a eliminar:");
    if (!id) return;
    const res = await fetch(`${backendUrl}/barberos/${id}`, { method: "DELETE" });
    const out = await res.json();
    if (!res.ok) return alert(out.detail || "Error al eliminar");
    alert(out.mensaje || "Eliminado");
    cargar();
  };

  return (
    <DashboardLayoutAdmin usuario="Administrador">
      <div className="toolbar">
        <button onClick={agregar}>Agregar Barbero</button>
        <button onClick={eliminar} className="danger">Eliminar Barbero</button>
      </div>

      <DataTable
        columnas={["nombre", "usuario", "especialidad", "disponibilidades"]}
        data={rows}
      />

      <style jsx>{`
        .toolbar {
          display: flex;
          gap: 10px;
          margin-bottom: 16px;
        }
        button {
          background: #0ea5e9;
          border: 0;
          padding: 10px 12px;
          border-radius: 8px;
          color: #fff;
          cursor: pointer;
        }
        .danger { background: #ef4444; }
      `}</style>
    </DashboardLayoutAdmin>
  );
}
