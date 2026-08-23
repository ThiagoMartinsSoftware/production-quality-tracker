import { useEffect, useState } from "react";

function PreAssembly() {
  const [alerts, setAlerts] = useState([]);
  const [todayTotal, setTodayTotal] = useState(0);
  const [resetting, setResetting] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  async function fetchAlerts() {
    try {
     const response = await fetch(`${API_URL}/alerts`);

      if (!response.ok) {
        throw new Error("Failed to fetch alerts");
      }

      const data = await response.json();

      setAlerts(data);
    } catch (error) {
      console.error(
        "Error fetching alerts:",
        error
      );
    }
  }

  async function fetchTodayTotal() {
    try {
     const response = await fetch(`${API_URL}/alerts/today`);

      if (!response.ok) {
        throw new Error(
          "Failed to fetch shift alert count"
        );
      }

      const data = await response.json();

      setTodayTotal(data.total);
    } catch (error) {
      console.error(
        "Error fetching shift alert count:",
        error
      );
    }
  }

  async function markAsAlerted(id) {
    try {
    const response = await fetch(`${API_URL}/alerts/${id}`, {
        method: "PATCH"
      });

      if (!response.ok) {
        throw new Error(
          "Failed to update alert"
        );
      }

      fetchAlerts();
    } catch (error) {
      console.error(
        "Error updating alert:",
        error
      );
    }
  }

  async function resetAlertCount() {
    const confirmed = window.confirm(
      "Deseja realmente iniciar uma nova contagem para o próximo turno?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setResetting(true);

     const response = await fetch(`${API_URL}/alerts/reset`, {
        method: "POST"
      });

      if (!response.ok) {
        throw new Error(
          "Failed to reset alert count"
        );
      }

      setTodayTotal(0);

      await fetchTodayTotal();
    } catch (error) {
      console.error(
        "Error resetting alert count:",
        error
      );
    } finally {
      setResetting(false);
    }
  }

  useEffect(() => {
    fetchAlerts();
    fetchTodayTotal();

    const interval = setInterval(() => {
      fetchAlerts();
      fetchTodayTotal();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">

      <h1>Pré-Montagem</h1>

      <p>Reclamações recebidas da montagem</p>

      {/* =========================
          ALERTAS DO TURNO
      ========================= */}

      <div className="today-alerts-card">

        <div className="today-alerts-content">

          <span>ALERTAS DO TURNO</span>

          <strong>{todayTotal}</strong>

          <p>
            reclamações recebidas
          </p>

        </div>

        <button
          className="reset-alerts-button"
          onClick={resetAlertCount}
          disabled={resetting}
        >
          {resetting
            ? "Resetando..."
            : "Resetar contagem"}
        </button>

      </div>

      {/* =========================
          ALERTAS PENDENTES
      ========================= */}

      <div className="alerts-list">

        {alerts.length === 0 ? (
          <div className="empty-state">

            <h2>
              Nenhum alerta pendente
            </h2>

            <p>
              Não existem reclamações
              aguardando atendimento.
            </p>

          </div>
        ) : (
          alerts.map((alert) => (
            <div
              className="alert-card"
              key={alert._id}
            >

              <div className="alert-card-content">

                <h2>
                  {alert.problem}
                </h2>

                {alert.brand && (
                  <span className="alert-brand">
                    {alert.brand}
                  </span>
                )}

                <span className="alert-status">
                  Pendente
                </span>

              </div>

              <button
                onClick={() =>
                  markAsAlerted(alert._id)
                }
              >
                Alertado
              </button>

            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default PreAssembly;