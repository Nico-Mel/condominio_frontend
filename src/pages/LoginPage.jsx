import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./LoginPage.css";

export default function Login() {
  const [ci, setCi] = useState("");
  const [password, setPassword] = useState("");
  const [ciError, setCiError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL
  const isCIValid = (value) => /^\d{7}$/.test(value);

  const handleCiChange = (e) => {
    // Solo números y máximo 7 dígitos
    const val = e.target.value.replace(/\D/g, "").slice(0, 7);
    setCi(val);
    if (val.length === 0) {
      setCiError("");
    } else if (!isCIValid(val)) {
      setCiError("El CI debe tener exactamente 7 dígitos.");
    } else {
      setCiError("");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!isCIValid(ci)) {
      setCiError("El CI debe tener exactamente 7 dígitos.");
      return;
    }
    if (!password) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}accounts/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ci, password }),
      });

      if (!res.ok) throw new Error("Login fallido");

      const data = await res.json();
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = isCIValid(ci) && password && !loading;

  return (
    <div className="login-container">
      {/* Fondo decorativo SVG */}
      <div className="svg-background">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#ffffff"
            fillOpacity="0.9"
            d="M0,0L40,42.7C80,85,160,171,240,197.3C320,224,400,192,480,154.7C560,117,640,75,720,74.7C800,75,880,117,960,154.7C1040,192,1120,224,1200,213.3C1280,203,1360,149,1400,122.7L1440,96L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
          ></path>
        </svg>
      </div>

      <div className="login-content">
        <div className="login-welcome">
          <h1>Bienvenido</h1>
          <p>
            Esta es una plataforma visual para diseñar interfaces móviles de
            manera rápida y sencilla, sin necesidad de programar. Ideal para
            prototipos, MVPs y apps en producción.
          </p>
        </div>

        <div className="login-card">
          <h2>Inicia Sesión</h2>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleLogin} noValidate>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={7}
              placeholder="CI (7 dígitos)"
              value={ci}
              onChange={handleCiChange}
              aria-invalid={!!ciError}
              aria-describedby="ci-error"
              pattern="^[0-9]{7}$"
              title="El CI debe tener exactamente 7 dígitos numéricos"
              required
            />
            {ciError && (
              <div id="ci-error" className="input-hint">
                {ciError}
              </div>
            )}

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" disabled={!canSubmit}>
              {loading ? "Ingresando..." : "Iniciar Sesión"}
            </button>

            <p className="login-link">
              ¿No tienes cuenta? <Link to="/signup">Regístrate aquí</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
