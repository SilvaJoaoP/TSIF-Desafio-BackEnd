import React from 'react';
import { Task } from '../services/taskService';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, newStatus: 'Em andamento' | 'Finalizado') => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir a tarefa "${task.title}"?`)) {
      onDelete(task.id);
    }
  };

  const toggleStatus = () => {
    const newStatus = task.status === 'Em andamento' ? 'Finalizado' : 'Em andamento';
    onStatusChange(task.id, newStatus);
  };

  // Determinando a cor de prioridade
  const getPriorityColor = () => {
    if (task.priority >= 5) return '#ff4d4d'; // Vermelho para alta prioridade
    if (task.priority >= 3) return '#ffa64d'; // Laranja para média prioridade
    return '#4caf50'; // Verde para baixa prioridade
  };

  return (
    <div className="task-item">
      <div className="task-header">
        <div className="task-title-container">
          <div 
            className="priority-indicator" 
            style={{ backgroundColor: getPriorityColor() }}
            title={`Prioridade: ${task.priority}`}
          />
          <h3 
            className={`task-title ${task.status === 'Finalizado' ? 'completed' : ''}`}
          >
            {task.title}
          </h3>
        </div>
        
        <div className="task-status">
          <span className={`status-badge ${task.status === 'Finalizado' ? 'completed' : 'in-progress'}`}>
            {task.status}
          </span>
        </div>
      </div>
      
      {task.description && (
        <div className="task-description">
          {task.description}
        </div>
      )}
      
      {/* Exibição das tags - com verificação de existência */}
      <div className="task-tags">
        {task.tags && task.tags.length > 0 ? (
          task.tags.map(tag => (
            <span 
              key={tag.id} 
              className="tag-badge"
              style={{ backgroundColor: tag.color || '#ccc' }}
            >
              {tag.name}
            </span>
          ))
        ) : (
          <span className="no-tags">Sem etiquetas</span>
        )}
      </div>
      
      <div className="task-actions">
        <button 
          className="button toggle-status" 
          onClick={toggleStatus}
        >
          {task.status === 'Em andamento' ? 'Finalizar' : 'Reabrir'}
        </button>
        <button 
          className="button edit" 
          onClick={() => onEdit(task)}
        >
          Editar
        </button>
        <button 
          className="button delete" 
          onClick={handleDelete}
        >
          Excluir
        </button>
      </div>
    </div>
  );
};

export default TaskItem;