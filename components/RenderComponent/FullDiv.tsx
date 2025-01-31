'use client'

import React, { useState } from 'react';
import DroppableArea from '@/components/DroppableArea';
import RenderComponent from '@/components/RenderComponent/RenderComponent';
import ColorPickerButton from './ColorPickerButton';
import { COMPONENT_TYPES, IComponent } from '@/components/DragAndDrop/types';

interface FullDivProps {
    component: IComponent;
    onDrop: (
        type: COMPONENT_TYPES,
        parentId?: string | null,
        parentSubId?: string | null,
        extraChildren?: IComponent | null
    ) => void;
    updateComponent: (id: string, updated: IComponent) => void;
    deleteComponent: (id: string) => void;
}

const FullDiv: React.FC<FullDivProps> = ({
    component,
    onDrop,
    updateComponent,
    deleteComponent,
}) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
    const [paddingValues, setPaddingValues] = useState({
        top: component.paddingTop || 0,
        bottom: component.paddingBottom || 0,
        left: component.paddingLeft || 0,
        right: component.paddingRight || 0,
    });

    const handleMenuToggle = () => setMenuOpen((prev) => !prev);

    const handleUpdate = (props: Partial<IComponent>) => {
        updateComponent(component.id, { ...component, ...props });
    };

    const handlePaddingChange = (side: string, value: number) => {
        const updatedPadding = { ...paddingValues };

        if (side === 'all') {
            updatedPadding.top = value;
            updatedPadding.bottom = value;
            updatedPadding.left = value;
            updatedPadding.right = value;
        } else if (side === 'vertical') {
            updatedPadding.top = value;
            updatedPadding.bottom = value;
        } else if (side === 'horizontal') {
            updatedPadding.left = value;
            updatedPadding.right = value;
        } else {
            updatedPadding[side as keyof typeof paddingValues] = value;
        }

        setPaddingValues(updatedPadding);
        handleUpdate(updatedPadding);
    };

    return (
        <div
            style={{
                backgroundColor: component.backgroundColor || 'transparent',
                paddingTop: paddingValues.top,
                paddingBottom: paddingValues.bottom,
                paddingLeft: paddingValues.left,
                paddingRight: paddingValues.right,
                borderRadius: component.borderRadius ?? 0,
                borderStyle: 'solid',
                borderWidth: component.borderWidth ?? 1,
                borderColor: component.borderColor || 'rgba(204,204,204,1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: component.justifyContent || 'flex-start',
                alignItems: component.alignItems || 'stretch', // 🔴 Alterado para "stretch"
                flex: '0 0 100%',
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

                        <label className="block mb-2">
                            Fundo:
                            <ColorPickerButton
                                value={component.backgroundColor || 'rgba(0,0,0,1)'}
                                onChange={(c) => handleUpdate({ backgroundColor: c })}
                                label="Cor"
                            />
                        </label>

                        <label className="block mb-2">
                            Alinhamento Horizontal:
                            <select
                                value={component.alignItems || 'flex-start'}
                                onChange={(e) => handleUpdate({ alignItems: e.target.value })}
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
                                value={component.justifyContent || 'flex-start'}
                                onChange={(e) => handleUpdate({ justifyContent: e.target.value })}
                                className="ml-1 border border-gray-300 p-1 w-full"
                            >
                                <option value="flex-start">Topo</option>
                                <option value="center">Centro</option>
                                <option value="flex-end">Baixo</option>
                            </select>
                        </label>

                        <label className="block mb-2">
                            BR (px): <span>{component.borderRadius || 0}</span>
                            <input
                                type="range"
                                min="0"
                                max="30"
                                value={component.borderRadius || 0}
                                onChange={(e) =>
                                    handleUpdate({ borderRadius: parseInt(e.target.value, 10) })
                                }
                                className="w-full border border-gray-300"
                            />
                        </label>

                        <label className="block mb-2">
                            BW (px): <span>{component.borderWidth || 1}</span>
                            <input
                                type="range"
                                min="0"
                                max="10"
                                value={component.borderWidth || 1}
                                onChange={(e) =>
                                    handleUpdate({ borderWidth: parseInt(e.target.value, 10) })
                                }
                                className="w-full border border-gray-300"
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

                        <div className="mb-4">
                            <h4 className="font-semibold">Padding</h4>
                            {['all', 'vertical', 'horizontal', 'top', 'bottom', 'left', 'right'].map((side) => (
                                <div key={side} className="flex items-center gap-2">
                                    <label>{`${side.charAt(0).toUpperCase() + side.slice(1)}:`}</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={
                                            side === 'all'
                                                ? Math.max(
                                                    paddingValues.top,
                                                    paddingValues.bottom,
                                                    paddingValues.left,
                                                    paddingValues.right
                                                )
                                                : side === 'vertical'
                                                    ? Math.max(paddingValues.top, paddingValues.bottom)
                                                    : side === 'horizontal'
                                                        ? Math.max(paddingValues.left, paddingValues.right)
                                                        : paddingValues[side as keyof typeof paddingValues]
                                        }
                                        onChange={(e) =>
                                            handlePaddingChange(side, parseInt(e.target.value, 10))
                                        }
                                        className="w-full border border-gray-300"
                                    />
                                    <span>
                                        {
                                            side === 'all'
                                                ? Math.max(
                                                    paddingValues.top,
                                                    paddingValues.bottom,
                                                    paddingValues.left,
                                                    paddingValues.right
                                                )
                                                : side === 'vertical'
                                                    ? Math.max(paddingValues.top, paddingValues.bottom)
                                                    : side === 'horizontal'
                                                        ? Math.max(paddingValues.left, paddingValues.right)
                                                        : paddingValues[side as keyof typeof paddingValues]
                                        }
                                        px
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* <div className="mb-4">
              <h4 className="font-semibold">Margin</h4>
              {['all', 'vertical', 'horizontal', 'top', 'bottom', 'left', 'right'].map((side) => (
                <div key={side} className="flex items-center gap-2">
                  <label>{`${side.charAt(0).toUpperCase() + side.slice(1)}:`}</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={
                      side === 'all'
                        ? Math.max(
                            marginValues.top,
                            marginValues.bottom,
                            marginValues.left,
                            marginValues.right
                          )
                        : side === 'vertical'
                        ? Math.max(marginValues.top, marginValues.bottom)
                        : side === 'horizontal'
                        ? Math.max(marginValues.left, marginValues.right)
                        : marginValues[side as keyof typeof marginValues]
                    }
                    onChange={(e) =>
                      handleMarginChange(side, parseInt(e.target.value, 10))
                    }
                    className="w-full border border-gray-300"
                  />
                  <span>
                    {
                      side === 'all'
                        ? Math.max(
                            marginValues.top,
                            marginValues.bottom,
                            marginValues.left,
                            marginValues.right
                          )
                        : side === 'vertical'
                        ? Math.max(marginValues.top, marginValues.bottom)
                        : side === 'horizontal'
                        ? Math.max(marginValues.left, marginValues.right)
                        : marginValues[side as keyof typeof marginValues]
                    }
                    px
                  </span>
                </div>
              ))}
            </div> */}

                        <button
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={() => setIsCustomizeModalOpen(false)}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}

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
                    />
                ))}
            </DroppableArea>
        </div>
    );
};

export default FullDiv;