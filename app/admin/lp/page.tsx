// app/lp/page.tsx (ou pages/LandingPageBuilder.tsx, conforme sua estrutura)

'use client';
import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { COMPONENT_TYPES, IComponent } from '@/components/DragAndDrop/types';
import DraggableComponent from '@/components/DraggableComponent';
import DroppableArea from '@/components/DroppableArea';
import RenderComponent from '@/components/RenderComponent/RenderComponent';

const generateId = () => Math.random().toString(36).substring(2, 9);

const LandingPageBuilder: React.FC = () => {
  const [components, setComponents] = useState<IComponent[]>([]);

  // --- handleDrop ---
  const handleDrop = (
    type: COMPONENT_TYPES,
    parentId: string | null = null,
    parentSubId: string | null = null,
    extraChildren: IComponent | null = null
  ) => {
    const newComponent: IComponent = {
      id: generateId(),
      type,
      content: '',
      parentSubId,
      children: extraChildren?.children || [],
    };

    // Se for imagem, define tamanho inicial
    if (type === COMPONENT_TYPES.IMAGE) {
      newComponent.width = 300;
      newComponent.height = 0;
    }

    // Se não houver parentId, é top-level
    if (!parentId) {
      setComponents((prev) => [...prev, newComponent]);
      return;
    }

    // Caso contrário, insere recursivamente
    setComponents((prev) => {
      const updateRecursively = (list: IComponent[]): IComponent[] =>
        list.map((comp) => {
          if (comp.id === parentId) {
            return {
              ...comp,
              children: [...(comp.children || []), newComponent],
            };
          }
          if (comp.children) {
            return {
              ...comp,
              children: updateRecursively(comp.children),
            };
          }
          return comp;
        });
      return updateRecursively(prev);
    });
  };

  // --- updateComponent ---
  const updateComponent = (id: string, updated: IComponent) => {
    const updateRecursively = (list: IComponent[]): IComponent[] =>
      list.map((comp) => {
        if (comp.id === id) return updated;
        if (comp.children) {
          return {
            ...comp,
            children: updateRecursively(comp.children),
          };
        }
        return comp;
      });
    setComponents((prev) => updateRecursively(prev));
  };

  // --- deleteComponent ---
  const deleteComponent = (id: string) => {
    const removeRecursively = (list: IComponent[]): IComponent[] => {
      return list
        .filter((c) => c.id !== id) // remove o que tiver esse ID
        .map((c) => ({
          ...c,
          children: c.children ? removeRecursively(c.children) : [],
        }));
    };
    setComponents((prev) => removeRecursively(prev));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex gap-5">
        {/* Lateral */}
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-3">Componentes</h3>

          {/* Div Em Linha */}
          <DraggableComponent type={COMPONENT_TYPES.DIV_INLINE}>
            Div (Em Linha)
          </DraggableComponent>

          {/* Div Linha Única */}
          <DraggableComponent type={COMPONENT_TYPES.DIV_FULL}>
            Div (Linha Única)
          </DraggableComponent>

          <DraggableComponent type={COMPONENT_TYPES.TEXT}>Texto</DraggableComponent>
          <DraggableComponent type={COMPONENT_TYPES.IMAGE}>Imagem</DraggableComponent>
        </div>

        {/* Área principal */}
        <div className="flex-[4]">
          <h3 className="text-xl font-bold mb-3">Área de Construção</h3>

          <DroppableArea onDrop={handleDrop} isMainArea>
            {components.map((comp) => (
              <RenderComponent
                key={comp.id}
                component={comp}
                onDrop={handleDrop}
                updateComponent={updateComponent}
                deleteComponent={deleteComponent}
              />
            ))}
          </DroppableArea>
        </div>
      </div>
    </DndProvider>
  );
};

export default LandingPageBuilder;
