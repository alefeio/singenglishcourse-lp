'use client';
import React from 'react';
import { COMPONENT_TYPES, IComponent } from '@/components/DragAndDrop/types';

import InlineDiv from '@/components/RenderComponent/InlineDiv';
import FullDiv from '@/components/RenderComponent/FullDiv';
import TextComponent from '@/components/RenderComponent/TextComponent';
import ImageComponent from '@/components/RenderComponent/ImageComponent';

interface RenderComponentProps {
  component: IComponent;
  onDrop: (...args: any) => void;
  updateComponent: (id: string, updated: IComponent) => void;
  deleteComponent: (id: string) => void;
  addComponent: (newComponent: IComponent, parentId: string | null) => void; // Atualiza para aceitar parentId
  parentId?: string | null; // parentId é opcional aqui
}

const RenderComponent: React.FC<RenderComponentProps> = ({
  component,
  parentId,
  onDrop,
  updateComponent,
  deleteComponent,
  addComponent,
}) => {
  const handleDuplicate = () => {
    const duplicatedComponent: IComponent = {
      ...component,
      id: Math.random().toString(36).substring(2, 9), // Gera novo ID para o componente
      children: component.children
        ? component.children.map((child) => ({
          ...child,
          id: Math.random().toString(36).substring(2, 9), // Novo ID para cada filho
        }))
        : [],
    };

    addComponent(duplicatedComponent, parentId || null); // Passa o parentId
  };

  switch (component.type) {
    case COMPONENT_TYPES.DIV_INLINE:
      return (
        <InlineDiv
          component={component}
          onDrop={onDrop}
          updateComponent={updateComponent}
          deleteComponent={deleteComponent}
          addComponent={addComponent} // Adicione esta linha
          parentId={parentId || null} 
        />
      );
    case COMPONENT_TYPES.DIV_FULL:
      return (
        <FullDiv
          component={component}
          onDrop={onDrop}
          updateComponent={updateComponent}
          deleteComponent={deleteComponent}
          duplicateComponent={handleDuplicate} // Usa a função handleDuplicate
        />
      );
    case COMPONENT_TYPES.TEXT:
      return (
        <TextComponent
          component={component}
          updateComponent={updateComponent}
          deleteComponent={deleteComponent}
          duplicateComponent={handleDuplicate} // Usa a função handleDuplicate
        />
      );
    case COMPONENT_TYPES.IMAGE:
      return (
        <ImageComponent
          component={component}
          updateComponent={updateComponent}
          deleteComponent={deleteComponent}
          duplicateComponent={handleDuplicate} // Usa a função handleDuplicate
        />
      );
    default:
      return null;
  }
};

export default RenderComponent;
