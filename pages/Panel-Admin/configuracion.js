import DashboardLayoutAdmin from "@/components/DashboardLayoutAdmin";

export default function ConfiguracionAdmin() {
  return (
    <DashboardLayoutAdmin usuario="Administrador">
      <h2>Configuración del Sistema</h2>
      <p>Aquí podrás ajustar los parámetros generales de la barbería (logo, horarios, dirección, etc.).</p>
      <div className="placeholder">
        <p>⚙️ Módulo en construcción.</p>
      </div>
    </DashboardLayoutAdmin>
  );
}
