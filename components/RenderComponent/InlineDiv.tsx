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
  addComponent: (newComponent: IComponent, parentId: string | null) => void; // Incluímos addComponent com parentId
  parentId?: string | null;
}

const InlineDiv: React.FC<InlineDivProps> = ({
  component,
  onDrop,
  updateComponent,
  deleteComponent,
  addComponent,
  parentId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Inicia o redimensionamento horizontal
  const startResize = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
  };

  useEffect(() => {
    console.log('parentId:', parentId);
    console.log('component.id:', component.id);
  }, [])

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

  const handleMenuToggle = () => setMenuOpen((prev) => !prev);

  const handleDuplicate = () => {
    // Cria um novo componente baseado no atual, com novos IDs
    const duplicatedComponent: IComponent = {
      ...component,
      id: Math.random().toString(36).substring(2, 9), // Novo ID para o componente duplicado
      children: component.children?.map((child) => ({
        ...child,
        id: Math.random().toString(36).substring(2, 9), // Novo ID para cada filho
      })) || [],
    };

    // Passa o componente duplicado e o parentId correto
    addComponent(duplicatedComponent, parentId); // Use o parentId recebido pela prop
    setMenuOpen(false);
  };

  const handleUpdate = (props: Partial<IComponent>) => {
    updateComponent(component.id, { ...component, ...props });
  };

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

  return (
    <div ref={containerRef} style={style} className="relative">
      {/* Botão com Three Dots */}
      <div className="absolute top-0 right-0 m-1 z-20">
        <button
          className="text-gray-700 bg-white border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-100"
          onClick={handleMenuToggle}
        >
          ⋮
        </button>
      </div>

      {/* Menu de Opções */}
      {menuOpen && (
        <div className="absolute top-8 right-0 bg-white border border-gray-300 rounded shadow-lg z-30">
          <button
            onClick={handleDuplicate}
            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Duplicar
          </button>
          <button
            onClick={() => deleteComponent(component.id)}
            className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Excluir
          </button>
        </div>
      )}

      {/* Alça de redimensionar */}
      <div
        onMouseDown={startResize}
        className="absolute top-0 right-0 h-full w-2 cursor-col-resize"
        style={{ zIndex: 1 }}
      />

      {/* Barra de inputs */}
      <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
        <label>
          Horizontal:
          <select
            value={component.justifyContent || 'flex-start'}
            onChange={(e) => handleUpdate({ justifyContent: e.target.value })}
            className="ml-1 border border-gray-300 p-1"
          >
            <option value="normal">Normal</option>
            <option value="flex-start">Esquerda</option>
            <option value="center">Centro</option>
            <option value="flex-end">Direita</option>
          </select>
        </label>
        <label>
          Vertical:
          <select
            value={component.alignItems || 'flex-start'}
            onChange={(e) => handleUpdate({ alignItems: e.target.value })}
            className="ml-1 border border-gray-300 p-1"
          >
            <option value="normal">Normal</option>
            <option value="flex-start">Topo</option>
            <option value="center">Centro</option>
            <option value="flex-end">Baixo</option>
          </select>
        </label>
        <label>
          Larg (px):
          <input
            type="number"
            value={component.width || ''}
            onChange={(e) => handleUpdate({ width: parseInt(e.target.value, 10) || 0 })}
            className="ml-1 w-16 border border-gray-300"
          />
        </label>

        <label>
          Fundo:
          <ColorPickerButton
            value={component.backgroundColor || 'rgba(0,0,0,1)'}
            onChange={(newC) => handleUpdate({ backgroundColor: newC })}
            label="Cor"
          />
        </label>

        <label>
          Pad (px): <span>{component.padding || 0}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={component.padding || 0}
            onChange={(e) => handleUpdate({ padding: parseInt(e.target.value, 10) })}
            className="ml-1 w-14 border border-gray-300"
          />
        </label>

        <label>
          Marg (px): <span>{component.margin || 0}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={component.margin || 0}
            onChange={(e) => handleUpdate({ margin: parseInt(e.target.value, 10) })}
            className="ml-1 w-14 border border-gray-300"
          />
        </label>

        <label>
          BR (px): <span>{component.borderRadius || 0}</span>
          <input
            type="range"
            min="0"
            max="50"
            value={component.borderRadius || 0}
            onChange={(e) => handleUpdate({ borderRadius: parseInt(e.target.value, 10) })}
            className="ml-1 w-14 border border-gray-300"
          />
        </label>

        <label>
          BW (px): <span>{component.borderWidth || 1}</span>
          <input
            type="range"
            min="0"
            max="10"
            value={component.borderWidth || 1}
            onChange={(e) => handleUpdate({ borderWidth: parseInt(e.target.value, 10) })}
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

        <label>
            parentId: {parentId} - id: {component.id}
        </label>
      </div>

      <DroppableArea parentId={component.id} onDrop={onDrop}>
        {component.children?.map((child) => (
          <RenderComponent
            key={child.id}
            component={child}
            parentId={component.id} // Passa o ID do pai para os filhos
            onDrop={onDrop}
            updateComponent={updateComponent}
            deleteComponent={deleteComponent}
            addComponent={addComponent}
          />
        ))}
      </DroppableArea>
    </div>
  );
};

export default InlineDiv;
