import { useState } from "react";
import "../styles/clientes.css";

function obtenerReservas() {
  try {
    const datos = JSON.parse(localStorage.getItem("reservasSabores") || "[]");
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}

function Clientes({ irReservas, irCalendario, volverDashboard }) {
  const [reservas] = useState(obtenerReservas);
  const [busqueda, setBusqueda] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  const clientesMap = new Map();

  reservas.forEach((reserva) => {
    const telefono = (reserva.telefono || "").trim();
    const correo = (reserva.correo || "").trim().toLowerCase();
    const clave = correo || telefono || reserva.nombre?.trim().toLowerCase();

    if (!clave) return;

    if (!clientesMap.has(clave)) {
      clientesMap.set(clave, {
        id: clave,
        nombre: reserva.nombre,
        correo: reserva.correo || "No registrado",
        telefono: reserva.telefono || "No registrado",
        reservas: [],
      });
    }

    clientesMap.get(clave).reservas.push(reserva);
  });

  const clientes = Array.from(clientesMap.values()).map((cliente) => {
    const historial = [...cliente.reservas].sort((a, b) =>
      `${b.fecha} ${b.hora}`.localeCompare(`${a.fecha} ${a.hora}`),
    );

    return {
      ...cliente,
      historial,
      ultimaReserva: historial[0]?.fecha || "-",
    };
  });

  const clientesFiltrados = clientes.filter((cliente) =>
    `${cliente.nombre} ${cliente.correo} ${cliente.telefono}`
      .toLowerCase()
      .includes(busqueda.toLowerCase()),
  );

  return (
    <div className="clientes-layout">
      <aside className="clientes-sidebar">
        <div className="clientes-marca">
          <strong>SABORES</strong>
          <small>RESTAURANTE</small>
        </div>

        <nav className="clientes-menu">
          <button onClick={irReservas}>Reservas</button>
          <button onClick={irCalendario}>Calendario</button>
          <button className="activo">Clientes</button>
        </nav>

        <button className="clientes-regresar" onClick={volverDashboard}>
          Volver al Dashboard
        </button>
      </aside>

      <main className="clientes-contenido">
        <header className="clientes-topbar">
          <span>Panel de administración</span>
          <div className="clientes-admin">
            <span>AD</span>
            Admin
          </div>
        </header>

        <div className="clientes-cuerpo">
          <div className="clientes-encabezado">
            <div>
              <h1>Clientes</h1>
              <p>Información de clientes y sus reservas</p>
            </div>
          </div>

          <div className="clientes-estadisticas">
            <div className="clientes-estadistica">
              <span>Clientes registrados</span>
              <strong>{clientes.length}</strong>
            </div>

            <div className="clientes-estadistica">
              <span>Reservas realizadas</span>
              <strong>{reservas.length}</strong>
            </div>
          </div>

          <section className="clientes-tarjeta">
            <div className="clientes-tarjeta-encabezado">
              <h2>Listado de clientes</h2>

              <input
                type="search"
                placeholder="Buscar cliente..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                aria-label="Buscar cliente"
              />
            </div>

            <div className="clientes-tabla-contenedor">
              <table className="clientes-tabla">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Correo electrónico</th>
                    <th>Teléfono</th>
                    <th>Reservas</th>
                    <th>Última reserva</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {clientesFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="clientes-vacio">
                        No hay clientes para mostrar.
                      </td>
                    </tr>
                  ) : (
                    clientesFiltrados.map((cliente) => (
                      <tr key={cliente.id}>
                        <td>{cliente.nombre}</td>
                        <td>{cliente.correo}</td>
                        <td>{cliente.telefono}</td>
                        <td>{cliente.reservas.length}</td>
                        <td>{cliente.ultimaReserva}</td>
                        <td>
                          <button
                            className="clientes-ver"
                            onClick={() => setClienteSeleccionado(cliente)}
                          >
                            Ver historial
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {clienteSeleccionado && (
            <section className="clientes-historial">
              <div className="clientes-historial-header">
                <div>
                  <h2>Historial de reservas</h2>
                  <p>{clienteSeleccionado.nombre}</p>
                </div>

                <button
                  onClick={() => setClienteSeleccionado(null)}
                  aria-label="Cerrar historial"
                >
                  Cerrar
                </button>
              </div>

              <div className="clientes-tabla-contenedor">
                <table className="clientes-tabla">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Hora</th>
                      <th>Mesa</th>
                      <th>Personas</th>
                      <th>Estado</th>
                    </tr>
                  </thead>

                  <tbody>
                    {clienteSeleccionado.historial.map((r) => (
                      <tr key={r.id}>
                        <td>{r.fecha}</td>
                        <td>{r.hora}</td>
                        <td>{r.mesaId}</td>
                        <td>{r.personas}</td>
                        <td>
                          <span
                            className={`clientes-estado ${
                              r.estado === "Confirmada"
                                ? "verde"
                                : r.estado === "Pendiente"
                                  ? "amarillo"
                                  : "rojo"
                            }`}
                            title={r.estado}
                            aria-label={r.estado}
                          />
                          <span className="clientes-estado-texto">
                            {r.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default Clientes;
