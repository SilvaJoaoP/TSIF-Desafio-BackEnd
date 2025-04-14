// filepath: c:\Users\joaop\Desktop\TSIF - Desafio_BackEnd\FrontEnd\src\pages\TaskPage.tsx
import React, { useState, useEffect } from 'react';
// Importe o serviço de tarefas quando criá-lo
// import { getTasks, createTask, updateTask, deleteTask } from '../services/taskService';
// Importe o useAuth para obter o token ou ID do usuário, se necessário pelo serviço
// import { useAuth } from '../context/AuthContext';

function TaskPage() {
  // const { user } = useAuth(); // Exemplo
  const [tasks, setTasks] = useState<any[]>([]); // Use uma interface Task[] mais específica
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        // const fetchedTasks = await getTasks(); // Chamar o serviço real
        // setTasks(fetchedTasks);
        console.log("Buscando tarefas..."); // Placeholder
        setTasks([{ id: 1, title: "Tarefa Exemplo 1", description: "Fazer algo", completed: false }, { id: 2, title: "Tarefa Exemplo 2", description: "Fazer outra coisa", completed: true }]); // Dados de exemplo
      } catch (err) {
        console.error("Erro ao buscar tarefas:", err);
        setError("Não foi possível carregar as tarefas.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []); // Dependência vazia para buscar apenas uma vez

  if (loading) return <div>Carregando tarefas...</div>;
  if (error) return <div style={{ color: 'red' }}>Erro: {error}</div>;

  return (
    <div>
      <h2>Minhas Tarefas</h2>
      {/* TODO: Adicionar formulário para criar nova tarefa */}
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <strong style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.title}
            </strong>: {task.description}
            {/* TODO: Adicionar botões para editar, deletar, marcar como concluída */}
          </li>
        ))}
      </ul>
      {tasks.length === 0 && <p>Nenhuma tarefa encontrada.</p>}
    </div>
  );
}

export default TaskPage;