// filepath: c:\Users\joaop\Desktop\TSIF - Desafio_BackEnd\FrontEnd\src\context\ProtectedRoute.tsx
import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Importa o hook de autenticação

interface ProtectedRouteProps {
  children: ReactNode; // Aceita qualquer elemento React como filho
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth(); // Obtém o estado de autenticação e carregamento
  const location = useLocation(); // Para redirecionar de volta após o login

  if (isLoading) {
    // Mostra um loading enquanto o estado de autenticação está sendo verificado
    return <div>Verificando acesso...</div>;
  }

  if (!isAuthenticated) {
    // Se não estiver autenticado (e não estiver carregando), redireciona para o login
    // Passa a localização atual para que possamos redirecionar de volta após o login
    console.log("ProtectedRoute: Não autenticado, redirecionando para /login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se estiver autenticado, renderiza o componente filho (a página protegida)
  return <>{children}</>;
};

export default ProtectedRoute;