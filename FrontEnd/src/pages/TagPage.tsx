// filepath: c:\Users\joaop\Desktop\TSIF - Desafio_BackEnd\FrontEnd\src\pages\TagPage.tsx
import React, { useState, useEffect } from 'react';
// Importe o serviço de tags quando criá-lo
// import { getTags, createTag, updateTag, deleteTag } from '../services/tagService';

function TagPage() {
  const [tags, setTags] = useState<any[]>([]); // Use uma interface Tag[] mais específica
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        setError(null);
        // const fetchedTags = await getTags(); // Chamar o serviço real
        console.log("Buscando tags..."); // Placeholder
        setTags([{ id: 1, name: "Trabalho" }, { id: 2, name: "Pessoal" }]); // Dados de exemplo
      } catch (err) {
        console.error("Erro ao buscar tags:", err);
        setError("Não foi possível carregar as tags.");
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  if (loading) return <div>Carregando tags...</div>;
  if (error) return <div style={{ color: 'red' }}>Erro: {error}</div>;

  return (
    <div>
      <h2>Minhas Etiquetas</h2>
      {/* TODO: Adicionar formulário para criar nova tag */}
      <ul>
        {tags.map(tag => (
          <li key={tag.id}>
            {tag.name}
            {/* TODO: Adicionar botões para editar, deletar */}
          </li>
        ))}
      </ul>
       {tags.length === 0 && <p>Nenhuma tag encontrada.</p>}
    </div>
  );
}

export default TagPage;