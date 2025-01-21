'use client';

import React, { useState, useEffect, useRef } from 'react';
import { IComponent } from '@/components/DragAndDrop/types';

import dynamic from 'next/dynamic';
import ColorPickerButton from './ColorPickerButton';

// IMPORTS do CKEditor
const CKEditor = dynamic(() => import('@ckeditor/ckeditor5-react').then((mod) => mod.CKEditor), {
  ssr: false,
});
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface TextComponentProps {
  component: IComponent;
  updateComponent: (id: string, updated: IComponent) => void;
  deleteComponent: (id: string) => void;
}

const TextComponent: React.FC<TextComponentProps> = ({
  component,
  updateComponent,
  deleteComponent,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<'horizontal' | 'vertical' | null>(null);
  const [editorContent, setEditorContent] = useState(component.content || '');
  const [textAlign, setTextAlign] = useState(component.textAlign || 'left');
  const [textColor, setTextColor] = useState(component.textColor || '#000000');
  const [fontSize, setFontSize] = useState(component.fontSize || '1rem');
  const [fontFamily, setFontFamily] = useState(component.fontFamily || 'Arial, sans-serif');

  // Atualiza o estado do conteúdo quando o componente for atualizado externamente
  useEffect(() => {
    setEditorContent(component.content || '');
  }, [component.content]);

  // Atualiza o estilo do componente
  const handleStyleUpdate = (newStyles: Partial<IComponent>) => {
    updateComponent(component.id, { ...component, ...newStyles });
  };

  // Inicia o redimensionamento
  const startResize = (direction: 'horizontal' | 'vertical') => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setResizeDirection(direction);
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isResizing || !resizeDirection) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      if (resizeDirection === 'horizontal') {
        const newWidth = e.clientX - rect.left;
        if (newWidth > 50) {
          handleStyleUpdate({ width: newWidth });
        }
      } else if (resizeDirection === 'vertical') {
        const newHeight = e.clientY - rect.top;
        if (newHeight > 50) {
          handleStyleUpdate({ height: newHeight });
        }
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
  };

  const handleEditorChange = (data: string) => {
    setEditorContent(data);
    handleStyleUpdate({ content: data });
  };

  return (
    <div ref={containerRef} style={style} className="relative w-full mb-2 border border-gray-300 rounded p-2">
      {/* Botão x para excluir */}
      <button
        type="button"
        onClick={() => deleteComponent(component.id)}
        className="absolute top-0 right-0 m-1 text-white bg-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs"
        style={{ zIndex: 1 }}
      >
        x
      </button>

      {/* Alças de redimensionamento */}
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

      {/* Configurações de estilo */}
      <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
        <label>
          Alinhamento de Texto:
          <select
            value={textAlign}
            onChange={(e) => {
              setTextAlign(e.target.value);
              handleStyleUpdate({ textAlign: e.target.value });
            }}
            className="ml-2 border border-gray-300 rounded p-1"
          >
            <option value="left">Esquerda</option>
            <option value="center">Centro</option>
            <option value="right">Direita</option>
            <option value="justify">Justificar</option>
          </select>
        </label>
        <label>
          Cor do Texto:
          <ColorPickerButton
            value={textColor}
            onChange={(color) => {
              setTextColor(color);
              handleStyleUpdate({ textColor: color });
            }}
          />
        </label>
        <label>
          Tamanho da Fonte:
          <select
            value={fontSize}
            onChange={(e) => {
              setFontSize(e.target.value);
              handleStyleUpdate({ fontSize: e.target.value });
            }}
            className="ml-2 border border-gray-300 rounded p-1"
          >
            <option value="1rem">1rem</option>
            <option value="1.2rem">1.2rem</option>
            <option value="1.4rem">1.4rem</option>
            <option value="1.6rem">1.6rem</option>
            <option value="1.8rem">1.8rem</option>
            <option value="2rem">2rem</option>
          </select>
        </label>
        <label>
          Tipo de Fonte:
          <select
            value={fontFamily}
            onChange={(e) => {
              setFontFamily(e.target.value);
              handleStyleUpdate({ fontFamily: e.target.value });
            }}
            className="ml-2 border border-gray-300 rounded p-1"
          >
            <option value="Arial, sans-serif">Arial</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="Courier New, monospace">Courier New</option>
            <option value="Times New Roman, serif">Times New Roman</option>
            <option value="Verdana, sans-serif">Verdana</option>
          </select>
        </label>
      </div>

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
    </div>
  );
};

export default TextComponent;
