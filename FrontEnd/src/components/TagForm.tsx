import React, { useState } from 'react';
import { Tag, CreateTagDTO, createTag, updateTag } from '../services/tagService';

interface TagFormProps {
  onTagCreated: (tag: Tag) => void;
  editingTag?: Tag | null;
  onCancelEdit?: () => void;
}

const predefinedColors = [
  "#FF5252", "#FF4081", "#E040FB", "#7C4DFF", 
  "#536DFE", "#448AFF", "#40C4FF", "#18FFFF", 
  "#64FFDA", "#69F0AE", "#B2FF59", "#EEFF41", 
  "#FFFF00", "#FFD740", "#FFAB40", "#FF6E40"
];

const TagForm: React.FC<TagFormProps> = ({ 
  onTagCreated, 
  editingTag = null, 
  onCancelEdit 
}) => {
  const [name, setName] = useState(editingTag?.name || '');
  const [color, setColor] = useState(editingTag?.color || predefinedColors[0]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('O nome da tag é obrigatório');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      let newTag: Tag;
      
      if (editingTag) {
        newTag = await updateTag(editingTag.id, { name, color });
      } else {
        newTag = await createTag({ name, color });
      }
      
      setName('');

      onTagCreated(newTag);
      if (editingTag && onCancelEdit) {
        onCancelEdit();
      }
    } catch (err: any) {
      console.error('Erro ao salvar tag:', err);
      setError(err.response?.data?.message || 'Erro ao salvar a tag. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="tag-form">
      <div className="form-group">
        <label htmlFor="tagName">Nome da Tag:</label>
        <input
          type="text"
          id="tagName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Digite o nome da tag"
          disabled={isSubmitting}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="tagColor">Cor da Tag:</label>
        <div className="color-selector">
          {predefinedColors.map((c) => (
            <div 
              key={c}
              className={`color-option ${color === c ? 'selected' : ''}`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-buttons">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : editingTag ? 'Atualizar' : 'Criar'}
        </button>
        
        {editingTag && onCancelEdit && (
          <button 
            type="button" 
            onClick={onCancelEdit}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default TagForm;