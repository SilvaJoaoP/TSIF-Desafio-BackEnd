import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!name || !email || !password) {
        setError("Todos os campos são obrigatórios.");
        return;
    }
    try {
      // Alterado para passar password em vez de pass
      await register({ name, email, password });
      console.log('Registro bem-sucedido, redirecionando para login...');
      navigate('/login');
    } catch (err: any) {
      console.error('Falha no registro:', err);
      const message = err.response?.data?.message || 'Falha ao registrar. Verifique os dados e tente novamente.';
      setError(message);
    }
  };

  return (
    <div>
      <h2>Registro de Novo Usuário</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nome:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
            minLength={6} // Exemplo: requisito mínimo de senha
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Registrar</button>
      </form>
       {/* Link para a página de login usando o componente Link do react-router-dom */}
       <p>Já tem uma conta? <Link to="/login">Faça login</Link></p>
    </div>
  );
}

export default RegisterPage;