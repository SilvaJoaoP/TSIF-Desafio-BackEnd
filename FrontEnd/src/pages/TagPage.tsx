import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';
import TagItem from '../components/TagItem';

interface Tag {
  id: number;
  name: string;
  color: string;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}

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
  
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState(predefinedColors[0]);
  const [editingTagId, setEditingTagId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        setError(null);
        
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

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName.trim()) {
      setFormError("O nome da tag não pode estar vazio");
      return;
    }

    try {
      setFormError(null);
      const response = await api.post('/tags/create', { 
        name: tagName,
        color: tagColor 
      });
      
      setTags([...tags, response.data]);
      setTagName("");
      alert("Tag criada com sucesso!");
    } catch (err: any) {
      console.error("Erro ao criar tag:", err);
      setFormError(err.response?.data?.message || "Erro ao criar a tag.");
    }
  };

  const startEditing = (tag: Tag) => {
    setEditingTagId(tag.id);
    setTagName(tag.name);
    setTagColor(tag.color);
  };

  const cancelEditing = () => {
    setEditingTagId(null);
    setTagName("");
    setTagColor(predefinedColors[0]);
    setFormError(null);
  };

  const handleUpdateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName.trim() || !editingTagId) {
      setFormError("O nome da tag não pode estar vazio");
      return;
    }

    try {
      setFormError(null);
      const response = await api.put(`/tags/update/${editingTagId}`, { 
        name: tagName,
        color: tagColor 
      });
      
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

  if (loading) return <div className="container">Carregando tags...</div>;

  return (
    <div className="container">
      <h2>Minhas Etiquetas</h2>

      {/* Formulário para criar/editar tags */}
      <div className="tag-form-container card">
        <h3>{editingTagId ? 'Editar Tag' : 'Nova Tag'}</h3>
        <form className="tag-form" onSubmit={editingTagId ? handleUpdateTag : handleCreateTag}>
          <div className="form-group">
            <label htmlFor="tagName">Nome:</label>
            <input
              id="tagName"
              type="text"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              className="form-control"
            />
          </div>

          {/* Seletor de cores */}
          <div className="form-group">
            <label>Cor:</label>
            <div className="color-selector">
              {predefinedColors.map(color => (
                <div 
                  key={color}
                  onClick={() => setTagColor(color)}
                  className={`color-option ${tagColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  title={color}
                  aria-label={`Cor ${color}`}
                />
              ))}
            </div>
          </div>
          
          {formError && <div className="error-message">{formError}</div>}
          
          <div className="form-buttons">
            <button type="submit" className="btn btn-primary">
              {editingTagId ? 'Atualizar' : 'Criar'}
            </button>
            
            {editingTagId && (
              <button
                type="button"
                onClick={cancelEditing}
                className="btn btn-danger"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de tags */}
      {error && <div className="error-message">{error}</div>}
      
      {tags.length > 0 ? (
        <div className="tag-list">
          {tags.map(tag => (
            <TagItem 
              key={tag.id}
              tag={tag}
              onEdit={startEditing}
              onDelete={handleDeleteTag}
            />
          ))}
        </div>
      ) : (
        <div className="no-tags-message">
          Nenhuma tag encontrada. Crie sua primeira tag!
        </div>
      )}
    </div>
  );
}

export default TagPage;