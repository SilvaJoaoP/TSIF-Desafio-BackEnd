import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import api from '../lib/axios'; // Importa a instância do Axios
import * as AuthService from '../services/authService'; // Importa as funções de serviço

// Tipagem para o usuário (ajuste conforme necessário)
interface User {
  id: number;
  name: string;
  email: string;
}

// Tipagem para os dados de registro
interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Tipagem para as credenciais de login
interface LoginCredentials {
  email: string;
  password: string;
}

  login: (credentials: LoginCredentials) => Promise<void>;
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean; // Para indicar carregamento inicial
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
}

// Cria o Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cria o Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(true); // Começa carregando

  // Efeito para verificar o token inicial e buscar dados do usuário
  useEffect(() => {
    const verifyTokenAndFetchUser = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        console.log("AuthContext: Token encontrado no localStorage, validando...");
        setToken(storedToken);
        // Configura o header padrão do Axios para futuras requisições
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        try {
          // Usa a rota /auth/verify do backend para obter os dados do usuário
          // O backend já verifica o token nesta rota
          console.log("AuthContext: Tentando buscar dados do usuário via /auth/verify...");
          const response = await api.get<{ user: User }>('/auth/verify'); // Ajuste a tipagem se a resposta for diferente
          setUser(response.data.user); // Define o usuário no estado
          console.log("AuthContext: Dados do usuário carregados:", response.data.user);
        } catch (error: any) { // Use 'any' ou uma tipagem mais específica para o erro do Axios
          console.error("AuthContext: Token inválido ou erro ao buscar usuário via /auth/verify.", error.response?.data || error.message);
          // Limpa o estado e o localStorage se o token for inválido ou ocorrer erro
          localStorage.removeItem('authToken');
          setToken(null);
          setUser(null);
          delete api.defaults.headers.common['Authorization'];
        }
    } else {
       console.log("AuthContext: Nenhum token no localStorage.");
    }
    
    setIsLoading(false); // Mark loading as complete
  };

  verifyTokenAndFetchUser();
  }, []); // Executa apenas uma vez na montagem do componente
  const login = async (credentials: AuthService.LoginCredentials) => {
    try {
      const response = await AuthService.login(credentials);
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('authToken', response.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
      console.log("AuthContext: Login bem-sucedido.");
    } catch (error) {
      console.error("AuthContext: Erro no login", error);
      throw error;
    }
  };
  
  // No método register
  const register = async (data: AuthService.RegisterData) => {
    try {
      await AuthService.register(data);
      console.log("AuthContext: Registro bem-sucedido (usuário precisa fazer login).");
    } catch (error) {
      console.error("AuthContext: Erro no registro", error);
      throw error;
    }
  };

  const logout = () => {
    console.log("AuthContext: Fazendo logout.");
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    delete api.defaults.headers.common['Authorization'];
    // Opcional: redirecionar para /login aqui ou deixar a página/componente fazer isso
  };

  // Calcula isAuthenticated baseado na presença do token E do usuário (após tentativa de fetch)
  // Ou apenas no token se preferir uma verificação mais simples
  const isAuthenticated = !!token && !!user; // Mais seguro verificar ambos após o fetch inicial
  // const isAuthenticated = !!token; // Alternativa mais simples

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
  };

  // Mostra um loading global enquanto verifica o token inicial
  return (
    <AuthContext.Provider value={value}>
      {isLoading ? <div>Verificando autenticação...</div> : children}
    </AuthContext.Provider>
  );
};

// Hook customizado para usar o contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};