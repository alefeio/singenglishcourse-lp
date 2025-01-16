'use client';
import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { COMPONENT_TYPES, IComponent } from '@/components/DragAndDrop/types';
import DraggableComponent from '@/components/DraggableComponent';
import DroppableArea from '@/components/DroppableArea';
import RenderComponent from '@/components/RenderComponent';

const generateId = () => Math.random().toString(36).substring(2, 9);

const LandingPageBuilder: React.FC = () => {
  const [components, setComponents] = useState<IComponent[]>([]);

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
      children: null,
    };

    // Se for imagem, define tamanho inicial
    if (type === COMPONENT_TYPES.IMAGE) {
      newComponent.width = 300;
      newComponent.height = 0; // 'auto'
    }

    // Se vier sub-children (caso você use "twoDivs", etc.)
    if (extraChildren?.children) {
      newComponent.children = extraChildren.children;
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
            if (parentSubId) {
              return {
                ...comp,
                children: [
                  ...(comp.children || []),
                  { ...newComponent, parentSubId },
                ],
              };
            }
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

  // Atualiza texto, imagem, etc.
  const updateComponent = (id: string, updatedComp: IComponent) => {
    const updateRecursively = (list: IComponent[]): IComponent[] =>
      list.map((comp) => {
        if (comp.id === id) return updatedComp;
        if (comp.children) {
          return { ...comp, children: updateRecursively(comp.children) };
        }
        return comp;
      });
    setComponents((prev) => updateRecursively(prev));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex gap-5">
        {/* Lateral */}
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-3">Componentes</h3>

          {/* Div em Linha */}
          <DraggableComponent type={COMPONENT_TYPES.DIV_INLINE}>
            Div (Em Linha)
          </DraggableComponent>

          {/* Div em Linha Única */}
          <DraggableComponent type={COMPONENT_TYPES.DIV_FULL}>
            Div (Linha Única)
          </DraggableComponent>

          <DraggableComponent type={COMPONENT_TYPES.TEXT}>
            Texto
          </DraggableComponent>

          <DraggableComponent type={COMPONENT_TYPES.IMAGE}>
            Imagem
          </DraggableComponent>
        </div>

        {/* Área principal */}
        <div style={{width: '1280px'}}>
          <h3 className="text-xl font-bold mb-3">Área de Construção</h3>

          <DroppableArea onDrop={handleDrop} isMainArea>
            {components.map((comp) => (
              <RenderComponent
                key={comp.id}
                component={comp}
                onDrop={handleDrop}
                updateComponent={updateComponent}
              />
            ))}
          </DroppableArea>
        </div>
      </div>
    </DndProvider>
  );
};

export default LandingPageBuilder;
