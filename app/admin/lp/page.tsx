'use client';

import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const COMPONENT_TYPES = {
    DIV: 'div',
    TEXT: 'text',
    IMAGE: 'image',
    TWO_DIVS: 'twoDivs',
    THREE_DIVS: 'threeDivs',
    FOUR_DIVS: 'fourDivs',
};

const DraggableComponent = ({ type, children, generateChildren }) => {
    const [, drag] = useDrag(() => ({
        type,
        item: { type, generateChildren },
    }));

    return (
        <div
            ref={drag}
            style={{
                padding: '10px',
                border: '1px solid #ccc',
                marginBottom: '10px',
                cursor: 'grab',
            }}
        >
            {children}
        </div>
    );
};

const DroppableArea = ({ parentId, onDrop, children, isMainArea }) => {
    const [, drop] = useDrop(() => ({
        accept: Object.values(COMPONENT_TYPES),
        drop: (item) => {
            console.log('Drop detected:', { type: item.type, parentId });
            const extraChildren = item.generateChildren ? item.generateChildren() : null;
            onDrop(item.type, parentId, extraChildren);
        },
    }));

    return (
        <div
            ref={drop}
            style={{
                minHeight: isMainArea ? '400px' : '100px',
                padding: '20px',
                border: isMainArea ? '2px dashed #ccc' : '1px solid #ccc',
                backgroundColor: isMainArea ? '#f4f4f4' : '#fff',
                marginBottom: '10px',
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
            }}
        >
            {children}
        </div>
    );
};

const RenderComponent = ({ component, onDrop, updateComponent }) => {
    const handleContentChange = (e) => {
        updateComponent(component.id, { ...component, content: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                updateComponent(component.id, { ...component, content: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    if (component.type === COMPONENT_TYPES.DIV) {
        return (
            <DroppableArea parentId={component.id} onDrop={onDrop}>
                {component.children.map((child) => (
                    <RenderComponent
                        key={child.id}
                        component={child}
                        onDrop={onDrop}
                        updateComponent={updateComponent}
                    />
                ))}
            </DroppableArea>
        );
    }

    if (
        component.type === COMPONENT_TYPES.TWO_DIVS ||
        component.type === COMPONENT_TYPES.THREE_DIVS ||
        component.type === COMPONENT_TYPES.FOUR_DIVS
    ) {
        const numberOfDivs =
            component.type === COMPONENT_TYPES.TWO_DIVS
                ? 2
                : component.type === COMPONENT_TYPES.THREE_DIVS
                ? 3
                : 4;

        return (
            <div
                style={{
                    display: 'flex',
                    gap: '10px',
                    border: '1px solid #ddd',
                    padding: '10px',
                    marginBottom: '10px',
                }}
            >
                {Array.from({ length: numberOfDivs }).map((_, index) => {
                    const subId = `${component.id}-div${index}`;
                    return (
                        <DroppableArea
                            key={index}
                            parentId={subId}
                            onDrop={onDrop}
                        >
                            {(component.children || [])
                                .filter((child) => child.parentSubId === subId)
                                .map((child) => (
                                    <RenderComponent
                                        key={child.id}
                                        component={child}
                                        onDrop={onDrop}
                                        updateComponent={updateComponent}
                                    />
                                ))}
                        </DroppableArea>
                    );
                })}
            </div>
        );
    }

    if (component.type === COMPONENT_TYPES.TEXT) {
        return (
            <textarea
                value={component.content || ''}
                onChange={handleContentChange}
                style={{ width: '100%', height: '80px', marginBottom: '10px', padding: '5px' }}
            />
        );
    }

    if (component.type === COMPONENT_TYPES.IMAGE) {
        return (
            <div style={{ marginBottom: '10px' }}>
                <input type="file" onChange={handleImageChange} />
                {component.content && (
                    <img
                        src={component.content}
                        alt="Uploaded"
                        style={{ maxWidth: '100%', marginTop: '10px', borderRadius: '4px' }}
                    />
                )}
            </div>
        );
    }

    return null;
};

const LandingPageBuilder = () => {
    const [components, setComponents] = useState([]);

    useEffect(() => {
        console.log('Components state updated:', components);
    }, [components]);

    const generateId = () => Math.random().toString(36).substr(2, 9);

    const generateDivGroup = (count, type) => {
        return {
            id: generateId(),
            type,
            content: '',
            children: Array.from({ length: count }, () => ({
                id: generateId(),
                type: COMPONENT_TYPES.DIV,
                content: '',
                children: [],
                parentSubId: null, // Initially no subId
            })),
        };
    };

    const handleDrop = (type, parentId = null, parentSubId = null) => {
        const newComponent = {
            id: generateId(),
            type,
            content: '',
            parentSubId,
            children: type === COMPONENT_TYPES.DIV ? [] : null,
        };

        setComponents((prevComponents) => {
            const updateRecursively = (components) =>
                components.map((component) => {
                    if (component.id === parentId) {
                        if (parentSubId) {
                            return {
                                ...component,
                                children: [
                                    ...(component.children || []),
                                    { ...newComponent, parentSubId },
                                ],
                            };
                        }
                        return {
                            ...component,
                            children: [...(component.children || []), newComponent],
                        };
                    }

                    if (component.children) {
                        return {
                            ...component,
                            children: updateRecursively(component.children),
                        };
                    }

                    return component;
                });

            if (!parentId) {
                return [...prevComponents, newComponent];
            }

            return updateRecursively(prevComponents);
        });
    };

    const updateComponent = (id, updatedComponent) => {
        const updateRecursively = (components) =>
            components.map((component) =>
                component.id === id
                    ? updatedComponent
                    : {
                        ...component,
                        children: component.children
                            ? updateRecursively(component.children)
                            : [],
                    }
            );

        setComponents((prevComponents) => updateRecursively(prevComponents));
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <h3>Componentes</h3>
                    <DraggableComponent type={COMPONENT_TYPES.DIV}>Div</DraggableComponent>
                    <DraggableComponent type={COMPONENT_TYPES.TEXT}>Texto</DraggableComponent>
                    <DraggableComponent type={COMPONENT_TYPES.IMAGE}>Imagem</DraggableComponent>
                    <DraggableComponent
                        type={COMPONENT_TYPES.TWO_DIVS}
                        generateChildren={() => generateDivGroup(2, COMPONENT_TYPES.TWO_DIVS)}
                    >
                        Duas Divs
                    </DraggableComponent>
                    <DraggableComponent
                        type={COMPONENT_TYPES.THREE_DIVS}
                        generateChildren={() => generateDivGroup(3, COMPONENT_TYPES.THREE_DIVS)}
                    >
                        Três Divs
                    </DraggableComponent>
                    <DraggableComponent
                        type={COMPONENT_TYPES.FOUR_DIVS}
                        generateChildren={() => generateDivGroup(4, COMPONENT_TYPES.FOUR_DIVS)}
                    >
                        Quatro Divs
                    </DraggableComponent>
                </div>
                <div style={{ flex: 3 }}>
                    <h3>Área de Construção</h3>
                    {components.map((component) => (
                        <RenderComponent
                            key={component.id}
                            component={component}
                            onDrop={handleDrop}
                            updateComponent={updateComponent}
                        />
                    ))}
                    <DroppableArea onDrop={handleDrop} isMainArea />
                </div>
            </div>
        </DndProvider>
    );
};

export default LandingPageBuilder;
