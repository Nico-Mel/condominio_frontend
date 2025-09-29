import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../../services/authService";

export default function LoginForm({ onLoginSuccess }) {
  const [ci, setCi] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [ciError, setCiError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isCIValid = (value) => /^\d{7}$/.test(value);

  const handleCiChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 7);
    setCi(val);
    if (val.length === 0) {
      setCiError("");
    } else if (!isCIValid(val)) {
      setCiError("CI debe tener 7 dígitos");
    } else {
      setCiError("");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!isCIValid(ci)) {
      setCiError("CI debe tener 7 dígitos");
      return;
    }
    if (!password) return;

    try {
      setLoading(true);
      const data = await authService.login({ ci, password });
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({
        id: data.id,
        nombre: data.nombre,
        apellido: data.apellido,
        correo: data.correo,
        rol: data.rol
      }));
      
      onLoginSuccess();
    } catch (err) {
      setError("Credenciales inválidas. Verifique su CI y contraseña.");
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = isCIValid(ci) && password && !loading;

  return (
    <div className="login-card">
      <h2>Iniciar Sesión</h2>

      {error && <div className="login-error">{error}</div>}

      <form onSubmit={handleLogin} noValidate>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={7}
          placeholder="Número de CI"
          value={ci}
          onChange={handleCiChange}
          aria-invalid={!!ciError}
          aria-describedby="ci-error"
          pattern="^[0-9]{7}$"
          title="7 dígitos numéricos"
          required
        />
        {ciError && (
          <div id="ci-error" className="input-hint">
            {ciError}
          </div>
        )}

<div className="password-group">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Contraseña"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />
  <span
    className="toggle-password"
    onClick={() => setShowPassword(!showPassword)}
    role="button"
    tabIndex={0}
  >
    {showPassword ? (
      // Ojo tachado
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-10-8-10-8a20.29 20.29 0 0 1 5.11-6.36M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 10 8 10 8a20.29 20.29 0 0 1-4.07 5.94M1 1l22 22"/>
      </svg>
    ) : (
      // Ojo abierto
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3"/>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
      </svg>
    )}
  </span>
</div>

        <button type="submit" disabled={!canSubmit}>
          {loading ? "Ingresando..." : "Acceder al Sistema"}
        </button>

        <p className="login-link">
          ¿Primera vez? <Link to="/register">Solicitar acceso</Link>
        </p>
      </form>
    </div>
  );
}
