import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';

// Interface para representar uma Tag
interface Tag {
  id: number;
  name: string;
  color: string; // Adicionado campo obrigatório de cor
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Lista de cores predefinidas para escolher
const predefinedColors = [
  "#FF5252", "#FF4081", "#E040FB", "#7C4DFF", 
  "#536DFE", "#448AFF", "#40C4FF", "#18FFFF", 
  "#64FFDA", "#69F0AE", "#B2FF59", "#EEFF41", 
  "#FFFF00", "#FFD740", "#FFAB40", "#FF6E40"
];

function TagPage() {
  const { user } = useAuth();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para criar/editar tags
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState(predefinedColors[0]); // Valor padrão
  const [editingTagId, setEditingTagId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Buscar tags do servidor
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Chamada para API conforme teste.txt
        const response = await api.get('/tags/list');
        setTags(response.data);
        
      } catch (err: any) {
        console.error("Erro ao buscar tags:", err);
        setError(err.response?.data?.message || "Não foi possível carregar as tags.");
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  // Função para criar nova tag
  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName.trim()) {
      setFormError("O nome da tag não pode estar vazio");
      return;
    }

    try {
      setFormError(null);
      // Incluindo a cor no payload
      const response = await api.post('/tags/create', { 
        name: tagName,
        color: tagColor 
      });
      
      // Adiciona a tag retornada à lista de tags
      setTags([...tags, response.data]);
      setTagName("");
      // Não reseta a cor para permitir criar várias tags da mesma cor
      alert("Tag criada com sucesso!");
    } catch (err: any) {
      console.error("Erro ao criar tag:", err);
      setFormError(err.response?.data?.message || "Erro ao criar a tag.");
    }
  };

  // Iniciar edição de uma tag
  const startEditing = (tag: Tag) => {
    setEditingTagId(tag.id);
    setTagName(tag.name);
    setTagColor(tag.color);
  };

  // Cancelar edição
  const cancelEditing = () => {
    setEditingTagId(null);
    setTagName("");
    setTagColor(predefinedColors[0]);
    setFormError(null);
  };

  // Atualizar tag
  const handleUpdateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName.trim() || !editingTagId) {
      setFormError("O nome da tag não pode estar vazio");
      return;
    }

    try {
      setFormError(null);
      // Incluindo a cor no payload
      const response = await api.put(`/tags/update/${editingTagId}`, { 
        name: tagName,
        color: tagColor 
      });
      
      // Atualiza a tag na lista local
      setTags(tags.map(tag => tag.id === editingTagId ? response.data : tag));
      setTagName("");
      setTagColor(predefinedColors[0]);
      setEditingTagId(null);
      alert("Tag atualizada com sucesso!");
    } catch (err: any) {
      console.error("Erro ao atualizar tag:", err);
      setFormError(err.response?.data?.message || "Erro ao atualizar a tag.");
    }
  };

  // Excluir tag
  const handleDeleteTag = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir esta tag?")) {
      return;
    }

    try {
      await api.delete(`/tags/delete/${id}`);
      setTags(tags.filter(tag => tag.id !== id));
      alert("Tag excluída com sucesso!");
    } catch (err: any) {
      console.error("Erro ao excluir tag:", err);
      alert(err.response?.data?.message || "Erro ao excluir a tag.");
    }
  };

  if (loading) return <div>Carregando tags...</div>;
  if (error) return <div style={{ color: 'red' }}>Erro: {error}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>Minhas Etiquetas</h2>

      {/* Formulário para criar/editar tags */}
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '15px', 
        borderRadius: '5px',
        marginBottom: '20px'
      }}>
        <h3>{editingTagId ? 'Editar Tag' : 'Nova Tag'}</h3>
        <form onSubmit={editingTagId ? handleUpdateTag : handleCreateTag}>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="tagName" style={{ display: 'block', marginBottom: '5px' }}>
              Nome:
            </label>
            <input
              id="tagName"
              type="text"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '8px', 
                borderRadius: '4px', 
                border: '1px solid #ddd' 
              }}
            />
          </div>

          {/* Seletor de cores */}
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="tagColor" style={{ display: 'block', marginBottom: '5px' }}>
              Cor:
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {predefinedColors.map(color => (
                <div 
                  key={color}
                  onClick={() => setTagColor(color)}
                  style={{
                    width: '30px',
                    height: '30px',
                    backgroundColor: color,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    border: tagColor === color ? '2px solid #000' : '1px solid #ddd'
                  }}
                  title={color}
                  aria-label={`Cor ${color}`}
                  role="button"
                  tabIndex={0}
                />
              ))}
            </div>
          </div>
          
          {formError && <p style={{ color: 'red' }}>{formError}</p>}
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="submit" 
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#4CAF50', 
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {editingTagId ? 'Atualizar' : 'Criar'}
            </button>
            
            {editingTagId && (
              <button
                type="button"
                onClick={cancelEditing}
                style={{ 
                  padding: '8px 16px', 
                  backgroundColor: '#f44336', 
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de tags */}
      {tags.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tags.map(tag => (
            <li 
              key={tag.id} 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '10px',
                marginBottom: '8px',
                backgroundColor: '#f9f9f9',
                borderRadius: '4px',
                borderLeft: `6px solid ${tag.color || '#ccc'}` // Mostra a cor da tag
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div 
                  style={{ 
                    width: '16px', 
                    height: '16px', 
                    backgroundColor: tag.color || '#ccc',
                    borderRadius: '3px',
                    marginRight: '8px'
                  }} 
                />
                <span>{tag.name}</span>
              </div>
              <div>
                <button 
                  onClick={() => startEditing(tag)}
                  style={{ 
                    marginRight: '5px', 
                    padding: '5px 10px', 
                    backgroundColor: '#2196F3', 
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleDeleteTag(tag.id)}
                  style={{ 
                    padding: '5px 10px', 
                    backgroundColor: '#f44336', 
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhuma tag encontrada. Crie sua primeira tag!</p>
      )}
    </div>
  );
}

export default TagPage;