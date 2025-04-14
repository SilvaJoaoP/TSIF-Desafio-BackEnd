import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TaskPage from "./pages/TaskPage";
import TagPage from "./pages/TagPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./context/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <main className="main-content">
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

            {/* Rota para página não encontrada */}
            <Route path="*" element={<div className="container"><h2>Página não encontrada</h2></div>} />
          </Routes>
        </main>
      </AuthProvider>
    </Router>
  );
};

export default App;