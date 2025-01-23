'use client';

import React, { useState, useEffect, useRef } from 'react';
import { IComponent } from '@/components/DragAndDrop/types';
import dynamic from 'next/dynamic';
import ColorPickerButton from './ColorPickerButton';

const CKEditor = dynamic(() => import('@ckeditor/ckeditor5-react').then((mod) => mod.CKEditor), {
  ssr: false,
});
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface TextComponentProps {
  component: IComponent;
  updateComponent: (id: string, updated: IComponent) => void;
  deleteComponent: (id: string) => void;
  duplicateComponent: (newComponent: IComponent, parentId: string | null) => void;
}

const TextComponent: React.FC<TextComponentProps> = ({
  component,
  updateComponent,
  deleteComponent,
  duplicateComponent,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [editorContent, setEditorContent] = useState(component.content || '');
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<'horizontal' | 'vertical' | null>(null);
  const [textAlign, setTextAlign] = useState(component.textAlign || 'left');
  const [textColor, setTextColor] = useState(component.textColor || '#000000');
  const [fontSize, setFontSize] = useState(component.fontSize || '1rem');
  const [fontFamily, setFontFamily] = useState(component.fontFamily || 'Arial, sans-serif');

  useEffect(() => {
    setEditorContent(component.content || '');
  }, [component.content]);

  const handleStyleUpdate = (newStyles: Partial<IComponent>) => {
    updateComponent(component.id, { ...component, ...newStyles });
  };

  const handleDuplicate = () => {
    const duplicatedComponent: IComponent = {
      ...component,
      id: Math.random().toString(36).substring(2, 9),
    };
    duplicateComponent(duplicatedComponent, component.parentId || null);
    setMenuOpen(false);
  };

  const startResize = (direction: 'horizontal' | 'vertical') => (e: React.MouseEvent) => {
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
          Math.max(50, e.clientX - rect.left), // Minimum width
          parentRect.width // Maximum width (100% of parent)
        );
        handleStyleUpdate({ width: newWidth });
      } else if (resizeDirection === 'vertical') {
        const newHeight = Math.max(50, e.clientY - rect.top); // Minimum height
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
  }, [isResizing, resizeDirection]);

  const style: React.CSSProperties = {
    textAlign,
    color: textColor,
    fontSize,
    fontFamily,
    backgroundColor: component.backgroundColor || 'transparent',
    margin: component.margin ?? 0,
    padding: component.padding ?? 0,
    borderRadius: component.borderRadius ?? 0,
    borderStyle: 'solid',
    borderWidth: component.borderWidth ?? 1,
    borderColor: component.borderColor || 'rgba(204,204,204,1)',
    width: component.width || '100%',
    height: component.height || 'auto',
    overflow: 'visible',
    maxWidth: '100%', // Enforce the 100% max width of parent
  };

  const handleEditorChange = (data: string) => {
    setEditorContent(data);
    handleStyleUpdate({ content: data });
  };

  return (
    <div
      ref={containerRef}
      style={style}
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
            onClick={handleDuplicate}
            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Duplicar
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
            <h3 className="text-lg font-semibold mb-4">Personalizar Estilo</h3>

            <label className="block mb-2">
              Largura (px):
              <input
                type="number"
                value={component.width || ''}
                onChange={(e) => handleStyleUpdate({ width: parseInt(e.target.value, 10) })}
                className="w-full border border-gray-300 rounded p-1"
              />
            </label>

            <label className="block mb-2">
              Altura (px):
              <input
                type="number"
                value={component.height || ''}
                onChange={(e) => handleStyleUpdate({ height: parseInt(e.target.value, 10) })}
                className="w-full border border-gray-300 rounded p-1"
              />
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

      {/* CKEditor */}
      <div>
        <CKEditor
          editor={ClassicEditor}
          data={editorContent}
          onChange={(_event: any, editor: any) => {
            const data = editor.getData();
            handleEditorChange(data);
          }}
          config={{
            toolbar: [
              'undo',
              'redo',
              'heading',
              '|',
              'fontFamily',
              'fontSize',
              'fontColor',
              'fontBackgroundColor',
              '|',
              'bold',
              'italic',
              'blockQuote',
              'link',
              'numberedList',
              'bulletedList',
              'insertTable',
              'tableColumn',
              'tableRow',
              'mergeTableCells',
            ],
          }}
        />
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
    </div>
  );
};

export default TextComponent;
