export default function DataTable({ data, columnas }) {
  if (!data || data.length === 0) return <p>No hay datos disponibles.</p>;

  return (
    <table className="tabla-datos">
      <thead>
        <tr>
          {columnas.map((col) => (
            <th key={col}>{col.replaceAll("_", " ")}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((fila, i) => (
          <tr key={i}>
            {columnas.map((col) => (
              <td key={col}>{String(fila[col] ?? "-")}</td>
            ))}
          </tr>
        ))}
      </tbody>
      <style jsx>{`
        .tabla-datos {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
        }
        th {
          background: #343a40;
          color: white;
          padding: 0.6rem;
          text-transform: capitalize;
        }
        td {
          padding: 0.5rem;
          border-bottom: 1px solid #ddd;
        }
        tr:hover td {
          background: #f1f3f5;
        }
      `}</style>
    </table>
  );
}
