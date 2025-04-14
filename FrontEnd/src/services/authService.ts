import api from '../lib/axios';

// Tipagem para os dados de entrada (ajustado para usar password)
interface LoginCredentials {
  email: string;
  password: string; // Alterado de pass para password para combinar com o modelo User
}

interface RegisterData {
  name: string;
  email: string;
  password: string; // Alterado de pass para password para combinar com o modelo User
}

// Tipagem para a resposta esperada
interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    return response.data;
  } catch (error) {
    console.error("Erro no login:", error);
    throw error;
  }
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/register', data);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    return response.data;
  } catch (error) {
    console.error("Erro no registro:", error);
    throw error;
  }
};

export const logout = () => {
    localStorage.removeItem('authToken');
    delete api.defaults.headers.common['Authorization'];
};