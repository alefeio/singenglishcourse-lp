// RenderComponent/FullDiv.tsx

'use client';
import React from 'react';
import DroppableArea from '@/components/DroppableArea';
import RenderComponent from '@/components/RenderComponent/RenderComponent';
import ColorPickerButton from './ColorPickerButton';

import { IComponent } from '@/components/DragAndDrop/types';

interface FullDivProps {
  component: IComponent;
  onDrop: (...args: any) => void;
  updateComponent: (id: string, updated: IComponent) => void;
  deleteComponent: (id: string) => void;
}

const FullDiv: React.FC<FullDivProps> = ({
  component,
  onDrop,
  updateComponent,
  deleteComponent,
}) => {
  const style: React.CSSProperties = {
    backgroundColor: component.backgroundColor || 'transparent',
    margin: component.margin ?? 0,
    padding: component.padding ?? 0,
    borderRadius: component.borderRadius ?? 0,
    borderStyle: 'solid',
    borderWidth: component.borderWidth ?? 1,
    borderColor: component.borderColor ?? 'rgba(204,204,204,1)',
    flex: '0 0 100%', // para ocupar a linha toda
    overflow: 'visible',
  };

  const handleUpdate = (props: Partial<IComponent>) => {
    updateComponent(component.id, { ...component, ...props });
  };

  return (
    <div style={style} className="relative">
      {/* Botão x */}
      <button
        type="button"
        onClick={() => deleteComponent(component.id)}
        className="absolute top-0 right-0 m-1 text-white bg-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs"
        style={{ zIndex: 20 }}
      >
        x
      </button>

      <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
        <label>Fundo:
          <ColorPickerButton
            value={component.backgroundColor || 'rgba(0,0,0,1)'}
            onChange={(c) => handleUpdate({ backgroundColor: c })}
          />
        </label>
        {/* Padding, Margin, etc. */}
        <label>
          Pad (px):
          <input
            type="number"
            value={component.padding || 0}
            onChange={(e) => handleUpdate({ padding: parseInt(e.target.value) || 0 })}
            className="ml-1 w-14 border border-gray-300"
          />
        </label>
        <label>
          Marg (px):
          <input
            type="number"
            value={component.margin || 0}
            onChange={(e) => handleUpdate({ margin: parseInt(e.target.value) || 0 })}
            className="ml-1 w-14 border border-gray-300"
          />
        </label>
        <label>
          BR (px):
          <input
            type="number"
            value={component.borderRadius || 0}
            onChange={(e) => handleUpdate({ borderRadius: parseInt(e.target.value) || 0 })}
            className="ml-1 w-14 border border-gray-300"
          />
        </label>
        <label>
          BW (px):
          <input
            type="number"
            value={component.borderWidth || 1}
            onChange={(e) => handleUpdate({ borderWidth: parseInt(e.target.value) || 0 })}
            className="ml-1 w-14 border border-gray-300"
          />
        </label>
        <label>
          Bord:
          <ColorPickerButton
            value={component.borderColor || 'rgba(204,204,204,1)'}
            onChange={(col) => handleUpdate({ borderColor: col })}
            label="Cor"
          />
        </label>
      </div>

      <DroppableArea parentId={component.id} onDrop={onDrop}>
        {component.children?.map((child) => (
          <RenderComponent
            key={child.id}
            component={child}
            onDrop={onDrop}
            updateComponent={updateComponent}
            deleteComponent={deleteComponent}
          />
        ))}
      </DroppableArea>
    </div>
  );
};

export default FullDiv;
