import api from '../lib/axios';

// Interface para a Tag
export interface Tag {
  id: number;
  name: string;
  color: string;  // Adicionado campo obrigatório de cor
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Interface para criação de Tag
export interface CreateTagDTO {
  name: string;
  color: string;  // Adicionado campo obrigatório de cor
}

// Interface para atualização de Tag
export interface UpdateTagDTO {
  name: string;
  color: string;  // Adicionado campo obrigatório de cor
}

// Buscar todas as tags do usuário
export const getTags = async (): Promise<Tag[]> => {
  try {
    const response = await api.get<Tag[]>('/tags/list');  // Corrigido conforme teste.txt
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar tags:', error);
    throw error;
  }
};

// Buscar uma tag específica
export const getTagById = async (id: number): Promise<Tag> => {
  try {
    const response = await api.get<Tag>(`/tags/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar tag ${id}:`, error);
    throw error;
  }
};

// Criar uma nova tag
export const createTag = async (tag: CreateTagDTO): Promise<Tag> => {
  try {
    const response = await api.post<Tag>('/tags/create', tag);  // Corrigido conforme teste.txt
    return response.data;
  } catch (error) {
    console.error('Erro ao criar tag:', error);
    throw error;
  }
};

// Atualizar uma tag existente
export const updateTag = async (id: number, tag: UpdateTagDTO): Promise<Tag> => {
  try {
    const response = await api.put<Tag>(`/tags/update/${id}`, tag);  // Corrigido conforme teste.txt
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar tag ${id}:`, error);
    throw error;
  }
};

// Excluir uma tag
export const deleteTag = async (id: number): Promise<void> => {
  try {
    await api.delete(`/tags/delete/${id}`);  // Corrigido conforme teste.txt
  } catch (error) {
    console.error(`Erro ao excluir tag ${id}:`, error);
    throw error;
  }
};