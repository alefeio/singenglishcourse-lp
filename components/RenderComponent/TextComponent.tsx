// RenderComponent/TextComponent.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { IComponent } from '@/components/DragAndDrop/types';

import dynamic from 'next/dynamic';

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
    // Podemos manter um estado local, se quisermos, mas
    // aqui vamos gravar direto em "component.content".
    const [editorContent, setEditorContent] = useState(component.content || '');

    // Se o "component.content" vier de fora atualizado, sincronizar local:
    useEffect(() => {
        setEditorContent(component.content || '');
    }, [component.content]);

    const handleEditorChange = (data: string) => {
        setEditorContent(data);
        // Salva em "component.content"
        updateComponent(component.id, {
            ...component,
            content: data,
        });
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

            {/* CKEditor */}
            <CKEditor
                editor={ClassicEditor}
                data={editorContent}
                onChange={(_event: any, editor: any) => {
                    const data = editor.getData();
                    handleEditorChange(data);
                }}
                onReady={() => {
                    // Se quiser fazer algo quando o editor estiver pronto...
                }}
                config={{
                    toolbar: [
                        "undo",
                        "redo",
                        'heading',   // Botão para escolher Parágrafo, Heading 1, Heading 2, etc.
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
                    fontSize: {
                        options: [8, 10, 12, 'default', 14, 16, 18, 20, 24, 28],
                        supportAllValues: false, // se quiser aceitar valores livres
                    },
                    heading: {
                        options: [
                            { model: 'paragraph', title: 'Parágrafo', class: 'ck-heading_paragraph' },
                            { model: 'heading1', view: 'h1', title: 'Título 1', class: 'ck-heading_heading1' },
                            { model: 'heading2', view: 'h2', title: 'Título 2', class: 'ck-heading_heading2' },
                            { model: 'heading3', view: 'h3', title: 'Título 3', class: 'ck-heading_heading3' },
                            // ... se quiser mais
                        ],
                        supportAllValues: false
                    },
                    // E pode haver configs para fontFamily etc.
                }}
            />
        </div>
    );
};

export default TextComponent;
