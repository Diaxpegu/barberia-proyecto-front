import { useState } from "react";

export default function Home() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");

  const enviarCliente = async () => {
    const res = await fetch(
      "https://web-production-23c06.up.railway.app/clientes/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo }),
      }
    );
    const data = await res.json();
    setMensaje(`Cliente ${data.nombre} agregado con ID ${data.id}`);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Formulario de clientes</h1>
      <input
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <input
        placeholder="Correo"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
      />
      <button onClick={enviarCliente}>Enviar</button>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}
