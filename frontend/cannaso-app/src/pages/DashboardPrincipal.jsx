import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthStore from "../store/useAuthStore";
import "./styles/DashboardPrincipal.css";
import { useEffect, useState } from "react";
import PanelListaPerfiles from "../panels/PanelListaPerfiles";
import PanelPreviewer from "../panels/PanelPreviewer";

const Dashboard = () => {
  const navigate = useNavigate();
  const limpiarUsuario = useAuthStore((state) => state.limpiarUsuario);
  const socioColaborador = useAuthStore((state) => state);
  const [perfiles, setPerfiles] = useState([]);
  const [perfilSeleccionado, setPerfilSeleccionado] = useState(null);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      limpiarUsuario();
      navigate("/login");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  useEffect(() => {
    const fetchSocios = async () => {
      const socios = await axios.get("/api/socio/socios");
      setPerfiles(socios.data);
    };
    fetchSocios();
  }, []);

  return (
    <div className="dashboardPrincipal">
      <PanelListaPerfiles
        setPerfilSeleccionado={setPerfilSeleccionado}
        perfiles={perfiles}
      />
      <PanelPreviewer
        perfilSeleccionado={perfilSeleccionado}
        setPerfiles={setPerfiles}
      />
    </div>
  );
};

export default Dashboard;
