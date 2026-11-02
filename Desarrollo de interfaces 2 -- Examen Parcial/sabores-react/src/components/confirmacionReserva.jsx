function ConfirmacionReserva({ reserva, irAdmin }) {
  return (
    <section className="confirmacion-card">
      <div className="confirmacion-icono">✓</div>

      {reserva ? (
        <>
          <h3>¡Reserva confirmada!</h3>
          <p>Tu mesa ha sido reservada con éxito.</p>

          <div className="confirmacion-detalles">
            <span> {reserva.fecha}</span>
            <span>{reserva.hora} h</span>
            <span> {reserva.personas} personas</span>
            <span> {reserva.nombre}</span>
            <span> {reserva.telefono}</span>
            <span> {reserva.correo}</span>
            <strong> Mesa {reserva.mesaId}</strong>
          </div>
        </>
      ) : (
        <>
          <h3>Tu próxima reserva</h3>
          <p>
            Completa el formulario y selecciona una mesa para confirmar tu
            reserva.
          </p>
        </>
      )}

      <div className="confirmacion-acciones">
        <button
          type="submit"
          form="formulario-reserva"
          className="boton-confirmar-derecha"
        >
           &nbsp; Reservar mesa
        </button>

        <button type="button" className="enlace-ir-admin" onClick={irAdmin}>
          Ver detalles (Ir a Admin →)
        </button>
      </div>
    </section>
  );
}

export default ConfirmacionReserva;
