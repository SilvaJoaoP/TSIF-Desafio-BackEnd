import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  getTasks, 
  createTask, 
  updateTask, 
  deleteTask, 
  Task,
  addTagsToTask,
  getTaskById
} from '../services/taskService';
import { useAuth } from '../context/AuthContext';
import TaskItem from '../components/TaskItem';
import TaskForm from '../components/TaskForm';
import api from '../lib/axios';

function TaskPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'todas' | 'ativas' | 'concluidas'>('todas');

  // Buscar tarefas ao carregar a página
  useEffect(() => {
    fetchTasks();
  }, []);

  // Aplicar filtro sempre que a lista de tarefas ou o filtro mudar
  useEffect(() => {
    filterTasks();
  }, [tasks, filter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscamos diretamente da API para garantir que estamos recebendo as tags
      const response = await api.get('/tasks/list');
      
      if (response.data) {
        console.log("Tarefas recebidas:", response.data);
        // Verificamos se cada tarefa tem tags
        setTasks(response.data);
      }
    } catch (err: any) {
      console.error("Erro ao buscar tarefas:", err);
      setError(err.response?.data?.message || "Não foi possível carregar as tarefas.");
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    if (filter === 'todas') {
      setFilteredTasks(tasks);
    } else if (filter === 'ativas') {
      setFilteredTasks(tasks.filter(task => task.status === 'Em andamento'));
    } else {
      setFilteredTasks(tasks.filter(task => task.status === 'Finalizado'));
    }
  };

  const handleTaskSaved = async (task: Task) => {
    try {
      let savedTask: Task;
      
      if (editingTask) {
        // Atualizar tarefa existente
        savedTask = await updateTask(task.id, {
          title: task.title,
          status: task.status,
          priority: task.priority,
          description: task.description
        });
        
        // Se há tags selecionadas, atualizamos as tags
        if (task.tags && task.tags.length > 0) {
          try {
            const tagIds = task.tags.map(tag => tag.id);
            console.log("Adicionando tags à tarefa:", tagIds);
            
            // Adicione cada tag individualmente para garantir compatibilidade
            for (const tagId of tagIds) {
              await api.put(`/tasks/add/${task.id}/tags`, { tagIds: tagId });
            }
            
            // Atualize o estado local diretamente sem fazer nova requisição
            const updatedTask = {
              ...savedTask,
              tags: task.tags
            };
            
            setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
          } catch (tagError) {
            console.error("Erro ao adicionar tags:", tagError);
            // Mesmo com erro nas tags, a tarefa foi atualizada
            setTasks(tasks.map(t => t.id === task.id ? savedTask : t));
            alert("A tarefa foi atualizada, mas houve um problema ao atualizar as etiquetas.");
          }
        } else {
          setTasks(tasks.map(t => t.id === task.id ? savedTask : t));
        }
        
        setEditingTask(null);
      } else {
        // Criar nova tarefa
        savedTask = await createTask({
          title: task.title,
          status: task.status,
          priority: task.priority,
          description: task.description
        });
        
        // Se há tags selecionadas, associamos à tarefa criada
        if (task.tags && task.tags.length > 0) {
          try {
            const tagIds = task.tags.map(tag => tag.id);
            console.log("Adicionando tags à nova tarefa:", tagIds);
            
            // Adicione cada tag individualmente
            for (const tagId of tagIds) {
              await api.put(`/tasks/add/${savedTask.id}/tags`, { tagIds: tagId });
            }
            
            // Atualize o estado local diretamente
            const newTaskWithTags = {
              ...savedTask,
              tags: task.tags
            };
            
            setTasks([...tasks, newTaskWithTags]);
          } catch (tagError) {
            console.error("Erro ao adicionar tags:", tagError);
            // Mesmo com erro nas tags, a tarefa foi criada
            setTasks([...tasks, savedTask]);
            alert("A tarefa foi criada, mas houve um problema ao adicionar as etiquetas.");
          }
        } else {
          setTasks([...tasks, savedTask]);
        }
      }
      
      setShowForm(false);
      
      
    } catch (err: any) {
      console.error("Erro ao salvar tarefa:", err);
      alert(err.response?.data?.message || "Erro ao salvar tarefa. Tente novamente.");
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err: any) {
      console.error("Erro ao excluir tarefa:", err);
      alert(err.response?.data?.message || "Erro ao excluir tarefa. Tente novamente.");
    }
  };

  const handleStatusChange = async (id: number, newStatus: 'Em andamento' | 'Finalizado') => {
    try {
      const updatedTask = await updateTask(id, { status: newStatus });
      setTasks(tasks.map(task => task.id === id ? {...task, status: newStatus} : task));
    } catch (err: any) {
      console.error("Erro ao atualizar status:", err);
      alert(err.response?.data?.message || "Erro ao atualizar status. Tente novamente.");
    }
  };

  const toggleForm = () => {
    if (showForm && editingTask) {
      setEditingTask(null);
    }
    setShowForm(!showForm);
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setShowForm(false);
  };

  if (loading && tasks.length === 0) {
    return <div className="task-page">Carregando tarefas...</div>;
  }

  return (
    <div className="task-page">
      <div className="page-header">
        <h2>Minhas Tarefas</h2>
        <button 
          className="create-button" 
          onClick={toggleForm}
        >
          {showForm ? 'Cancelar' : 'Nova Tarefa'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Formulário para criar/editar tarefa */}
      {showForm && (
        <div className="form-container">
          <h3>{editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}</h3>
          <TaskForm 
            onTaskSaved={handleTaskSaved} 
            editingTask={editingTask} 
            onCancelEdit={cancelEdit}
          />
        </div>
      )}

      {/* Filtros de tarefas */}
      <div className="filter-buttons">
        <button 
          className={`filter-button ${filter === 'todas' ? 'active' : ''}`}
          onClick={() => setFilter('todas')}
        >
          Todas
        </button>
        <button 
          className={`filter-button ${filter === 'ativas' ? 'active' : ''}`}
          onClick={() => setFilter('ativas')}
        >
          Em Andamento
        </button>
        <button 
          className={`filter-button ${filter === 'concluidas' ? 'active' : ''}`}
          onClick={() => setFilter('concluidas')}
        >
          Concluídas
        </button>
      </div>

      {/* Lista de tarefas */}
      {filteredTasks.length > 0 ? (
        <div className="task-list">
          {filteredTasks.map(task => (
            <TaskItem 
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="no-tasks-message">
          {filter === 'todas' 
            ? 'Nenhuma tarefa encontrada. Crie sua primeira tarefa!' 
            : filter === 'ativas'
              ? 'Nenhuma tarefa em andamento.'
              : 'Nenhuma tarefa concluída.'}
        </div>
      )}

      {/* Link de navegação para Tags */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Link to="/tags">Gerenciar Etiquetas</Link>
      </div>
    </div>
  );
}

export default TaskPage;