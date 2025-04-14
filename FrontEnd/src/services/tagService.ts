import api from '../lib/axios';

export interface Tag {
  id: number;
  name: string;
  color: string;  
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTagDTO {
  name: string;
  color: string;  
}

export interface UpdateTagDTO {
  name: string;
  color: string; 
}

export const getTags = async (): Promise<Tag[]> => {
  try {
    const response = await api.get<Tag[]>('/tags/list');  
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar tags:', error);
    throw error;
  }
};

export const getTagById = async (id: number): Promise<Tag> => {
  try {
    const response = await api.get<Tag>(`/tags/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar tag ${id}:`, error);
    throw error;
  }
};

export const createTag = async (tag: CreateTagDTO): Promise<Tag> => {
  try {
    const response = await api.post<Tag>('/tags/create', tag);  
    return response.data;
  } catch (error) {
    console.error('Erro ao criar tag:', error);
    throw error;
  }
};

export const updateTag = async (id: number, tag: UpdateTagDTO): Promise<Tag> => {
  try {
    const response = await api.put<Tag>(`/tags/update/${id}`, tag);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar tag ${id}:`, error);
    throw error;
  }
};

export const deleteTag = async (id: number): Promise<void> => {
  try {
    await api.delete(`/tags/delete/${id}`); 
  } catch (error) {
    console.error(`Erro ao excluir tag ${id}:`, error);
    throw error;
  }
};