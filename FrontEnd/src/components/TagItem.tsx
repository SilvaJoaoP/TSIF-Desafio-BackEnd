import React from 'react';
import { Tag } from '../services/tagService';

interface TagItemProps {
  tag: Tag;
  onEdit: (tag: Tag) => void;
  onDelete: (id: number) => void;
}

const TagItem: React.FC<TagItemProps> = ({ tag, onEdit, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir a tag "${tag.name}"?`)) {
      onDelete(tag.id);
    }
  };

  return (
    <div 
      className="tag-item"
      style={{ borderLeft: `4px solid ${tag.color}` }}
    >
      <div className="tag-info">
        <div 
          className="tag-color-indicator"
          style={{ backgroundColor: tag.color }}
        />
        <span className="tag-name">{tag.name}</span>
      </div>
      <div className="tag-actions">
        <button 
          className="edit-button" 
          onClick={() => onEdit(tag)}
          aria-label={`Editar tag ${tag.name}`}
        >
          Editar
        </button>
        <button 
          className="delete-button" 
          onClick={handleDelete}
          aria-label={`Excluir tag ${tag.name}`}
        >
          Excluir
        </button>
      </div>
    </div>
  );
};

export default TagItem;