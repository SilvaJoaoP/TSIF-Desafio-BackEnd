import api from '../lib/axios';
import { Tag } from './tagService';

// Interface para a Task
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

// Interface para criação de Task
export interface CreateTaskDTO {
  title: string;
  status: 'Em andamento' | 'Finalizado';
  priority: number;
  description?: string;
}

// Interface para atualização de Task
export interface UpdateTaskDTO {
  title?: string;
  status?: 'Em andamento' | 'Finalizado';
  priority?: number;
  description?: string;
}

// Interface para a adição de tags a uma task
export interface AddTagsDTO {
  tagIds: number | number[];
}

// Buscar todas as tasks do usuário
export const getTasks = async (): Promise<Task[]> => {
  try {
    const response = await api.get<Task[]>('/tasks/list');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    throw error;
  }
};

// Buscar uma task específica
// Ajuste na função getTaskById para garantir que está buscando a tarefa com suas tags
export const getTaskById = async (id: number): Promise<Task> => {
    try {
      // Aqui garantimos que estamos buscando da rota correta que retorna as tags
      const response = await api.get<Task>(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar tarefa ${id}:`, error);
      throw error;
    }
  };

// Criar uma nova task
export const createTask = async (task: CreateTaskDTO): Promise<Task> => {
  try {
    const response = await api.post<Task>('/tasks/create', task);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    throw error;
  }
};

// Atualizar uma task existente
export const updateTask = async (id: number, task: UpdateTaskDTO): Promise<Task> => {
  try {
    const response = await api.put<Task>(`/tasks/update/${id}`, task);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar tarefa ${id}:`, error);
    throw error;
  }
};

// Excluir uma task
export const deleteTask = async (id: number): Promise<void> => {
  try {
    await api.delete(`/tasks/delete/${id}`);
  } catch (error) {
    console.error(`Erro ao excluir tarefa ${id}:`, error);
    throw error;
  }
};

// Adicionar tags a uma task
// Adicionar tags a uma task
export const addTagsToTask = async (taskId: number, tagIds: number | number[]): Promise<Task> => {
    try {
      let updatedTask: Task | null = null;
      
      // Se for um array, fazer uma requisição para cada tag
      if (Array.isArray(tagIds)) {
        // Log para debug
        console.log(`Adicionando ${tagIds.length} tags à tarefa ${taskId}:`, tagIds);
        
        for (const tagId of tagIds) {
          // Enviando um ID por vez como o backend espera
          console.log(`Adicionando tag ${tagId} à tarefa ${taskId}`);
          const response = await api.put<Task>(`/tasks/add/${taskId}/tags`, { tagIds: tagId });
          updatedTask = response.data;
        }
        
        if (!updatedTask) {
          throw new Error("Falha ao adicionar tags à tarefa");
        }
        return updatedTask;
      } else {
        // Se for apenas um ID, enviar normalmente
        console.log(`Adicionando tag ${tagIds} à tarefa ${taskId}`);
        const response = await api.put<Task>(`/tasks/add/${taskId}/tags`, { tagIds: tagIds });
        return response.data;
      }
    } catch (error) {
      console.error(`Erro ao adicionar tags à tarefa ${taskId}:`, error);
      throw error;
    }
  };