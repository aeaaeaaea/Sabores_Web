import { useState } from "react";
import "../styles/Login.css";

function Login({ volverCliente, ingresarDemo }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [recordarme, setRecordarme] = useState(false);

  const iniciarSesion = (e) => {
    e.preventDefault();
    ingresarDemo();
  };

  return (
    <main className="login-page">
      <div className="login-contenedor">
        <aside className="login-imagen">
          <div className="login-imagen-logo">
            <span>🍴</span>
            <div>
              <strong>SABORES</strong>
              <small>RESTAURANTE</small>
            </div>
          </div>

          <div className="login-imagen-texto">
            <h2>
              Buena comida,
              <br />
              mejores momentos
            </h2>
            <p>
              Gestiona tus reservas, mesas y clientes
              <br />
              de forma simple y eficiente.
            </p>
          </div>
        </aside>

        <section className="login-panel">
          <div className="login-panel-contenido">
            <div className="login-logo-principal">
              <span className="login-logo-icono">🍴</span>
              <div>
                <strong>SABORES</strong>
                <small>RESTAURANTE</small>
              </div>
            </div>

            <div className="login-titulos">
              <h1>Iniciar sesión</h1>
            </div>

            <form onSubmit={iniciarSesion}>
              <div className="login-campo">
                <label htmlFor="login-correo">Correo electrónico</label>

                <div className="login-input-contenedor">
                  <span></span>
                  <input
                    id="login-correo"
                    type="email"
                    placeholder="Correo administrativo"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="login-campo">
                <label htmlFor="login-password">Contraseña</label>

                <div className="login-input-contenedor">
                  <span></span>
                  <input
                    id="login-password"
                    type={mostrarPassword ? "text" : "password"}
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    className="login-ver-password"
                    onClick={() => setMostrarPassword(!mostrarPassword)}
                  >
                    {mostrarPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>

              <div className="login-opciones">
                <label className="login-recordarme">
                  <input
                    type="checkbox"
                    checked={recordarme}
                    onChange={(e) => setRecordarme(e.target.checked)}
                  />
                  Recordarme
                </label>
              </div>

              <button type="submit" className="login-boton">
                Ingresar <span>→</span>
              </button>
            </form>

            <button
              type="button"
              className="login-volver"
              onClick={volverCliente}
            >
              ← Volver al inicio
            </button>

            <button type="button" className="login-demo" onClick={ingresarDemo}>
              Ingresar al Dashboard (Demo)
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;
