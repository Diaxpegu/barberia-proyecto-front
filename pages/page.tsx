"use client";
import { useState } from "react";

export default function Home() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("https://web-production-23c06.up.railway.app/clientes/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo }),
      });

      if (!res.ok) throw new Error("Error en la creación del cliente");

      const data = await res.json();
      console.log("Cliente creado:", data);
      alert(`Cliente creado: ${data.nombre} (${data.correo})`);
    } catch (err) {
      console.error(err);
      alert("Error al crear cliente");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Registrar Cliente</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Correo:</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>
        <button type="submit">Crear Cliente</button>
      </form>
    </div>
  );
}
