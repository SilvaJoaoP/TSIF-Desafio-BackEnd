import React from 'react'; // Import React
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// Remova useState e useEffect se não forem mais usados aqui
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage"; // Confirme se o nome do arquivo é este
import TaskPage from "./pages/TaskPage";
import TagPage from "./pages/TagPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./context/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

const App = () => {

  return (
    <Router>
      <AuthProvider> {/* AuthProvider agora lida com o estado de loading interno */}
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rotas Protegidas */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/tasks" element={
            <ProtectedRoute>
              <TaskPage />
            </ProtectedRoute>
          } />
          <Route path="/tags" element={
            <ProtectedRoute>
              <TagPage />
            </ProtectedRoute>
          } />

           {/* Rota para página não encontrada (opcional) */}
           {/* <Route path="*" element={<h2>Página não encontrada</h2>} /> */}
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;