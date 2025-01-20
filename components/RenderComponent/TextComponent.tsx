'use client';

import React, { useState, useEffect } from 'react';
import { IComponent } from '@/components/DragAndDrop/types';

import dynamic from 'next/dynamic';
import ColorPickerButton from './ColorPickerButton';

// IMPORTS do CKEditor
const CKEditor = dynamic(() => import('@ckeditor/ckeditor5-react').then(mod => mod.CKEditor), {
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

    const handleEditorChange = (data: string) => {
        setEditorContent(data);
        handleStyleUpdate({ content: data });
    };

    return (
        <div className="relative w-full mb-2 border border-gray-300 rounded p-2">
            {/* Botão x para excluir */}
            <button
                type="button"
                onClick={() => deleteComponent(component.id)}
                className="absolute top-0 right-0 m-1 text-white bg-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs"
                style={{ zIndex: 20 }}
            >
                x
            </button>

            {/* Configurações de estilo */}
            <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
                <label>Alinhamento de Texto:
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
                <label>Cor do Texto:
                    <ColorPickerButton
                        value={textColor}
                        onChange={(color) => {
                            setTextColor(color);
                            handleStyleUpdate({ textColor: color });
                        }}
                    />
                </label>
                <label>Tamanho da Fonte:
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
                <label>Tipo de Fonte:
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
            <div
                style={{
                    textAlign: textAlign,
                    color: textColor,
                    fontSize: fontSize,
                    fontFamily: fontFamily,
                }}
            >
                <CKEditor
                    editor={ClassicEditor}
                    data={editorContent}
                    onChange={(_event: any, editor: any) => {
                        const data = editor.getData();
                        handleEditorChange(data);
                    }}
                    config={{
                        toolbar: [
                            "undo",
                            "redo",
                            'heading',
                            '|',
                            'fontFamily',
                            'fontSize',
                            'fontColor',
                            'fontBackgroundColor',
                            '|',
                            'bold',
                            'italic',
                            "blockQuote",
                            "link",
                            "numberedList",
                            "bulletedList",
                            "insertTable",
                            "tableColumn",
                            "tableRow",
                            "mergeTableCells",
                        ],
                    }}
                />
            </div>
        </div>
    );
};

export default TextComponent;
