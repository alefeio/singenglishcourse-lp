// RenderComponent/InlineDiv.tsx

'use client';
import React, { useRef, useState, useEffect } from 'react';
import DroppableArea from '@/components/DroppableArea';
import RenderComponent from '@/components/RenderComponent/RenderComponent';
import ColorPickerButton from './ColorPickerButton';

import { IComponent } from '@/components/DragAndDrop/types';

interface InlineDivProps {
  component: IComponent;
  onDrop: (...args: any) => void;
  updateComponent: (id: string, updated: IComponent) => void;
  deleteComponent: (id: string) => void; 
}

const InlineDiv: React.FC<InlineDivProps> = ({
  component,
  onDrop,
  updateComponent,
  deleteComponent,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);

  // Arraste horizontal
  const startResize = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isResizing) return;

    const onMouseMove = (moveEvt: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = moveEvt.clientX - rect.left;
      if (newWidth > 50) {
        updateComponent(component.id, {
          ...component,
          width: newWidth,
        });
      }
    };

    const onMouseUp = () => setIsResizing(false);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isResizing, component, updateComponent]);

  const hasFixedWidth = component.width && component.width > 0;
  const style: React.CSSProperties = {
    backgroundColor: component.backgroundColor || 'transparent',
    margin: component.margin ?? 0,
    padding: component.padding ?? 0,
    borderRadius: component.borderRadius ?? 0,
    borderStyle: 'solid',
    borderWidth: component.borderWidth ?? 1,
    borderColor: component.borderColor ?? 'rgba(204,204,204,1)',
    overflow: 'visible',
  };

  if (hasFixedWidth) {
    style.width = component.width;
    style.flex = '0 0 auto';
  } else {
    style.flex = '1 1 0';
  }

  const handleUpdate = (props: Partial<IComponent>) => {
    updateComponent(component.id, { ...component, ...props });
  };

  return (
    <div ref={containerRef} style={style} className="relative">
      {/* Botão “x” no canto */}
      <button
        type="button"
        onClick={() => deleteComponent(component.id)}
        className="absolute top-0 right-0 m-1 text-white bg-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs"
        style={{ zIndex: 20 }}
      >
        x
      </button>

      {/* Alça de redimensionar */}
      <div
        onMouseDown={startResize}
        className="absolute top-0 right-0 h-full w-2 cursor-col-resize"
        style={{ zIndex: 10 }}
      />

      {/* Barra de inputs */}
      <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
        <label>
          Larg (px):
          <input
            type="number"
            value={component.width || ''}
            onChange={(e) => handleUpdate({ width: parseInt(e.target.value) || 0 })}
            className="ml-1 w-16 border border-gray-300"
          />
        </label>

        <label>Fundo:
          <ColorPickerButton
            value={component.backgroundColor || 'rgba(0,0,0,1)'}
            onChange={(newC) => handleUpdate({ backgroundColor: newC })}
          />
        </label>

        {/* etc. (Pad, Marg, BR, BW, etc.) */}
        {/* Exemplo: */}
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

export default InlineDiv;
