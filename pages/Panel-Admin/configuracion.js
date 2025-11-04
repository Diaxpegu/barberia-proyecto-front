import DashboardLayoutAdmin from "../../components/DashboardLayoutAdmin";

export default function ConfiguracionAdmin() {
  return (
    <DashboardLayoutAdmin usuario="Administrador">
      <h2>Configuración General</h2>
      <p>Gestión de parámetros globales del sistema.</p>

      <div className="config-card">
        <h3>Opciones</h3>
        <ul>
          <li>Editar horarios globales</li>
          <li>Gestionar permisos de usuarios</li>
          <li>Exportar datos a CSV o Excel</li>
          <li>Reiniciar disponibilidad semanal</li>
        </ul>
      </div>

      <style jsx>{`
        .config-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          margin-top: 1rem;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        }
        ul {
          margin-top: 1rem;
          list-style: disc;
          margin-left: 2rem;
        }
        li {
          padding: 0.4rem 0;
        }
      `}</style>
    </DashboardLayoutAdmin>
  );
}
