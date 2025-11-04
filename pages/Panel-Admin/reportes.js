import DashboardLayoutAdmin from "../../components/DashboardLayoutAdmin";

export default function ReportesAdmin() {
  return (
    <DashboardLayoutAdmin usuario="Administrador">
      <h2>Reportes Generales</h2>
      <p>Aquí podrás ver métricas visuales de reservas, barberos y servicios.</p>
      <div className="placeholder">
        <p>📈 Próximamente: gráficos estadísticos.</p>
      </div>

      <style jsx>{`
        .placeholder {
          background: white;
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
      `}</style>
    </DashboardLayoutAdmin>
  );
}
