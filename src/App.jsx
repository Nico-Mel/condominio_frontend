import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<h1>Bienvenido al Dashboard</h1>} />
        {/* Acá podés ir agregando más rutas cuando tengás más páginas */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
