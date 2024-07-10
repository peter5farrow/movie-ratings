import { useNavigate, NavLink, Outlet } from "react-router-dom";
import axios from "axios";
import LogoutButton from "./components/LogoutButton.jsx";

export default function App() {
  const navigate = useNavigate();

  async function handleLogout(e) {
    e.preventDefault();
    const res = await axios.post("/api/logout");
    if (res.data.success === true) {
      navigate("/");
    }
  }

  return (
    <>
      <nav>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/movies">All movies</NavLink>
          </li>
          <li>
            <NavLink to="/login">Log in</NavLink>
          </li>
          <li>
            <NavLink to="/me">Your ratings</NavLink>
          </li>
          <li>
            <LogoutButton onLogout={handleLogout} />
          </li>
        </ul>
      </nav>

      <hr />

      <main>
        <Outlet />
      </main>
    </>
  );
}
