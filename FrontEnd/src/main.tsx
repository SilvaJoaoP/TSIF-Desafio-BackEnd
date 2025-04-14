import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

import './styles/global.css'; 
import './styles/navbar.css'; 
import './styles/login.css';  
import './styles/tag.css';
import './styles/task.css';
import './styles/style.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);