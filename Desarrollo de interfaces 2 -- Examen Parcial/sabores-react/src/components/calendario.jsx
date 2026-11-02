import { useEffect, useState } from "react";
import "../styles/Calendario.css";

const HORAS = ["18:00", "19:00", "20:00", "21:00", "22:00"];

function leerReservas() {
  try {
    const datos = JSON.parse(localStorage.getItem("reservasSabores") || "[]");

    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}

function obtenerLunes(fecha) {
  const resultado = new Date(fecha);
  resultado.setHours(12, 0, 0, 0);

  const dia = resultado.getDay();
  resultado.setDate(resultado.getDate() - ((dia + 6) % 7));

  return resultado;
}

function fechaISO(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
}

function Calendario({ volverDashboard, nuevaReserva, irClientes }) {
  const [reservas, setReservas] = useState(leerReservas);
  const [semana, setSemana] = useState(obtenerLunes(new Date()));

  const [filtroMesa, setFiltroMesa] = useState("todas");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  useEffect(() => {
    const actualizar = () => setReservas(leerReservas());

    window.addEventListener("storage", actualizar);

    return () => window.removeEventListener("storage", actualizar);
  }, []);

  const cambiarSemana = (cantidad) => {
    setSemana((anterior) => {
      const nueva = new Date(anterior);
      nueva.setDate(nueva.getDate() + cantidad * 7);
      return nueva;
    });
  };

  const dias = Array.from({ length: 7 }, (_, i) => {
    const fecha = new Date(semana);
    fecha.setDate(fecha.getDate() + i);
    return fecha;
  });

  const formatoDia = (fecha) =>
    fecha.toLocaleDateString("es-PE", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

  const inicio = dias[0].toLocaleDateString("es-PE", {
    day: "numeric",
    month: "short",
  });

  const fin = dias[6].toLocaleDateString("es-PE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const reservasFiltradas = reservas.filter((reserva) => {
    const coincideMesa =
      filtroMesa === "todas" || String(reserva.mesaId) === filtroMesa;

    const coincideEstado =
      filtroEstado === "todos" || reserva.estado === filtroEstado;

    return coincideMesa && coincideEstado;
  });

  const reservasCelda = (fecha, hora) =>
    reservasFiltradas.filter(
      (reserva) =>
        reserva.fecha === fechaISO(fecha) &&
        reserva.hora?.startsWith(hora.slice(0, 2)),
    );

  return (
    <div className="calendario-layout">
      <aside className="calendario-sidebar">
        <div className="calendario-marca">
          <strong>SABORES</strong>
          <small>RESTAURANTE</small>
        </div>

        <nav className="calendario-menu">
          <button onClick={nuevaReserva}>Reservas</button>
          <button className="activo">Calendario</button>
          <button type="button" onClick={irClientes}>Clientes</button>
        </nav>
        <div className="calendario-menu-inferior">
          <button onClick={volverDashboard}>Volver al Dashboard</button>
        </div>
      </aside>

      <main className="calendario-contenido">
        <header className="calendario-superior">
          <div className="calendario-buscador">Panel de administración</div>
          <div className="calendario-usuario">
            <span>AD</span>
            Admin
          </div>
        </header>

        <div className="calendario-cuerpo">
          <div className="calendario-encabezado">
            <div>
              <h1>Calendario / Agenda de reservas</h1>
              <p>Vista semanal con reservas por día y hora</p>
            </div>

            <button className="calendario-nueva" onClick={nuevaReserva}>
              + Nueva reserva
            </button>
          </div>

          <section className="calendario-tarjeta">
            <div className="calendario-titulo">
              <h2>Calendario de reservas</h2>

              <div className="calendario-leyenda">
                <span>
                  <i className="indicador verde" /> Confirmada
                </span>
                <span>
                  <i className="indicador amarillo" /> Pendiente
                </span>
                <span>
                  <i className="indicador rojo" /> Cancelada
                </span>
              </div>
            </div>

            <div className="calendario-controles">
              <button
                aria-label="Semana anterior"
                onClick={() => cambiarSemana(-1)}
              >
                ‹
              </button>

              <strong>
                {inicio} - {fin}
              </strong>

              <button
                aria-label="Semana siguiente"
                onClick={() => cambiarSemana(1)}
              >
                ›
              </button>

              <select
                value={filtroMesa}
                onChange={(e) => setFiltroMesa(e.target.value)}
                aria-label="Filtrar por mesa"
              >
                <option value="todas">Todas las mesas</option>
                {Array.from({ length: 8 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Mesa {i + 1}
                  </option>
                ))}
              </select>

              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                aria-label="Filtrar por estado"
              >
                <option value="todos">Todos los estados</option>
                <option value="Confirmada">Confirmada</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Cancelada">Cancelada</option>
              </select>

              <button
                className="calendario-hoy"
                onClick={() => setSemana(obtenerLunes(new Date()))}
              >
                Hoy
              </button>
            </div>

            <div className="calendario-desplazamiento">
              <div className="calendario-cuadricula">
                <div className="calendario-esquina" />

                {dias.map((dia) => (
                  <div
                    key={fechaISO(dia)}
                    className={`calendario-dia ${
                      fechaISO(dia) === fechaISO(new Date()) ? "dia-actual" : ""
                    }`}
                  >
                    {formatoDia(dia)}
                  </div>
                ))}

                {HORAS.map((hora) => (
                  <div className="calendario-fila" key={hora}>
                    <div className="calendario-hora">{hora}</div>

                    {dias.map((dia) => (
                      <div
                        className="calendario-celda"
                        key={`${fechaISO(dia)}-${hora}`}
                      >
                        {reservasCelda(dia, hora).map((r) => (
                          <div
                            key={r.id}
                            className={`calendario-evento ${
                              r.estado === "Cancelada"
                                ? "evento-cancelada"
                                : r.estado === "Pendiente"
                                  ? "evento-pendiente"
                                  : "evento-confirmada"
                            }`}
                            title={`${r.nombre} - ${r.hora}`}
                          >
                            <strong>{r.nombre}</strong>
                            <span>
                              {r.hora} · Mesa {r.mesaId} ({r.personas})
                            </span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <footer className="calendario-pie">
              <span>
                {
                  reservasFiltradas.filter((r) =>
                    dias.some((d) => fechaISO(d) === r.fecha),
                  ).length
                }{" "}
                reservas en esta semana
              </span>
              <span>Mostrando 7 días</span>
            </footer>
          </section>

          <p className="calendario-ruta">SABORES / Panel de administración</p>
        </div>
      </main>
    </div>
  );
}

export default Calendario;
