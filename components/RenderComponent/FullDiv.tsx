'use client';
import React, { useState } from 'react';
import DroppableArea from '@/components/DroppableArea';
import RenderComponent from '@/components/RenderComponent/RenderComponent';
import ColorPickerButton from './ColorPickerButton';
import { IComponent } from '@/components/DragAndDrop/types';

interface FullDivProps {
  component: IComponent;
  onDrop: (...args: any) => void;
  updateComponent: (id: string, updated: IComponent) => void;
  deleteComponent: (id: string) => void;
  duplicateComponent: (newComponent: IComponent, parentId: string | null) => void; // Função para duplicar
}

const FullDiv: React.FC<FullDivProps> = ({
  component,
  onDrop,
  updateComponent,
  deleteComponent,
  duplicateComponent,
}) => {
  const [menuOpen, setMenuOpen] = useState(false); // Controle do menu

  const handleDuplicate = () => {
    const duplicatedComponent: IComponent = {
      ...component,
      id: Math.random().toString(36).substring(2, 9), // Novo ID
      children: component.children
        ? component.children.map((child) => ({
            ...child,
            id: Math.random().toString(36).substring(2, 9), // Novo ID para filhos
          }))
        : [],
    };

    duplicateComponent(duplicatedComponent, component.parentId || null); // Adiciona dentro do mesmo pai
    setMenuOpen(false); // Fecha o menu
  };

  const handleMenuToggle = () => setMenuOpen((prev) => !prev);

  const handleUpdate = (props: Partial<IComponent>) => {
    updateComponent(component.id, { ...component, ...props });
  };

  return (
    <div
      style={{
        backgroundColor: component.backgroundColor || 'transparent',
        margin: component.margin ?? 0,
        padding: component.padding ?? 0,
        borderRadius: component.borderRadius ?? 0,
        borderStyle: 'solid',
        borderWidth: component.borderWidth ?? 1,
        borderColor: component.borderColor ?? 'rgba(204,204,204,1)',
        flex: '0 0 100%', // Garante a largura total
        overflow: 'visible',
      }}
      className="relative"
    >
      {/* Botão com Three Dots */}
      <div className="absolute top-0 right-0 m-1 z-20">
        <button
          className="text-gray-700 bg-white border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-100"
          onClick={handleMenuToggle}
        >
          ⋮
        </button>
      </div>

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

      {/* Opções de Estilo */}
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
          Fundo:
          <ColorPickerButton
            value={component.backgroundColor || 'rgba(0,0,0,1)'}
            onChange={(c) => handleUpdate({ backgroundColor: c })}
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
            max="30"
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
      </div>

      {/* Área Dropável */}
      <DroppableArea parentId={component.id} onDrop={onDrop}>
        {component.children?.map((child) => (
          <RenderComponent
            key={child.id}
            component={child}
            parentId={component.id}
            onDrop={onDrop}
            updateComponent={updateComponent}
            deleteComponent={deleteComponent}
            addComponent={duplicateComponent} // Passa para filhos
          />
        ))}
      </DroppableArea>
    </div>
  );
};

export default FullDiv;
