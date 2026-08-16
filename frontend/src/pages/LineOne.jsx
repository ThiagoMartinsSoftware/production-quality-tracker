import { useEffect, useState } from "react";

function LineOne() {
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [summary, setSummary] = useState({
    total: 0,
    pending: 0,
    alerted: 0
  });

  const problemsWithBrand = [
    "Tampa sem borracha",
    "Tampa sem terminal",
    "Terminal mal rebitado",
    "Tampa quebrada"
  ];

  async function fetchSummary() {
    try {
      const response = await fetch(
        "http://localhost:3000/alerts/summary"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch summary");
      }

      const data = await response.json();

      setSummary(data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  }

  async function createAlert(problem, brand = null) {
    try {
      const response = await fetch("http://localhost:3000/alerts", {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          problem,
          brand
        })
      });

      if (!response.ok) {
        throw new Error("Failed to create alert");
      }

      setSelectedProblem(null);

      setSuccessMessage({
        problem,
        brand
      });

      fetchSummary();
    } catch (error) {
      console.error("Error creating alert:", error);
    }
  }

  function handleProblemClick(problem) {
    if (problemsWithBrand.includes(problem)) {
      setSelectedProblem(problem);
      return;
    }

    createAlert(problem);
  }

  useEffect(() => {
    fetchSummary();

    const interval = setInterval(() => {
      fetchSummary();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  return (
    <div className="container">

      <h1>Linha 1 e Linha 2 - Montagem</h1>

      <p>Relatar problema na tampa</p>

      {/* =========================
          RESUMO
      ========================= */}

      <div className="summary-card">

        <div className="summary-header">
          <h2>Resumo</h2>

          <span>STATUS DOS ALERTAS</span>
        </div>

        <div className="summary-items">

          <div className="summary-item">
            <strong>{summary.total}</strong>

            <span>Total enviados</span>
          </div>

          <div className="summary-item pending">
            <strong>{summary.pending}</strong>

            <span>Pendentes</span>
          </div>

          <div className="summary-item alerted">
            <strong>{summary.alerted}</strong>

            <span>Alertados</span>
          </div>

        </div>

      </div>

      {/* =========================
          PROBLEMAS
      ========================= */}

      <button
        onClick={() =>
          handleProblemClick("Tampa sem borracha")
        }
      >
        Tampa sem borracha
      </button>

      <button
        onClick={() =>
          handleProblemClick("Tampa sem terminal")
        }
      >
        Tampa sem terminal
      </button>

      <button
        onClick={() =>
          handleProblemClick("Terminal mal rebitado")
        }
      >
        Terminal mal rebitado
      </button>

      <button
        onClick={() =>
          handleProblemClick("Tampa sem pino")
        }
      >
        Tampa sem pino
      </button>

      <button
        onClick={() =>
          handleProblemClick("Tampa com pino danificado")
        }
      >
        Tampa com pino danificado
      </button>

      <button
        onClick={() =>
          handleProblemClick("Tampa quebrada")
        }
      >
        Tampa quebrada
      </button>

      {/* =========================
          MODAL DA MARCA
      ========================= */}

      {selectedProblem && (
        <div className="brand-card">

          <h2>{selectedProblem}</h2>

          <p>Selecione a marca da tampa</p>

          <button
            onClick={() =>
              createAlert(
                selectedProblem,
                "Electrolux"
              )
            }
          >
            Electrolux
          </button>

          <button
            onClick={() =>
              createAlert(
                selectedProblem,
                "Whirlpool"
              )
            }
          >
            Whirlpool
          </button>

          <button
            onClick={() =>
              setSelectedProblem(null)
            }
          >
            Cancelar
          </button>

        </div>
      )}

      {/* =========================
          SUCESSO
      ========================= */}

      {successMessage && (
        <div className="success-overlay">

          <div className="success-card">

            <div className="success-icon">
              ✓
            </div>

            <h2>Alerta enviado</h2>

            <p>{successMessage.problem}</p>

            {successMessage.brand && (
              <span>
                {successMessage.brand}
              </span>
            )}

          </div>

        </div>
      )}

    </div>
  );
}

export default LineOne;