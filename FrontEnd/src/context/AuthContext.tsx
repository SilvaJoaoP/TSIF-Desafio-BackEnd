import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import api from '../lib/axios';
import * as AuthService from '../services/authService';
import LoadingSpinner from '../components/LoadingSpinner';

interface User {
  id: number;
  name: string;
  email: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
}

const TOKEN_KEY = 'authToken';
const USER_KEY = 'authUser';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const storedUser = localStorage.getItem(USER_KEY);
  const initialUser = storedUser ? JSON.parse(storedUser) : null;
  
  const [user, setUser] = useState<User | null>(initialUser);
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(!!localStorage.getItem(TOKEN_KEY)); 

  useEffect(() => {
    const verifyTokenAndFetchUser = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      
      if (storedToken) {
        console.log("AuthContext: Token encontrado no localStorage, validando...");
        setToken(storedToken);
        
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        
        try {
          console.log("AuthContext: Tentando buscar dados do usuário via /auth/verify...");
          const response = await api.get<{ user: User }>('/auth/verify');
          
          setUser(response.data.user);
          localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
          
          console.log("AuthContext: Dados do usuário carregados:", response.data.user);
        } catch (error: any) {
          console.error("AuthContext: Token inválido ou erro ao buscar usuário", 
                        error.response?.data || error.message);
          
          logout();
        }
      } else {
        console.log("AuthContext: Nenhum token no localStorage.");
      }
      
      setIsLoading(false);
    };

    if (isLoading) {
      verifyTokenAndFetchUser();
    }
  }, [isLoading]);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await AuthService.login(credentials);
      
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      
      setToken(response.token);
      setUser(response.user);
      
      api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
      console.log("AuthContext: Login bem-sucedido.");
      
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("AuthContext: Erro no login", error);
      throw error;
    }
  };
  
  const register = async (data: RegisterData) => {
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
    
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    
    setUser(null);
    setToken(null);
    
    delete api.defaults.headers.common['Authorization'];
  };

  const isAuthenticated = !!token && !!user;

  const contextValue: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
  };

  if (isLoading) {
    return <LoadingSpinner message="Verificando autenticação..." />;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};