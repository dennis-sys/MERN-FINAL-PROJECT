// client/src/components/Header.jsx
import React, { useContext } from "react";
import Typewriter from "typewriter-effect";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/register", { replace: true });
  };

  return (
    <header className="header-container" data-theme={theme}>
      {/* Left spacer — mirrors .header-actions width so the title stays centred */}
      <div className="header-spacer" aria-hidden="true" />

      <div className="header-title">
        <Typewriter
          options={{
            strings: ["CORPORATE DOCUMENT MANAGEMENT SYSTEM"],
            autoStart: true,
            loop: true,
            delay: 40,
          }}
        />
      </div>

      <div className="header-actions">
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>

        {token && (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
