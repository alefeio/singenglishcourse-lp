'use client';

import React, { useState } from 'react';
import { IComponent, COMPONENT_TYPES } from '@/components/DragAndDrop/types';
import ColorPickerButton from './ColorPickerButton';

interface FormComponentProps {
    component: IComponent;
    updateComponent: (id: string, updated: IComponent) => void;
    deleteComponent: (id: string) => void;
}

const FormComponent: React.FC<FormComponentProps> = ({ component, updateComponent, deleteComponent }) => {
    const [newFieldLabel, setNewFieldLabel] = useState('');
    const [newFieldType, setNewFieldType] = useState('text');
    const [newFieldPlaceholder, setNewFieldPlaceholder] = useState('');
    const [newFieldRequired, setNewFieldRequired] = useState(false);
    const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Converte o label para o atributo `name`
    const generateFieldName = (label: string) => {
        return label.toLowerCase().replace(/\s+/g, '-');
    };

    // Adiciona um novo input ao formulário
    const addField = () => {
        if (!newFieldLabel.trim()) return;

        const newField: IComponent = {
            id: Math.random().toString(36).substring(2, 9),
            type: COMPONENT_TYPES.TEXT,
            content: newFieldLabel,
            fieldType: newFieldType,
            name: generateFieldName(newFieldLabel),
            placeholder: newFieldPlaceholder, // Adicionando Placeholder
            required: newFieldRequired, // Adicionando Required
        };

        updateComponent(component.id, {
            ...component,
            children: [...(component.children || []), newField],
        });

        setNewFieldLabel('');
        setNewFieldPlaceholder('');
        setNewFieldRequired(false);
    };

    return (
        <div
            style={{
                backgroundColor: component.backgroundColor || 'transparent',
                padding: component.padding || '10px',
                borderRadius: component.borderRadius || '5px',
                border: component.borderWidth ? `${component.borderWidth}px solid ${component.borderColor || '#ccc'}` : 'none',
                width: component.width ? `${component.width}px` : '100%',
            }}
            className="p-4 border border-gray-300 rounded bg-white shadow relative"
        >
            {/* Botão de Opções */}
            <div className="absolute top-0 right-0 m-1 z-20">
                <button
                    className="text-gray-700 bg-white border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    ⋮
                </button>

                {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded shadow-md z-30">
                        <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                                setIsCustomizeModalOpen(true);
                                setIsMenuOpen(false);
                            }}
                        >
                            Personalizar
                        </button>
                        <button
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                            onClick={() => deleteComponent(component.id)}
                        >
                            Excluir
                        </button>
                    </div>
                )}
            </div>

            <h3 className="text-lg font-bold mb-2">{component.content || 'Formulário'}</h3>

            <form>
                {component.children?.map((field) => (
                    <label key={field.id} className="block mb-2">
                        {field.content}:
                        {field.fieldType === 'textarea' ? (
                            <textarea
                                name={field.name ?? ''}
                                placeholder={field.placeholder ?? ''}
                                required={!!field.required}
                                className="border border-gray-300 p-1 w-full rounded"
                            />
                        ) : (
                            <input
                                type={field.fieldType ?? 'text'}
                                name={field.name ?? ''}
                                placeholder={field.placeholder ?? ''}
                                required={!!field.required}
                                className="border border-gray-300 p-1 w-full rounded"
                            />
                        )}
                    </label>
                ))}

                <button
                    type="button"
                    style={{
                        backgroundColor: component.buttonColor || '#007BFF',
                        color: component.buttonTextColor || '#FFF',
                        padding: '10px',
                        borderRadius: '5px',
                    }}
                    className="w-full mt-2"
                >
                    {component.buttonText || 'Enviar'}
                </button>
            </form>

            {/* Área para adicionar novos campos */}
            <div className="mt-4 p-2 border-t border-gray-300">
                <h4 className="font-semibold text-sm mb-2">Adicionar Campo</h4>
                <input
                    type="text"
                    placeholder="Nome do Campo"
                    value={newFieldLabel}
                    onChange={(e) => setNewFieldLabel(e.target.value)}
                    className="border border-gray-300 p-1 w-full rounded mb-2"
                />
                <input
                    type="text"
                    placeholder="Placeholder (Opcional)"
                    value={newFieldPlaceholder}
                    onChange={(e) => setNewFieldPlaceholder(e.target.value)}
                    className="border border-gray-300 p-1 w-full rounded mb-2"
                />
                <label className="flex items-center gap-2 mb-2">
                    <input
                        type="checkbox"
                        checked={newFieldRequired}
                        onChange={(e) => setNewFieldRequired(e.target.checked)}
                    />
                    Campo obrigatório
                </label>
                <select
                    value={newFieldType}
                    onChange={(e) => setNewFieldType(e.target.value)}
                    className="border border-gray-300 p-1 w-full rounded mb-2"
                >
                    <option value="text">Texto</option>
                    <option value="number">Número</option>
                    <option value="email">E-mail</option>
                    <option value="radio">Opção Única</option>
                    <option value="checkbox">Múltipla Escolha</option>
                    <option value="textarea">Área de Texto</option>
                </select>
                <button
                    type="button"
                    onClick={addField}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                >
                    Adicionar Campo
                </button>
            </div>

            {/* Modal de Personalização */}
            {isCustomizeModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded shadow-lg w-full max-w-lg">
                        <h3 className="text-lg font-semibold mb-4">Personalizar Formulário</h3>

                        <label className="block mb-2">
                            Nome do Formulário:
                            <input
                                type="text"
                                value={component.content || ''}
                                onChange={(e) => updateComponent(component.id, { ...component, content: e.target.value })}
                                className="border border-gray-300 p-1 w-full rounded"
                            />
                        </label>

                        <label className="block mb-2">
                            Largura do Formulário (px):
                            <input
                                type="number"
                                value={component.width || 400}
                                onChange={(e) => updateComponent(component.id, { ...component, width: parseInt(e.target.value, 10) })}
                                className="border border-gray-300 p-1 w-full rounded"
                            />
                        </label>

                        <label className="block mb-2">
                            Cor de Fundo:
                            <ColorPickerButton
                                value={component.backgroundColor || '#ffffff'}
                                onChange={(color) => updateComponent(component.id, { ...component, backgroundColor: color })}
                            />
                        </label>

                        <label className="block mb-2">
                            Padding:
                            <input
                                type="number"
                                value={component.padding || 10}
                                onChange={(e) => updateComponent(component.id, { ...component, padding: parseInt(e.target.value, 10) })}
                                className="border border-gray-300 p-1 w-full rounded"
                            />
                        </label>

                        <label className="block mb-2">
                            Tamanho da Borda (px):
                            <input
                                type="number"
                                value={component.borderWidth || 1}
                                onChange={(e) => updateComponent(component.id, { ...component, borderWidth: parseInt(e.target.value, 10) })}
                                className="border border-gray-300 p-1 w-full rounded"
                            />
                        </label>

                        <label className="block mb-2">
                            Cor da Borda:
                            <ColorPickerButton
                                value={component.borderColor || '#ccc'}
                                onChange={(color) => updateComponent(component.id, { ...component, borderColor: color })}
                            />
                        </label>

                        <label className="block mb-2">
                            Border Radius:
                            <input
                                type="number"
                                value={component.borderRadius || 5}
                                onChange={(e) =>
                                    updateComponent(component.id, { ...component, borderRadius: parseInt(e.target.value, 10) })
                                }
                                className="border border-gray-300 p-1 w-full rounded"
                            />
                        </label>

                        <label className="block mb-2">
                            Texto do Botão:
                            <input
                                type="text"
                                value={component.buttonText || 'Enviar'}
                                onChange={(e) => updateComponent(component.id, { ...component, buttonText: e.target.value })}
                                className="border border-gray-300 p-1 w-full rounded"
                            />
                        </label>

                        <label className="block mb-2">
                            Cor do Botão:
                            <ColorPickerButton
                                value={component.buttonColor || '#007BFF'}
                                onChange={(color) => updateComponent(component.id, { ...component, buttonColor: color })}
                            />
                        </label>

                        <label className="block mb-2">
                            Cor do Texto do Botão:
                            <ColorPickerButton
                                value={component.buttonTextColor || '#ffffff'}
                                onChange={(color) => updateComponent(component.id, { ...component, buttonTextColor: color })}
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
        </div>
    );
};

export default FormComponent;
