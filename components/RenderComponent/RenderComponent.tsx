'use client'

import React from 'react';
import { COMPONENT_TYPES, IComponent } from '@/components/DragAndDrop/types';

import InlineDiv from '@/components/RenderComponent/InlineDiv';
import FullDiv from '@/components/RenderComponent/FullDiv';
import TextComponent from '@/components/RenderComponent/TextComponent';
import ImageComponent from '@/components/RenderComponent/ImageComponent';
import ButtonComponent from './ButtonComponent';
import FormComponent from './FormComponent';

interface RenderComponentProps {
  component: IComponent;
  onDrop: (
    type: COMPONENT_TYPES,
    parentId?: string | null,
    parentSubId?: string | null,
    extraChildren?: IComponent | null
  ) => void;
  updateComponent: (id: string, updated: IComponent) => void;
  deleteComponent: (id: string) => void;
  parentId?: string | null; // parentId é opcional aqui
}

const RenderComponent: React.FC<RenderComponentProps> = ({
  component,
  parentId,
  onDrop,
  updateComponent,
  deleteComponent,
}) => {

  switch (component.type) {
    case COMPONENT_TYPES.DIV_INLINE:
      return (
        <InlineDiv
          component={component}
          onDrop={onDrop}
          updateComponent={updateComponent}
          deleteComponent={deleteComponent}
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
        />
      );
    case COMPONENT_TYPES.TEXT:
      return (
        <TextComponent
          component={component}
          updateComponent={updateComponent}
          deleteComponent={deleteComponent}
        />
      );
    case COMPONENT_TYPES.IMAGE:
      return (
        <ImageComponent
          component={component}
          updateComponent={updateComponent}
          deleteComponent={deleteComponent}
        />
      );
    case COMPONENT_TYPES.BUTTON:
      return (
        <ButtonComponent
          component={component}
          updateComponent={updateComponent}
          deleteComponent={deleteComponent}
        />
      );
    case COMPONENT_TYPES.FORM:
      return (
        <FormComponent
          component={component}
          updateComponent={updateComponent}
          deleteComponent={deleteComponent}
        />
      );
    default:
      return null;
  }
};

export default RenderComponent;
