import { useState } from "react";

import Navbar from "./components/navbar.jsx";
import Hero from "./components/hero.jsx";
import ReservaForm from "./components/reservarForm.jsx";
import Calendario from "./components/calendario.jsx";
import Login from "./pages/login.jsx";
import Dashboard from "./pages/dashboard.jsx";
import Clientes from "./pages/clientes.jsx";
import "./styles/navbar.css";
import "./styles/reserva.css";
import "./styles/mesas.css";
import "./styles/login.css";
import "./styles/dashboard.css";
import "./styles/calendario.css";
import "./styles/clientes.css";
function App() {
  const [pantalla, setPantalla] = useState("cliente");
  const irCliente = () => setPantalla("cliente");
  const irLogin = () => setPantalla("login");
  const irDashboard = () => setPantalla("admin");
  const irCalendario = () => setPantalla("calendario");
  const irClientes = () => setPantalla("clientes");
  if (pantalla === "login") {
    return <Login volverCliente={irCliente} ingresarDemo={irDashboard} />;
  }
  if (pantalla === "admin") {
    return (
      <Dashboard
        volverCliente={irCliente}
        abrirCalendario={irCalendario}
        irClientes={irClientes}
      />
    );
  }
  if (pantalla === "calendario") {
    return (
      <Calendario
        volverDashboard={irDashboard}
        nuevaReserva={irCliente}
        irClientes={irClientes}
      />
    );
  }
  if (pantalla === "clientes") {
    return (
      <Clientes
        irReservas={irCliente}
        irCalendario={irCalendario}
        volverDashboard={irDashboard}
      />
    );
  }
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ReservaForm irAdmin={irLogin} />
      </main>
    </>
  );
}
export default App;
