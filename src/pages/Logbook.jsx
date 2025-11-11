import { useEffect, useState } from "react";
import { obtenerPruebas } from "../api/api";
import "../styles/Logbook.css";

export default function Logbook() {
  const [pruebas, setPruebas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    obtenerPruebas()
      .then(data => setPruebas(data))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="logbook-container">

      <div className="logbook-header">
        <h1>📊 Registro de Pruebas</h1>
        <button className="logout-btn" onClick={handleLogout}>Cerrar Sesión</button>
      </div>

      {loading ? <p className="loading">Cargando...</p> : (
        <table className="logbook-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Versión</th>
              <th>Operación</th>
              <th>Resultado</th>
              <th>Correcto</th>
              <th>Fecha</th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody>
            {pruebas.map(p => (
              <tr key={p.id_prueba}>
                <td>{p.id_prueba}</td>
                <td>{p.version}</td>
                <td>{p.operacion}</td>
                <td>{p.resultado ? p.resultado.slice(0, 30) + "..." : "-"}</td>
                <td className={p.es_correcto ? "valido" : "invalido"}>
                  {p.es_correcto ? "✔" : "✖"}
                </td>
                <td>{new Date(p.fecha_registro).toLocaleString()}</td>
                <td>
                  <button className="details-btn" onClick={() => setSelected(p)}>
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Detalles de la Prueba #{selected.id_prueba}</h2>

            <pre className="modal-content">
              {JSON.stringify(selected, null, 2)}
            </pre>

            <button className="close-btn" onClick={() => setSelected(null)}>Cerrar</button>
          </div>
        </div>
      )}

    </div>
  );
}
