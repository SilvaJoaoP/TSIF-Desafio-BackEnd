import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="page-center home-page">
      <div className="home-logo">
        <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          <path d="M2 17l10 5 10-5"></path>
          <path d="M2 12l10 5 10-5"></path>
        </svg>
      </div>
      <h1 className="home-title">Gerenciador de Tarefas</h1>
      <p className="home-subtitle">Organize suas tarefas e aumente sua produtividade</p>
      
      <div className="home-buttons">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="btn btn-primary">Ir para Dashboard</Link>
            <Link to="/tasks" className="btn btn-secondary">Minhas Tarefas</Link>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-primary">Entrar</Link>
            <Link to="/register" className="btn btn-secondary">Criar Conta</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default HomePage;