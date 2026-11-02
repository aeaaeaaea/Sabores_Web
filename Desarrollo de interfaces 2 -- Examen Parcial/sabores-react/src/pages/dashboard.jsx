import { useEffect, useState } from "react";
import "../styles/dashboard.css";

function obtenerReservas() {
  try {
    const datos = JSON.parse(localStorage.getItem("reservasSabores") || "[]");
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}

function Dashboard({ volverCliente, abrirCalendario, irClientes }) {
  const [reservas, setReservas] = useState(obtenerReservas);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    localStorage.setItem("reservasSabores", JSON.stringify(reservas));
  }, [reservas]);

  const ahora = new Date();
  const hoy = [
    ahora.getFullYear(),
    String(ahora.getMonth() + 1).padStart(2, "0"),
    String(ahora.getDate()).padStart(2, "0"),
  ].join("-");

  const reservasHoy = reservas.filter(
    (r) => r.fecha === hoy && r.estado !== "Cancelada",
  );

  const mesasOcupadas = new Set(reservasHoy.map((r) => r.mesaId)).size;

  const pendientes = reservas.filter((r) => r.estado === "Pendiente").length;

  const clientes = new Set(reservas.map((r) => r.telefono).filter(Boolean))
    .size;

  const reservasFiltradas = reservas.filter((r) =>
    `${r.nombre} ${r.fecha} ${r.hora} ${r.mesaId}`
      .toLowerCase()
      .includes(busqueda.toLowerCase()),
  );

  const cancelarReserva = (id) => {
    if (!window.confirm("¿Cancelar esta reserva?")) return;

    setReservas((anteriores) =>
      anteriores.map((r) => (r.id === id ? { ...r, estado: "Cancelada" } : r)),
    );
  };

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <div>
            <strong>SABORES</strong>
            <small>RESTAURANTE</small>
          </div>
        </div>

        <nav className="dashboard-menu">
          <button className="active"> &nbsp; Reservas</button>
          <button type="button" onClick={abrirCalendario}>
            Calendario
          </button>
          <button type="button" onClick={irClientes}>
            Clientes
          </button>
        </nav>

        <div className="dashboard-sidebar-footer">
          <button onClick={volverCliente}>&nbsp; Cerrar sesión</button>
        </div>
      </aside>

      <div className="dashboard-content">
        <header className="dashboard-topbar">
          <input
            type="search"
            placeholder="⌕  Buscar reservas, clientes..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            aria-label="Buscar reservas"
          />
        </header>

        <main className="dashboard-main">
          <div className="dashboard-header">
            <div>
              <h1>Reservas</h1>
              <p>Resumen general del restaurante</p>
            </div>

            <div className="dashboard-fecha">▣ &nbsp; {hoy}</div>
          </div>

          <div className="dashboard-stats">
            <div className="stat-card">
              <span className="stat-icon verde">▦</span>
              <div>
                <p>Reservas hoy</p>
                <strong>{reservasHoy.length}</strong>
                <small className="stat-verde">Actualizado</small>
              </div>
            </div>

            <div className="stat-card">
              <span className="stat-icon naranja">▣</span>
              <div>
                <p>Mesas ocupadas</p>
                <strong>{mesasOcupadas} / 8</strong>
                <div className="stat-progress">
                  <span
                    style={{
                      width: `${(mesasOcupadas / 8) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="stat-card">
              <span className="stat-icon amarillo">◷</span>
              <div>
                <p>Pendientes</p>
                <strong>{pendientes}</strong>
                <small className="stat-amarillo">Requieren confirmación</small>
              </div>
            </div>

            <div className="stat-card">
              <span className="stat-icon verde">♙</span>
              <div>
                <p>Clientes</p>
                <strong>{clientes}</strong>
                <small className="stat-verde">Registrados</small>
              </div>
            </div>
          </div>

          <section className="dashboard-table-card">
            <div className="dashboard-table-header">
              <h2>Últimas reservas</h2>
              <span>{reservasFiltradas.length} registros</span>
            </div>

            <div className="dashboard-table-scroll">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Hora</th>
                    <th>Cliente</th>
                    <th>Personas</th>
                    <th>Mesa</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {reservasFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="sin-reservas">
                        No hay reservas para mostrar.
                      </td>
                    </tr>
                  ) : (
                    reservasFiltradas.map((r) => (
                      <tr key={r.id}>
                        <td>{r.hora}</td>
                        <td>{r.nombre}</td>
                        <td>{r.personas}</td>
                        <td>{r.mesaId}</td>
                        <td className="estado-columna">
                          <span
                            className={`estado-semaforo ${
                              r.estado === "Confirmada"
                                ? "semaforo-verde"
                                : r.estado === "Pendiente"
                                  ? "semaforo-amarillo"
                                  : "semaforo-rojo"
                            }`}
                            title={r.estado}
                          />
                        </td>
                        <td>
                          <div className="dashboard-acciones">
                            <button
                              className="btn-cancelar"
                              disabled={r.estado === "Cancelada"}
                              onClick={() => cancelarReserva(r.id)}
                            >
                              Cancelar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <button className="dashboard-volver" onClick={volverCliente}>
            ← Volver al restaurante
          </button>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
