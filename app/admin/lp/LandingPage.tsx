'use client';

import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { COMPONENT_TYPES, IComponent } from '@/components/DragAndDrop/types';
import DroppableArea from '@/components/DroppableArea';
import RenderComponent from '@/components/RenderComponent/RenderComponent';
import Componentes from '@/components/Componentes';

const generateId = () => Math.random().toString(36).substring(2, 9);

const LandingPageBuilder: React.FC = () => {
    const [components, setComponents] = useState<IComponent[]>([]);
    const [pageName, setPageName] = useState('');
    const [pageUrl, setPageUrl] = useState('');
    const [message, setMessage] = useState('');
    const [isSticky, setIsSticky] = useState(false);
    const [pageWidth, setPageWidth] = useState('1280px');

    // Busca configurações da coleção
    useEffect(() => {
        const fetchConfigurations = async () => {
            try {
                const res = await fetch('/api/configurations', { method: 'GET' });
                if (!res.ok) throw new Error('Erro ao carregar configurações');
                const data = await res.json();
                setPageWidth(data.pageWidth || '1280px');
            } catch (error) {
                console.error('Erro ao carregar configurações:', error);
            }
        };

        fetchConfigurations();
    }, []);

    // Prevenir erro ao acessar `window`
    useEffect(() => {
        // if (typeof window === 'undefined') return;

        console.log('setIsSticky', setIsSticky)

        const handleScroll = () => {
            setIsSticky(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Função para criar URL a partir do nome da página
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

    // Função para adicionar componentes à página
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

    // Atualiza um componente existente
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

    // Remove um componente da página
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

    // Salva a página no banco de dados
    const handleSavePage = async () => {
        if (!pageName || !pageUrl || components.length === 0) {
            setMessage('Preencha todos os campos e adicione componentes antes de salvar.');
            return;
        }

        const formData = new FormData();
        formData.append('name', pageName);
        formData.append('url', pageUrl);
        formData.append('components', JSON.stringify(components));

        try {
            const res = await fetch('/api/pages', {
                method: 'POST',
                body: formData,
            });
            if (!res.ok) {
                throw new Error('Erro ao salvar a página');
            }
            const data = await res.json();
            console.log('Página salva:', data);

            setMessage('Página salva com sucesso!');
            setTimeout(() => {
                setMessage('');
            }, 3000);
            setPageName('');
            setPageUrl('');
            setComponents([]);
        } catch (error) {
            console.error(error);
            setMessage('Erro ao salvar a página.');
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="p-4 bg-white rounded shadow mx-auto" style={{ maxWidth: pageWidth }}>
                {/* Seção de informações da página */}
                <section className="p-4 border border-gray-300 rounded bg-white shadow mb-6">
                    <h3 className="text-xl font-bold mb-4 text-center">Dados da Página</h3>
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
                        Salvar Página
                    </button>
                    {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
                </section>

                {/* Componentes disponíveis */}
                <Componentes isSticky={isSticky} handleSavePage={handleSavePage} message={message} />

                {/* Área de construção */}
                <section className="flex-1 bg-white shadow-md p-6 rounded mt-6">
                    <h3 className="text-xl font-bold mb-4 text-center">Área de Construção</h3>
                    <DroppableArea onDrop={handleDrop} isMainArea>
                        {components.map((comp) => (
                            <RenderComponent
                                key={comp.id}
                                component={comp}
                                parentId={null}
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

export default LandingPageBuilder;
