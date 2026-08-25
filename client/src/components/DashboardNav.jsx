import { NavLink } from "react-router-dom";
import "./DashboardNav.css";

export default function DashboardNav() {
  return (
    <nav className="dashboard-nav" aria-label="Dashboard sections">
      <NavLink
        to="/home"
        className={({ isActive }) =>
          `dashboard-nav-tab${isActive ? " active" : ""}`
        }
      >
        Repository
      </NavLink>
      <NavLink
        to="/impact-map"
        className={({ isActive }) =>
          `dashboard-nav-tab${isActive ? " active" : ""}`
        }
      >
        Impact map
      </NavLink>
      <NavLink
        to="/about"
        className={({ isActive }) =>
          `dashboard-nav-tab${isActive ? " active" : ""}`
        }
      >
        About
      </NavLink>
    </nav>
  );
}