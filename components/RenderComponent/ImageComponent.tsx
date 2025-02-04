'use client'

import React, { useRef, useState, useEffect } from 'react';
import { IComponent } from '@/components/DragAndDrop/types';
import Image from 'next/image';

interface ImageComponentProps {
    component: IComponent;
    updateComponent: (id: string, updated: IComponent) => void;
    deleteComponent: (id: string) => void;
}

const ImageComponent: React.FC<ImageComponentProps> = ({
    component,
    updateComponent,
    deleteComponent,
}) => {
    const imgRef = useRef<HTMLDivElement>(null);
    const [isResizing, setIsResizing] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                updateComponent(component.id, {
                    ...component,
                    content: reader.result as string,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const startResizeImage = (ev: React.MouseEvent<HTMLDivElement>) => {
        ev.preventDefault();
        ev.stopPropagation();
        setIsResizing(true);
    };

    const handleBorderRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newBorderRadius = parseInt(e.target.value, 10) || 0;
        updateComponent(component.id, {
            ...component,
            borderRadius: newBorderRadius,
        });
    };

    useEffect(() => {
        if (!isResizing) return;

        const onMouseMove = (moveEvt: MouseEvent) => {
            if (!imgRef.current) return;
            const rect = imgRef.current.getBoundingClientRect();
            const newWidth = moveEvt.clientX - rect.left;
            const newHeight = moveEvt.clientY - rect.top;
            if (newWidth > 50 && newHeight > 50) {
                updateComponent(component.id, {
                    ...component,
                    width: newWidth,
                    height: newHeight,
                });
            }
        };

        const onMouseUp = () => setIsResizing(false);

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    }, [isResizing, component, updateComponent]);

    return (
        <div ref={imgRef} className="relative mb-2 inline-block border border-gray-300 p-2">
            {/* Botão x */}
            <button
                type="button"
                onClick={() => deleteComponent(component.id)}
                className="absolute top-0 right-0 m-1 text-white bg-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs"
                style={{ zIndex: 1 }}
            >
                x
            </button>

            <input type="file" onChange={handleImageChange} />
            {component.content && (
                <>
                    <br />
                    <div className="mt-2 inline-block relative">
                        <Image
                            src={component.content}
                            width={100}
                            height={100}
                            alt="Uploaded"
                            style={{
                                width: '100%',
                                height: component.height || 'auto',
                                maxWidth: '100%',
                                borderRadius: component.borderRadius || 0, // Apply border-radius
                            }}
                        />
                        {/* Alça de redimensionar a imagem */}
                        <div
                            onMouseDown={startResizeImage}
                            className="absolute bottom-0 right-0 w-4 h-4 bg-gray-300 cursor-nwse-resize"
                            style={{ borderRadius: '50%' }}
                        />
                    </div>
                </>
            )}
            {component.content && (
                <div className="mt-2 text-sm">
                    <label className="mr-2">
                        W (px):
                        <input
                            type="number"
                            value={component.width || 300}
                            onChange={(e) =>
                                updateComponent(component.id, {
                                    ...component,
                                    width: parseInt(e.target.value) || 300,
                                })
                            }
                            className="ml-1 w-16 border border-gray-300"
                        />
                    </label>
                    <label className="mr-2">
                        H (px):
                        <input
                            type="number"
                            value={component.height || 0}
                            onChange={(e) =>
                                updateComponent(component.id, {
                                    ...component,
                                    height: parseInt(e.target.value) || 0,
                                })
                            }
                            className="ml-1 w-16 border border-gray-300"
                        />
                    </label>
                    <label>
                        BR (px):
                        <input
                            type="number"
                            value={component.borderRadius || 0}
                            onChange={handleBorderRadiusChange}
                            className="ml-1 w-16 border border-gray-300"
                        />
                    </label>
                </div>
            )}
        </div>
    );
};

export default ImageComponent;
