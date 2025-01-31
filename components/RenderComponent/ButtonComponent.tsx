'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { IComponent } from '@/components/DragAndDrop/types';
import ColorPickerButton from './ColorPickerButton';

interface ButtonComponentProps {
  component: IComponent; // ✅ Agora o componente é passado como um objeto
  updateComponent: (id: string, updatedComponent: IComponent) => void;
  deleteComponent: (id: string) => void;
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({
  component,
  updateComponent,
  deleteComponent,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<'horizontal' | 'vertical' | null>(null);

  const startResize = (direction: 'horizontal' | 'vertical') => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setResizeDirection(direction);
    setIsResizing(true);
  };

  const handleStyleUpdate = useCallback(
    (newStyles: Partial<IComponent>) => {
      updateComponent(component.id, {
        ...component,
        ...newStyles, // ✅ Aplica apenas as propriedades passadas sem sobrescrever outras
      });
    },
    [updateComponent, component]
  );

  useEffect(() => {
    if (!isResizing || !resizeDirection) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !containerRef.current.parentElement) return;

      const parentRect = containerRef.current.parentElement.getBoundingClientRect();
      const rect = containerRef.current.getBoundingClientRect();

      if (resizeDirection === 'horizontal') {
        const newWidth = Math.min(
          Math.max(50, e.clientX - rect.left), // Minimum width
          parentRect.width // Maximum width (100% of parent)
        );
        handleStyleUpdate({ width: newWidth });
      } else if (resizeDirection === 'vertical') {
        const newHeight = Math.max(30, e.clientY - rect.top); // Minimum height
        handleStyleUpdate({ height: newHeight });
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
  }, [isResizing, resizeDirection, handleStyleUpdate]);

  const style: React.CSSProperties = {
    backgroundColor: component.backgroundColor || '#007BFF',
    color: component.textColor || '#FFF',
    fontSize: component.fontSize || '16px',
    padding: component.padding || '10px',
    borderRadius: component.borderRadius || '5px',
    width: component.width ? `${component.width}px` : 'auto',
    height: component.height ? `${component.height}px` : 'auto',
    border: component.borderWidth ? `${component.borderWidth}px solid ${component.borderColor || '#000'}` : 'none',
    cursor: 'pointer',
    textAlign: 'center',
    display: 'inline-block',
    marginLeft: component.align === 'center' ? 'auto' : component.align === 'right' ? 'auto' : undefined,
    marginRight: component.align === 'center' ? 'auto' : undefined,
  };

  return (
    <div
      ref={containerRef}
      style={{ width: component.width || 'auto', height: component.height || 'auto' }}
      className="relative w-full mb-2 border border-gray-300 rounded p-2"
    >
      {/* Botão com Three Dots */}
      <div className="absolute top-0 right-0 m-1 z-20">
        <button
          className="text-gray-700 bg-white border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-100"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          ⋮
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-8 right-0 bg-white border border-gray-300 rounded shadow-lg z-30">
          <button
            onClick={() => {
              setMenuOpen(false);
              setIsCustomizeModalOpen(true);
            }}
            className="block w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
          >
            Personalizar
          </button>
          <button
            onClick={() => deleteComponent(component.id)}
            className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Excluir
          </button>
        </div>
      )}

      {/* Modal de Personalização */}
      {isCustomizeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Personalizar Botão</h3>

            <label className="block mb-2">
              Texto do Botão:
              <input
                type="text"
                value={component.content}
                onChange={(e) => updateComponent(component.id, { ...component, content: e.target.value })}
                className="w-full border border-gray-300 rounded p-1"
              />
            </label>

            <label className="block mb-2">
              Cor de Fundo:
              <ColorPickerButton
                value={component.backgroundColor || '#007BFF'}
                onChange={(color) => handleStyleUpdate({ backgroundColor: color })}
              />
            </label>

            <label className="block mb-2">
              Cor do Texto:
              <ColorPickerButton
                value={component.textColor || '#FFF'}
                onChange={(color) => handleStyleUpdate({ textColor: color })}
              />
            </label>

            <label className="block mb-2">
              Tamanho da Fonte:
              <input
                type="number"
                value={component.fontSize?.replace('px', '') || 16}
                onChange={(e) => handleStyleUpdate({ fontSize: `${e.target.value}px` })}
                className="w-full border border-gray-300 rounded p-1"
              />
            </label>

            <label className="block mb-2">
              Padding:
              <input
                type="number"
                value={component.padding || 10}
                onChange={(e) => handleStyleUpdate({ padding: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded p-1"
              />
            </label>

            <label className="block mb-2">
              Border Radius:
              <input
                type="number"
                value={component.borderRadius || 5}
                onChange={(e) => handleStyleUpdate({ borderRadius: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded p-1"
              />
            </label>

            <label className="block mb-2">
              Alinhamento Horizontal:
              <select
                value={component.align || 'left'}
                onChange={(e) => handleStyleUpdate({ align: e.target.value })}
                className="w-full border border-gray-300 rounded p-1"
              >
                <option value="left">Esquerda</option>
                <option value="center">Centralizado</option>
                <option value="right">Direita</option>
              </select>
            </label>

            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setIsCustomizeModalOpen(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      <button style={style} onClick={() => alert('Botão clicado!')}>
        {component.content || 'Clique aqui'}
      </button>

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
    </div>
  );
};

export default ButtonComponent;
