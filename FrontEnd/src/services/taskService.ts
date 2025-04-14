import api from '../lib/axios';
import { Tag } from './tagService';

export interface Task {
  id: number;
  title: string;
  status: 'Em andamento' | 'Finalizado';
  priority: number;
  description?: string;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
  tags?: Tag[];
}

export interface CreateTaskDTO {
  title: string;
  status: 'Em andamento' | 'Finalizado';
  priority: number;
  description?: string;
}

export interface UpdateTaskDTO {
  title?: string;
  status?: 'Em andamento' | 'Finalizado';
  priority?: number;
  description?: string;
}

export interface AddTagsDTO {
  tagIds: number | number[];
}

export const getTasks = async (): Promise<Task[]> => {
  try {
    const response = await api.get<Task[]>('/tasks/list');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    throw error;
  }
};

export const getTaskById = async (id: number): Promise<Task> => {
    try {
      const response = await api.get<Task>(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar tarefa ${id}:`, error);
      throw error;
    }
  };

export const createTask = async (task: CreateTaskDTO): Promise<Task> => {
  try {
    const response = await api.post<Task>('/tasks/create', task);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    throw error;
  }
};

export const updateTask = async (id: number, task: UpdateTaskDTO): Promise<Task> => {
  try {
    const response = await api.put<Task>(`/tasks/update/${id}`, task);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar tarefa ${id}:`, error);
    throw error;
  }
};

export const deleteTask = async (id: number): Promise<void> => {
  try {
    await api.delete(`/tasks/delete/${id}`);
  } catch (error) {
    console.error(`Erro ao excluir tarefa ${id}:`, error);
    throw error;
  }
};

export const addTagsToTask = async (taskId: number, tagIds: number | number[]): Promise<Task> => {
    try {
      let updatedTask: Task | null = null;
      
      if (Array.isArray(tagIds)) {
        console.log(`Adicionando ${tagIds.length} tags à tarefa ${taskId}:`, tagIds);
        
        for (const tagId of tagIds) {
          console.log(`Adicionando tag ${tagId} à tarefa ${taskId}`);
          const response = await api.put<Task>(`/tasks/add/${taskId}/tags`, { tagIds: tagId });
          updatedTask = response.data;
        }
        
        if (!updatedTask) {
          throw new Error("Falha ao adicionar tags à tarefa");
        }
        return updatedTask;
      } else {
        console.log(`Adicionando tag ${tagIds} à tarefa ${taskId}`);
        const response = await api.put<Task>(`/tasks/add/${taskId}/tags`, { tagIds: tagIds });
        return response.data;
      }
    } catch (error) {
      console.error(`Erro ao adicionar tags à tarefa ${taskId}:`, error);
      throw error;
    }
  };