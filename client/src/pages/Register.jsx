// client/src/pages/Register.jsx
import { useState, useContext, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Typewriter from "typewriter-effect";
import "./Register.css";

export default function Register() {
  const api = useApi();
  const { token, setToken, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) navigate("/home");
  }, [token, navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);

  const departments = [
    "Registration and Coordination",
    "HR and Administration",
    "Supply Chain Management",
    "ICT and Compliance",
    "Finance and Accounts",
    "Legal",
    "Research and Policy",
    "CEO's Office"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/api/auth/register", {
        email,
        password,
        department,
      });
      setToken(res.token);
      setUser(res.user);
      navigate("/home");
    } catch (err) {
      alert(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
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

      <div className="register-card">
        <h2>Register</h2>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Email"
            type="email"
            value={email}
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

          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
            disabled={loading}
          >
            <option value="">Select department</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <button type="submit" disabled={loading} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {loading && <span className="btn-spinner" />}
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="login-link">
          Already registered? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
