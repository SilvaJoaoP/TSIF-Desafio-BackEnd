import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
          </svg>
          Task Manager
        </Link>
      </div>
      
      <button className="navbar-mobile-toggle" onClick={toggleMenu}>
        <span>☰</span>
      </button>
      
      <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
        {isAuthenticated ? (
          <>
            <Link 
              to="/dashboard" 
              className={`navbar-item ${isActive('/dashboard') ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/tasks" 
              className={`navbar-item ${isActive('/tasks') ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Tarefas
            </Link>
            <Link 
              to="/tags" 
              className={`navbar-item ${isActive('/tags') ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Etiquetas
            </Link>
            
            <div className="navbar-end">
              <span className="navbar-user">
                Olá, {user?.name || 'Usuário'}
              </span>
              <button onClick={handleLogout} className="navbar-button">
                Sair
              </button>
            </div>
          </>
        ) : (
          <div className="navbar-end">
            <Link 
              to="/login" 
              className={`navbar-item ${isActive('/login') ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className={`navbar-item ${isActive('/register') ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Registrar
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;