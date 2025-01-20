// FullDiv.tsx
'use client';
import React from 'react';
import DroppableArea from '@/components/DroppableArea';
import RenderComponent from '@/components/RenderComponent/RenderComponent';
import ColorPickerButton from './ColorPickerButton';
import { IComponent } from '@/components/DragAndDrop/types';

interface FullDivProps {
    component: IComponent;
    onDrop: (...args: any) => void;
    updateComponent: (id: string, updated: IComponent) => void;
    deleteComponent: (id: string) => void;
}

const FullDiv: React.FC<FullDivProps> = ({
    component,
    onDrop,
    updateComponent,
    deleteComponent,
}) => {
    const handleUpdate = (props: Partial<IComponent>) => {
        updateComponent(component.id, { ...component, ...props });
    };

    const containerStyle: React.CSSProperties = {
        backgroundColor: component.backgroundColor || 'transparent',
        margin: component.margin ?? 0,
        padding: component.padding ?? 0,
        borderRadius: component.borderRadius ?? 0,
        borderStyle: 'solid',
        borderWidth: component.borderWidth ?? 1,
        borderColor: component.borderColor ?? 'rgba(204,204,204,1)',
        flex: '0 0 100%',
        overflow: 'visible',
        display: 'flex', // Flex container for alignment
        justifyContent: component.justifyContent || 'flex-start',
        alignItems: component.alignItems || 'flex-start',
    };

    return (
        <div style={{
            backgroundColor: component.backgroundColor || 'transparent',
            margin: component.margin ?? 0,
            padding: component.padding ?? 0,
            borderRadius: component.borderRadius ?? 0,
            borderStyle: 'solid',
            borderWidth: component.borderWidth ?? 1,
            borderColor: component.borderColor ?? 'rgba(204,204,204,1)',
            flex: '0 0 100%', // para ocupar a linha toda
            overflow: 'visible',
        }} className="relative">
            {/* Botão x */}
            <button
                type="button"
                onClick={() => deleteComponent(component.id)}
                className="absolute top-0 right-0 m-1 text-white bg-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs"
                style={{ zIndex: 20 }}
            >
                x
            </button>

            <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
                <label>Horizontal:
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
                <label>Vertical:
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
                <label>Fundo:
                    <ColorPickerButton
                        value={component.backgroundColor || 'rgba(0,0,0,1)'}
                        onChange={(c) => handleUpdate({ backgroundColor: c })}
                        label="Cor"
                    />
                </label>
                <label>Pad (px): <span>{component.padding || 0}</span>
                    <input
                        type="range"
                        min="0" max="100"
                        value={component.padding || 0}
                        onChange={(e) => handleUpdate({ padding: parseInt(e.target.value, 10) })}
                        className="ml-1 w-14 border border-gray-300"
                    />
                </label>
                <label>Marg (px): <span>{component.margin || 0}</span>
                    <input
                        type="range"
                        min="0" max="100"
                        value={component.margin || 0}
                        onChange={(e) => handleUpdate({ margin: parseInt(e.target.value, 10) })}
                        className="ml-1 w-14 border border-gray-300"
                    />
                </label>
                <label>BR (px): <span>{component.borderRadius || 0}</span>
                    <input
                        type="range"
                        min="0" max="30"
                        value={component.borderRadius || 0}
                        onChange={(e) => handleUpdate({ borderRadius: parseInt(e.target.value, 10) })}
                        className="ml-1 w-14 border border-gray-300"
                    />
                </label>
                <label>BW (px): <span>{component.borderWidth || 1}</span>
                    <input
                        type="range"
                        min="0" max="10"
                        value={component.borderWidth || 1}
                        onChange={(e) => handleUpdate({ borderWidth: parseInt(e.target.value, 10) })}
                        className="ml-1 w-14 border border-gray-300"
                    />
                </label>
                <label>Bord:
                    <ColorPickerButton
                        value={component.borderColor || 'rgba(204,204,204,1)'}
                        onChange={(col) => handleUpdate({ borderColor: col })}
                        label="Cor"
                    />
                </label>
            </div>

            <DroppableArea parentId={component.id} onDrop={onDrop}>
                {component.children?.map((child) => (
                    <RenderComponent
                        key={child.id}
                        component={child}
                        onDrop={onDrop}
                        updateComponent={updateComponent}
                        deleteComponent={deleteComponent}
                    />
                ))}
            </DroppableArea>
        </div>
    );
};

export default FullDiv;
