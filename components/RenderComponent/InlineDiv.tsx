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
  addComponent: (newComponent: IComponent, parentId: string | null) => void;
  parentId: string | null;
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
  const [resizeDirection, setResizeDirection] = useState<'horizontal' | 'vertical' | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [paddingValues, setPaddingValues] = useState({
    all: 0,
    vertical: 0,
    horizontal: 0,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  const startResize = (direction: 'horizontal' | 'vertical') => (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setResizeDirection(direction);
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isResizing || !resizeDirection) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !containerRef.current.parentElement) return;

      const parentRect = containerRef.current.parentElement.getBoundingClientRect();
      const rect = containerRef.current.getBoundingClientRect();

      if (resizeDirection === 'horizontal') {
        const newWidth = Math.min(
          Math.max(50, e.clientX - rect.left), // Valor mínimo de 50px
          parentRect.width // Limite máximo: largura do elemento pai
        );
        updateComponent(component.id, { width: newWidth });
      } else if (resizeDirection === 'vertical') {
        const newHeight = Math.min(
          Math.max(50, e.clientY - rect.top), // Valor mínimo de 50px
          parentRect.height // Limite máximo: altura do elemento pai (opcional)
        );
        updateComponent(component.id, { height: newHeight });
      }
    };

    const onMouseUp = () => {
      setIsResizing(false);
      setResizeDirection(null);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isResizing, resizeDirection, component, updateComponent]);

  const handleMenuToggle = () => setMenuOpen((prev) => !prev);

  const handleDuplicate = () => {
    const duplicatedComponent: IComponent = {
      ...component,
      id: Math.random().toString(36).substring(2, 9),
      children: component.children?.map((child) => ({
        ...child,
        id: Math.random().toString(36).substring(2, 9),
      })) || [],
    };
    addComponent(duplicatedComponent, parentId);
    setMenuOpen(false);
  };

  const handleUpdate = (props: Partial<IComponent>) => {
    updateComponent(component.id, { ...component, ...props });
  };

  const handlePaddingChange = (side: keyof typeof paddingValues, value: number) => {
    const updatedPadding = { ...paddingValues };

    if (side === 'all') {
      Object.keys(updatedPadding).forEach((key) => {
        updatedPadding[key as keyof typeof paddingValues] = value;
      });
    } else if (side === 'vertical') {
      updatedPadding.top = value;
      updatedPadding.bottom = value;
    } else if (side === 'horizontal') {
      updatedPadding.left = value;
      updatedPadding.right = value;
    } else {
      updatedPadding[side] = value;
    }

    setPaddingValues(updatedPadding);
    handleUpdate(updatedPadding);
  };

  const style: React.CSSProperties = {
    backgroundColor: component.backgroundColor || 'transparent',
    width: component.width || 'auto',
    flex: component.width ? '0 0 auto' : '1 1 0', // Garantir comportamento flexível
    height: component.height || 'auto',
    paddingTop: paddingValues.top,
    paddingBottom: paddingValues.bottom,
    paddingLeft: paddingValues.left,
    paddingRight: paddingValues.right,
    margin: component.margin || 0,
    borderRadius: component.borderRadius || 0,
    borderStyle: 'solid',
    borderWidth: component.borderWidth || 1,
    borderColor: component.borderColor || 'rgba(204,204,204,1)',
    alignItems: component.alignItems || 'flex-start',
    justifyContent: component.justifyContent || 'flex-start',
  };

  return (
    <div ref={containerRef} style={style} className="relative">
      {/* Botão de menu (Three Dots) */}
      <div className="absolute top-0 right-0 m-1 z-20">
        <button
          className="text-gray-700 bg-white border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-100"
          onClick={handleMenuToggle}
        >
          ⋮
        </button>
      </div>

      {/* Alças para redimensionar */}
      <div
        onMouseDown={startResize('horizontal')}
        className="absolute top-0 right-0 h-full w-2 cursor-col-resize"
        style={{ zIndex: 1 }}
      />
      <div
        onMouseDown={startResize('vertical')}
        className="absolute bottom-0 left-0 w-full h-2 cursor-row-resize"
        style={{ zIndex: 1 }}
      />

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
          <button
            onClick={() => {
              setMenuOpen(false);
              setIsCustomizeModalOpen(true);
            }}
            className="block w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
          >
            Personalizar
          </button>
        </div>
      )}

      {/* Modal de Personalização */}
      {isCustomizeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Personalizar Estilo</h3>

            <div className="flex gap-2">
              <label className="block mb-2">
                Largura (px):
                <input
                  type="number"
                  value={component.width || ''}
                  onChange={(e) => handleUpdate({ width: parseInt(e.target.value, 10) })}
                  className="w-full border border-gray-300 rounded p-1"
                />
              </label>

              <label className="block mb-2">
                Altura (px):
                <input
                  type="number"
                  value={component.height || ''}
                  onChange={(e) => handleUpdate({ height: parseInt(e.target.value, 10) })}
                  className="w-full border border-gray-300 rounded p-1"
                />
              </label>
            </div>

            <div className="flex gap-2">
              <label className="block mb-2">
                Alinhamento Horizontal:
                <select
                  value={component.justifyContent || 'flex-start'}
                  onChange={(e) => handleUpdate({ justifyContent: e.target.value })}
                  className="ml-1 border border-gray-300 p-1 w-full"
                >
                  <option value="flex-start">Esquerda</option>
                  <option value="center">Centro</option>
                  <option value="flex-end">Direita</option>
                </select>
              </label>

              <label className="block mb-2">
                Alinhamento Vertical:
                <select
                  value={component.alignItems || 'flex-start'}
                  onChange={(e) => handleUpdate({ alignItems: e.target.value })}
                  className="ml-1 border border-gray-300 p-1 w-full"
                >
                  <option value="flex-start">Topo</option>
                  <option value="center">Centro</option>
                  <option value="flex-end">Baixo</option>
                </select>
              </label>
            </div>

            <div className="flex gap-2">
              <label className="block mb-2">
                BR (px):
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={component.borderRadius || 0}
                  onChange={(e) => handleUpdate({ borderRadius: parseInt(e.target.value, 10) })}
                  className="w-full border border-gray-300"
                />
              </label>

              <label className="block mb-2">
                BW (px):
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={component.borderWidth || 1}
                  onChange={(e) => handleUpdate({ borderWidth: parseInt(e.target.value, 10) })}
                  className="w-full border border-gray-300"
                />
              </label>
            </div>

            <div className="flex gap-2">
              <label className="block mb-2">
                Fundo:
                <ColorPickerButton
                  value={component.backgroundColor || 'rgba(0,0,0,1)'}
                  onChange={(newC) => handleUpdate({ backgroundColor: newC })}
                  label="Cor"
                />
              </label>

              <label className="block mb-2">
                Bord:
                <ColorPickerButton
                  value={component.borderColor || 'rgba(204,204,204,1)'}
                  onChange={(col) => handleUpdate({ borderColor: col })}
                  label="Cor"
                />
              </label>
            </div>

            {/* Padding Options */}
            <div className="mb-4">
              <h4 className="font-semibold">Padding</h4>
              {['all', 'vertical', 'horizontal', 'top', 'bottom', 'left', 'right'].map((side) => (
                <div key={side} className="flex items-center gap-2">
                  <label>{`${side.charAt(0).toUpperCase() + side.slice(1)}:`}</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={paddingValues[side as keyof typeof paddingValues]}
                    onChange={(e) =>
                      handlePaddingChange(side as keyof typeof paddingValues, parseInt(e.target.value, 10))
                    }
                    className="w-full border border-gray-300"
                  />
                  <span>{paddingValues[side as keyof typeof paddingValues]}px</span>
                </div>
              ))}
            </div>

            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setIsCustomizeModalOpen(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      <DroppableArea parentId={component.id} onDrop={onDrop}>
        {component.children?.map((child) => (
          <RenderComponent
            key={child.id}
            component={child}
            parentId={component.id}
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