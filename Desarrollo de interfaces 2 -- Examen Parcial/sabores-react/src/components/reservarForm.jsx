import { useEffect, useState } from "react";
import DisponibilidadMesas from "./disponibilidadMesas.jsx";
import ConfirmacionReserva from "./confirmacionReserva.jsx";

const obtenerReservas = () => {
  try {
    const datos = JSON.parse(localStorage.getItem("reservasSabores") || "[]");
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
};

const horarios = [
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
];

function ReservaForm({ irAdmin }) {
  const [reserva, setReserva] = useState({
    fecha: "",
    hora: "",
    personas: "2",
    nombre: "",
    telefono: "",
    correo: "",
  });

  const [reservas, setReservas] = useState(obtenerReservas);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [confirmada, setConfirmada] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("reservasSabores", JSON.stringify(reservas));
  }, [reservas]);

  const ahora = new Date();
  const hoy = [
    ahora.getFullYear(),
    String(ahora.getMonth() + 1).padStart(2, "0"),
    String(ahora.getDate()).padStart(2, "0"),
  ].join("-");

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setReserva((anterior) => ({
      ...anterior,
      [name]: value,
    }));

    if (["fecha", "hora", "personas"].includes(name)) {
      setMesaSeleccionada(null);
    }

    setError("");
  };

  const confirmarReserva = (e) => {
    e.preventDefault();
    setError("");

    if (!mesaSeleccionada) {
      setError("Por favor, selecciona una mesa disponible.");
      return;
    }

    const conflicto = reservas.some(
      (item) =>
        Number(item.mesaId) === mesaSeleccionada &&
        item.fecha === reserva.fecha &&
        item.hora === reserva.hora &&
        item.estado !== "Cancelada",
    );

    if (conflicto) {
      setError("La mesa ya está ocupada en ese horario.");
      setMesaSeleccionada(null);
      return;
    }

    const nuevaReserva = {
      ...reserva,
      id: crypto.randomUUID(),
      mesaId: mesaSeleccionada,
      estado: "Confirmada",
    };

    setReservas((anteriores) => [...anteriores, nuevaReserva]);

    setConfirmada(nuevaReserva);
    setMesaSeleccionada(null);
  };

  return (
    <div className="reserva-layout" id="reservas">
      <section className="reserva-card">
        <h3>Reserva tu mesa</h3>

        <form id="formulario-reserva" onSubmit={confirmarReserva}>
          <div className="form-grid">
            <div className="campo">
              <label htmlFor="fecha">Fecha</label>
              <input
                id="fecha"
                type="date"
                name="fecha"
                min={hoy}
                value={reserva.fecha}
                onChange={manejarCambio}
                required
              />
            </div>

            <div className="campo">
              <label htmlFor="hora">Hora</label>
              <select
                id="hora"
                name="hora"
                value={reserva.hora}
                onChange={manejarCambio}
                required
              >
                <option value="">Seleccionar</option>
                {horarios.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            <div className="campo">
              <label htmlFor="personas">Número de personas</label>
              <select
                id="personas"
                name="personas"
                value={reserva.personas}
                onChange={manejarCambio}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "persona" : "personas"}
                  </option>
                ))}
              </select>
            </div>

            <div className="campo">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                type="text"
                name="nombre"
                placeholder="Tu nombre"
                value={reserva.nombre}
                onChange={manejarCambio}
                required
              />
            </div>

            <div className="campo campo-completo">
              <label htmlFor="telefono">Teléfono</label>
              <input
                id="telefono"
                type="tel"
                name="telefono"
                pattern="[0-9]{9}"
                title="Ingresa 9 dígitos"
                placeholder="987654321"
                value={reserva.telefono}
                onChange={manejarCambio}
                required
              />
            </div>
            <div className="campo campo-completo">
              <label htmlFor="correo">Correo electrónico</label>
              <input
                id="correo"
                type="email"
                name="correo"
                placeholder="ejemplo@correo.com"
                value={reserva.correo}
                onChange={manejarCambio}
                required
              />
            </div>
          </div>

          {error && (
            <p className="reserva-error" role="alert">
              {error}
            </p>
          )}
        </form>
      </section>

      <DisponibilidadMesas
        reservas={reservas}
        fecha={reserva.fecha}
        hora={reserva.hora}
        personas={reserva.personas}
        mesaSeleccionada={mesaSeleccionada}
        onSeleccionar={setMesaSeleccionada}
      />

      <ConfirmacionReserva reserva={confirmada} irAdmin={irAdmin} />
    </div>
  );
}

export default ReservaForm;
