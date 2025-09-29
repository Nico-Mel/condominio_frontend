// src/pages/auth/LoginPage.jsx
import { useNavigate } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <div className="login-content">
        {/* Sección de marca */}
        <div className="brand-section">
          <div className="brand-text">
            <h1>Smart Condominium</h1>
          </div>
        </div>

        {/* Formulario de login */}
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
}