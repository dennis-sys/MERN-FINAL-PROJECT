// client/src/pages/Login.jsx
import { useState, useContext, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Typewriter from "typewriter-effect";
import "./Login.css";

export default function Login() {
  const api = useApi();
  const { token, setToken, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) navigate("/home");
  }, [token, navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      setToken(res.token);
      setUser(res.user);
      navigate("/home");
    } catch (err) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="cdms-title">
        <Typewriter
          options={{
            strings: ["CDMS"],
            autoStart: true,
            loop: true,
            delay: 60,
          }}
        />
      </div>

      <div className="login-card">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Email"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <button type="submit" disabled={loading} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {loading && <span className="btn-spinner" />}
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>

        <p className="register-link">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
