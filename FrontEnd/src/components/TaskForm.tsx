import React, { useState, useEffect } from 'react';
import { Task, CreateTaskDTO } from '../services/taskService';
import { Tag, getTags } from '../services/tagService';

interface TaskFormProps {
  onTaskSaved: (task: Task) => void;
  editingTask?: Task | null;
  onCancelEdit?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onTaskSaved, editingTask = null, onCancelEdit }) => {
  const [title, setTitle] = useState(editingTask?.title || '');
  const [status, setStatus] = useState<'Em andamento' | 'Finalizado'>(
    editingTask?.status || 'Em andamento'
  );
  const [priority, setPriority] = useState(editingTask?.priority || 1);
  const [description, setDescription] = useState(editingTask?.description || '');
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoadingTags(true);
        const tags = await getTags();
        setAvailableTags(tags);
        
        if (editingTask?.tags) {
          setSelectedTags(editingTask.tags.map(tag => tag.id));
        }
      } catch (err) {
        console.error('Erro ao buscar tags:', err);
        setError('Não foi possível carregar as tags disponíveis.');
      } finally {
        setIsLoadingTags(false);
      }
    };

    fetchTags();
  }, [editingTask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('O título da tarefa é obrigatório');
      return;
    }

    if (priority < 1) {
      setError('A prioridade deve ser pelo menos 1');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const taskData: CreateTaskDTO = {
        title,
        status,
        priority,
        description: description || undefined
      };

      const mockTask: Task = {
        id: editingTask?.id || Math.floor(Math.random() * 1000),
        title,
        status,
        priority,
        description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: availableTags.filter(tag => selectedTags.includes(tag.id))
      };
      
      onTaskSaved(mockTask);
      
      if (!editingTask) {
        setTitle('');
        setStatus('Em andamento');
        setPriority(1);
        setDescription('');
        setSelectedTags([]);
      } else if (onCancelEdit) {
        onCancelEdit();
      }
    } catch (err: any) {
      console.error('Erro ao salvar tarefa:', err);
      setError(err.response?.data?.message || 'Erro ao salvar a tarefa. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagToggle = (tagId: number) => {
    setSelectedTags(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-group">
        <label htmlFor="title">Título:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Digite o título da tarefa"
          disabled={isSubmitting}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="status">Status:</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as 'Em andamento' | 'Finalizado')}
          disabled={isSubmitting}
        >
          <option value="Em andamento">Em andamento</option>
          <option value="Finalizado">Finalizado</option>
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="priority">Prioridade:</label>
        <input
          type="number"
          id="priority"
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
          min="1"
          disabled={isSubmitting}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Descrição:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição opcional da tarefa"
          disabled={isSubmitting}
          rows={4}
        />
      </div>
      
      <div className="form-group">
        <label>Tags:</label>
        {isLoadingTags ? (
          <p>Carregando tags...</p>
        ) : availableTags.length > 0 ? (
          <div className="tag-selector">
            {availableTags.map(tag => (
              <div 
                key={tag.id}
                className={`tag-option ${selectedTags.includes(tag.id) ? 'selected' : ''}`}
                onClick={() => handleTagToggle(tag.id)}
                style={{
                  backgroundColor: selectedTags.includes(tag.id) ? tag.color : '#f0f0f0',
                  color: selectedTags.includes(tag.id) ? '#fff' : '#000',
                  borderLeft: `4px solid ${tag.color}`
                }}
              >
                {tag.name}
              </div>
            ))}
          </div>
        ) : (
          <p>Nenhuma tag disponível. <a href="/tags">Criar tags</a></p>
        )}
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-buttons">
        <button type="submit" disabled={isSubmitting} className="button primary">
          {isSubmitting ? 'Salvando...' : editingTask ? 'Atualizar Tarefa' : 'Criar Tarefa'}
        </button>
        
        {editingTask && onCancelEdit && (
          <button 
            type="button" 
            onClick={onCancelEdit}
            disabled={isSubmitting}
            className="button secondary"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;