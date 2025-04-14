// filepath: c:\Users\joaop\Desktop\TSIF - Desafio_BackEnd\FrontEnd\src\pages\Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
// Você pode importar o useAuth aqui se quiser mostrar informações diferentes para usuários logados/deslogados
// import { useAuth } from '../context/AuthContext';

function HomePage() {
  // const { user } = useAuth(); // Exemplo de como usar o contexto

  return (
    <div>
      <h1>Bem-vindo ao Gerenciador de Tarefas</h1>
      <p>Organize suas tarefas e etiquetas de forma eficiente.</p>
      <nav>
        <Link to="/login">Login</Link> | <Link to="/register">Registro</Link>
        {/* Você pode adicionar links para /dashboard, /tasks, etc. aqui,
            talvez condicionalmente se o usuário estiver logado */}
      </nav>
    </div>
  );
}

export default HomePage;