export default function DataTable({ columnas = [], data = [] }) {
  const safeCols = columnas.filter((c) => c !== "_id" && c !== "contrasena");

  return (
    <div className="tabla-wrap">
      <table className="tabla">
        <thead>
          <tr>
            {safeCols.map((c) => (
              <th key={c}>{formatearCabecera(c)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={safeCols.length} className="no-data">
                No hay datos disponibles.
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={row._id || i}>
                {safeCols.map((c) => (
                  <td key={c}>{renderCell(row[c])}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <style jsx>{`
        .tabla-wrap {
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.06);
          overflow: hidden;
        }
        .tabla {
          width: 100%;
          border-collapse: collapse;
        }
        th {
          text-align: left;
          background: #111827;
          color: #fff;
          padding: 14px;
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.3px;
        }
        td {
          padding: 12px 14px;
          border-top: 1px solid #eef1f5;
        }
        .no-data {
          text-align: center;
          padding: 24px;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}

function renderCell(v) {
  if (v === null || v === undefined || v === "") return "-";
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}
function formatearCabecera(s) {
  return s
    .replace(/_/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}
