'use client';

import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { COMPONENT_TYPES, IComponent } from '@/components/DragAndDrop/types';
import DraggableComponent from '@/components/DraggableComponent';
import DroppableArea from '@/components/DroppableArea';
import RenderComponent from '@/components/RenderComponent/RenderComponent';
import { useRouter, useParams } from 'next/navigation';

const generateId = () => Math.random().toString(36).substring(2, 9);

const EditPage: React.FC = () => {
    const { id } = useParams();
    const router = useRouter();
    const [components, setComponents] = useState<IComponent[]>([]);
    const [pageName, setPageName] = useState('');
    const [pageUrl, setPageUrl] = useState('');
    const [message, setMessage] = useState('');
    const [isSticky, setIsSticky] = useState(false);

    // Sticky position for Component Bar
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsSticky(scrollTop > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Fetch page details
    useEffect(() => {
        if (id) {
            fetchPageDetails();
        }
    }, [id]);

    const fetchPageDetails = async () => {
        try {
            const res = await fetch(`/api/pages/${id}`);
            if (!res.ok) throw new Error('Erro ao carregar os dados da página');
            const data = await res.json();

            setPageName(data.name);
            setPageUrl(data.url);
            setComponents(data.content || []);
        } catch (error) {
            console.error('Erro ao carregar dados da página:', error);
            setMessage('Erro ao carregar dados da página.');
        }
    };

    const handlePageNameChange = (name: string) => {
        setPageName(name);
        const formattedUrl = name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
        setPageUrl(formattedUrl);
    };

    const handleUrlChange = (url: string) => {
        setPageUrl(url);
    };

    const handleDrop = (
        type: COMPONENT_TYPES,
        parentId: string | null = null,
        parentSubId: string | null = null,
        extraChildren: IComponent | null = null
    ) => {
        const newComponent: IComponent = {
            id: generateId(),
            type,
            content: '',
            parentSubId,
            children: extraChildren?.children || [],
        };

        if (type === COMPONENT_TYPES.IMAGE) {
            newComponent.width = 300;
            newComponent.height = 0;
        }

        if (!parentId) {
            setComponents((prev) => [...prev, newComponent]);
            return;
        }

        setComponents((prev) => {
            const updateRecursively = (list: IComponent[]): IComponent[] =>
                list.map((comp) => {
                    if (comp.id === parentId) {
                        return {
                            ...comp,
                            children: [...(comp.children || []), newComponent],
                        };
                    }
                    if (comp.children) {
                        return {
                            ...comp,
                            children: updateRecursively(comp.children),
                        };
                    }
                    return comp;
                });
            return updateRecursively(prev);
        });
    };

    const updateComponent = (id: string, updated: IComponent) => {
        const updateRecursively = (list: IComponent[]): IComponent[] =>
            list.map((comp) => {
                if (comp.id === id) return updated;
                if (comp.children) {
                    return {
                        ...comp,
                        children: updateRecursively(comp.children),
                    };
                }
                return comp;
            });
        setComponents((prev) => updateRecursively(prev));
    };

    const deleteComponent = (id: string) => {
        const removeRecursively = (list: IComponent[]): IComponent[] => {
            return list
                .filter((c) => c.id !== id)
                .map((c) => ({
                    ...c,
                    children: c.children ? removeRecursively(c.children) : [],
                }));
        };
        setComponents((prev) => removeRecursively(prev));
    };

    const handleSavePage = async () => {
        if (!pageName || !pageUrl || components.length === 0) {
            setMessage('Preencha todos os campos e adicione componentes antes de salvar.');
            return;
        }

        try {
            const res = await fetch(`/api/pages/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: pageName,
                    url: pageUrl,
                    components,
                }),
            });
            if (!res.ok) throw new Error('Erro ao salvar a página');
            setMessage('Página salva com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar a página:', error);
            setMessage('Erro ao salvar a página.');
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="max-w-7xl mx-auto p-4 bg-white rounded shadow relative">
                {/* Dados da Página */}
                <section className="p-4 border border-gray-300 rounded bg-white shadow mb-6">
                    <h3 className="text-xl font-bold mb-4 text-center">Editar Página</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex flex-col">
                            Nome da Página:
                            <input
                                type="text"
                                value={pageName}
                                onChange={(e) => handlePageNameChange(e.target.value)}
                                className="border border-gray-300 rounded p-2"
                                placeholder="Digite o nome da página"
                            />
                        </label>
                        <label className="flex flex-col">
                            URL:
                            <input
                                type="text"
                                value={pageUrl}
                                onChange={(e) => handleUrlChange(e.target.value)}
                                className="border border-gray-300 rounded p-2"
                                placeholder="URL da página"
                            />
                        </label>
                    </div>
                    <button
                        onClick={handleSavePage}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Salvar Alterações
                    </button>
                    {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
                </section>

                {/* Componentes */}
                <div
                    className={`bg-white shadow-md p-4 rounded ${
                        isSticky ? 'fixed top-0 left-0 w-full z-10' : 'relative'
                    }`}
                >
                    <div className="flex gap-4 justify-center">
                        <DraggableComponent type={COMPONENT_TYPES.DIV_INLINE}>
                            Div (Em Linha)
                        </DraggableComponent>
                        <DraggableComponent type={COMPONENT_TYPES.DIV_FULL}>
                            Div (Linha Única)
                        </DraggableComponent>
                        <DraggableComponent type={COMPONENT_TYPES.TEXT}>Texto</DraggableComponent>
                        <DraggableComponent type={COMPONENT_TYPES.IMAGE}>Imagem</DraggableComponent>
                    </div>
                </div>

                {/* Área de Construção */}
                <section className="flex-1 bg-white shadow-md p-6 rounded mt-6">
                    <h3 className="text-xl font-bold mb-4 text-center">Área de Construção</h3>
                    <DroppableArea onDrop={handleDrop} isMainArea>
                        {components.map((comp) => (
                            <RenderComponent
                                key={comp.id}
                                component={comp}
                                onDrop={handleDrop}
                                updateComponent={updateComponent}
                                deleteComponent={deleteComponent}
                            />
                        ))}
                    </DroppableArea>
                </section>
            </div>
        </DndProvider>
    );
};

export default EditPage;
