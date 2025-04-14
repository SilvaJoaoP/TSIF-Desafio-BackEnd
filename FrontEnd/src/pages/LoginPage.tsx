import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      // Alterado para passar password em vez de pass
      await login({ email, password }); 
      console.log('Login bem-sucedido, redirecionando para:', from);
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('Falha no login:', err);
      const message = err.response?.data?.message || 'Falha ao fazer login. Verifique suas credenciais.';
      setError(message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {/* ... campos de email e senha ... */}
         <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Entrar</button>
      </form>
      {/* Use Link para navegação interna */}
      <p>Não tem uma conta? <Link to="/register">Registre-se</Link></p>
    </div>
  );
}

export default LoginPage;