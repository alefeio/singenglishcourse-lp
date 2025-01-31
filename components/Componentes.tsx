'use client';

import React from 'react';
import { COMPONENT_TYPES } from '@/components/DragAndDrop/types';
import DraggableComponent from '@/components/DraggableComponent';

interface ComponentesProps {
    isSticky: boolean;
    handleSavePage: () => void;
    message: string;
}

const Componentes: React.FC<ComponentesProps> = ({ isSticky, handleSavePage, message }) => {
    return (
        <div className={`bg-white shadow-md p-4 rounded ${isSticky ? 'fixed top-0 left-0 w-full z-10' : 'relative'}`}>
            <div className="flex gap-4 justify-center">
                <DraggableComponent type={COMPONENT_TYPES.DIV_INLINE}>
                    Div (Em Linha)
                </DraggableComponent>
                <DraggableComponent type={COMPONENT_TYPES.DIV_FULL}>
                    Div (Linha Única)
                </DraggableComponent>
                <DraggableComponent type={COMPONENT_TYPES.TEXT}>Texto</DraggableComponent>
                <DraggableComponent type={COMPONENT_TYPES.IMAGE}>Imagem</DraggableComponent>
                <DraggableComponent type={COMPONENT_TYPES.BUTTON}>Botão</DraggableComponent>
                <DraggableComponent type={COMPONENT_TYPES.FORM}>Formulário</DraggableComponent>
                {isSticky && (
                    <button
                        onClick={handleSavePage}
                        className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
                    >
                        Salvar
                    </button>
                )}
            </div>
            {isSticky && message && <p className="text-center mt-2 text-sm text-gray-600">{message}</p>}
        </div>
    );
};

export default Componentes;
