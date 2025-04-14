import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard-content">
      <h1 className="dashboard-welcome">Bem-vindo(a), {user?.name || 'Usuário'}!</h1>
      <p>Gerencie suas tarefas e etiquetas de forma eficiente.</p>

      <div className="dashboard-cards">
        <Link to="/tasks" className="dashboard-card">
          <h3 className="dashboard-card-title">Gerenciar Tarefas</h3>
          <p className="dashboard-card-body">
            Crie, edite e organize suas tarefas por prioridade e status.
          </p>
        </Link>
        
        <Link to="/tags" className="dashboard-card">
          <h3 className="dashboard-card-title">Gerenciar Etiquetas</h3>
          <p className="dashboard-card-body">
            Personalize etiquetas coloridas para organizar suas tarefas por categoria.
          </p>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;