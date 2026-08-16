import { useEffect, useState } from "react";

function PreAssembly() {
  const [alerts, setAlerts] = useState([]);

  async function fetchAlerts() {
    try {
      const response = await fetch("http://localhost:3000/alerts");

      if (!response.ok) {
        throw new Error("Failed to fetch alerts");
      }

      const data = await response.json();

      setAlerts(data);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  }

  async function markAsAlerted(id) {
    try {
      const response = await fetch(`http://localhost:3000/alerts/${id}`, {
        method: "PATCH"
      });

      if (!response.ok) {
        throw new Error("Failed to update alert");
      }

      setAlerts((currentAlerts) =>
        currentAlerts.filter((alert) => alert._id !== id)
      );
    } catch (error) {
      console.error("Error updating alert:", error);
    }
  }

  useEffect(() => {
    fetchAlerts();

    const interval = setInterval(() => {
      fetchAlerts();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pre-assembly-page">
      <header className="pre-assembly-header">
        <div>
          <span className="page-label">PRODUCTION QUALITY TRACKER</span>

          <h1>Pré-Montagem</h1>

          <p>Reclamações recebidas das linhas de montagem</p>
        </div>

        <div className="pending-counter">
          <span>{alerts.length}</span>
          <small>PENDENTES</small>
        </div>
      </header>

      <main className="alerts-container">
        {alerts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✓</div>

            <h2>Nenhuma reclamação pendente</h2>

            <p>
              Todas as reclamações recebidas foram devidamente alertadas.
            </p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div className="alert-card" key={alert._id}>
              <div className="alert-card-header">
                <div className="alert-status">
                  <span className="status-dot"></span>
                  PENDENTE
                </div>

                <span className="alert-time">
                  {new Date(alert.createdAt).toLocaleString("pt-BR")}
                </span>
              </div>

              <div className="alert-card-content">
                <span className="problem-label">PROBLEMA IDENTIFICADO</span>

                <h2>{alert.problem}</h2>

                {alert.brand && (
                  <div className="brand-info">
                    <span className="brand-label">TAMPA</span>

                    <span className="brand-name">{alert.brand}</span>
                  </div>
                )}
              </div>

              <button
                className="alerted-button"
                onClick={() => markAsAlerted(alert._id)}
              >
                <span>✓</span>
                MARCAR COMO ALERTADO
              </button>
            </div>
          ))
        )}
      </main>
    </div>
  );
}

export default PreAssembly;