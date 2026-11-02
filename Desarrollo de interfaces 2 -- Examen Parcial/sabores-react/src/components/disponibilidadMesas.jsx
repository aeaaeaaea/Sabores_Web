const mesas = [
  { id: 1, capacidad: 2 },
  { id: 2, capacidad: 2 },
  { id: 3, capacidad: 4 },
  { id: 4, capacidad: 4 },
  { id: 5, capacidad: 4 },
  { id: 6, capacidad: 6 },
  { id: 7, capacidad: 6 },
  { id: 8, capacidad: 8 },
];

function DisponibilidadMesas({
  reservas,
  fecha,
  hora,
  personas,
  mesaSeleccionada,
  onSeleccionar,
}) {
  const ocupada = (mesaId) =>
    reservas.some(
      (reserva) =>
        Number(reserva.mesaId) === mesaId &&
        reserva.fecha === fecha &&
        reserva.hora === hora &&
        reserva.estado !== "Cancelada",
    );

  return (
    <section className="mesas-card">
      <h3>Disponibilidad de mesas</h3>

      <div className="plano-mesas">
        {mesas.map((mesa) => {
          const estaOcupada = ocupada(mesa.id);
          const insuficiente = mesa.capacidad < Number(personas);
          const bloqueada = !fecha || !hora || estaOcupada || insuficiente;

          return (
            <button
              type="button"
              key={mesa.id}
              title={`Mesa ${mesa.id} - ${mesa.capacidad} personas`}
              disabled={bloqueada}
              aria-label={`Mesa ${mesa.id}`}
              aria-pressed={mesaSeleccionada === mesa.id}
              onClick={() => onSeleccionar(mesa.id)}
              className={`mesa-circulo ${
                bloqueada ? "ocupada" : "disponible"
              } ${mesaSeleccionada === mesa.id ? "seleccionada" : ""}`}
            >
              {mesa.id}
            </button>
          );
        })}
      </div>

      <div className="mesas-leyenda">
        <span>
          <i className="punto disponible" /> Disponible
        </span>
        <span>
          <i className="punto ocupada" /> Ocupada
        </span>
        <span>
          <i className="punto seleccionada" /> Seleccionada
        </span>
      </div>
    </section>
  );
}

export default DisponibilidadMesas;
