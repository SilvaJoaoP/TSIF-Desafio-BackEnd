// filepath: c:\Users\joaop\Desktop\TSIF - Desafio_BackEnd\FrontEnd\src\pages\Dashboard.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importa o hook do contexto

function Dashboard() {
  const { user, logout } = useAuth(); // Obtém o usuário e a função logout do contexto
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Chama a função de logout do contexto
    navigate('/login'); // Redireciona após o logout
  };

  return (
    <div>
      {/* Verifica se 'user' existe antes de tentar acessar 'user.name' */}
      <h2>Dashboard - Bem-vindo(a), {user ? user.name : 'Usuário'}!</h2>
      <p>Esta é a sua área principal após o login.</p>

      <nav>
        <Link to="/tasks">Ver Tarefas</Link> | <Link to="/tags">Ver Etiquetas</Link>
      </nav>

      <hr />

      {/* Botão de Logout */}
      <button onClick={handleLogout}>Sair</button>

      {/* Você pode adicionar resumos ou outros componentes aqui */}

    </div>
  );
}

export default Dashboard;