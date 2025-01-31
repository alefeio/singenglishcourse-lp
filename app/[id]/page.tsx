'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

interface IComponent {
    id: string;
    type: string;
    content: string;
    fontFamily?: string;
    fontSize?: string;
    textColor?: string;
    textAlign?: string;
    justifyContent?: string;
    alignItems?: string;
    margin?: number;
    padding?: number;
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
    width?: number;
    height?: number;
    borderRadius?: number;
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
    backgroundColor?: string;
    align: string;
    children?: IComponent[];
    fieldType?: string;
    name?: string;
    buttonText?: string;
    borderWidth?: string;
    borderColor?: string;
    buttonColor?: string;
    buttonTextColor?: string;
    placeholder?: string;
    required?: boolean;
}

export default function DynamicPage() {
    const pathname = usePathname(); // Obtém a URL acessada
    const [components, setComponents] = useState<IComponent[]>([]);
    const [pageWidth, setPageWidth] = useState('1280px'); // Estado para armazenar a largura da página
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth <= 768);

            // Adiciona um listener para mudanças de tamanho da tela
            const handleResize = () => {
                setIsMobile(window.innerWidth <= 768);
            };

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    useEffect(() => {
        const fetchConfigurations = async () => {
            try {
                const res = await fetch('/api/configurations');
                if (!res.ok) throw new Error('Erro ao buscar configurações');

                const data = await res.json();
                setPageWidth(data.pageWidth || '1280px');
            } catch (error) {
                console.error('Erro ao buscar configurações:', error);
            }
        };

        const fetchContent = async () => {
            try {
                const res = await fetch('/api/pages');
                if (!res.ok) throw new Error('Erro ao buscar conteúdo das páginas');

                const pages = await res.json();

                // Obtém a última parte da URL para comparar com o campo 'url'
                const cleanPathname = pathname.replace(/^\/|\/$/g, ''); // Remove barras extras

                // Filtra a página correta pelo campo `url`
                const currentPage = pages.find((page: { url: string }) => page.url === cleanPathname);

                if (currentPage && currentPage.content) {
                    console.log('Conteúdo da página encontrada:', currentPage.content);
                    setComponents(currentPage.content);
                } else {
                    console.error('Página não encontrada ou sem conteúdo.');
                    setError('Página não encontrada.');
                }
            } catch (error) {
                console.error('Erro ao carregar a página:', error);
                setError('Erro ao carregar a página.');
            } finally {
                setLoading(false);
            }
        };

        fetchConfigurations();
        fetchContent();
    }, [pathname]);

    // Captura os valores do formulário ao digitar
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Função para enviar os dados via POST para /api / contact
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, formTitle: string) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    formTitle,
                    formData
                }),
            });

            if (!response.ok) throw new Error('Erro ao enviar formulário');

            setMessage('Formulário enviado com sucesso!');
            setFormData({}); // Limpa os campos após o envio
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            setMessage('Ocorreu um erro ao enviar. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderComponents = (components: IComponent[]) => {

        return components.map((component) => {
            const {
                id,
                type,
                content,
                fontFamily,
                fontSize,
                textColor,
                textAlign,
                justifyContent,
                alignItems,
                margin,
                padding,
                paddingTop,
                paddingBottom,
                paddingLeft,
                paddingRight,
                width,
                height,
                borderRadius,
                left,
                right,
                top,
                bottom,
                backgroundColor,
                align,
                children,
                fieldType,
                name,
                placeholder,
                required,
                borderWidth,
                borderColor
            } = component;

            // 🔹 Renderiza Formulário
            if (type === 'form' && children) {
                const containerStyles: React.CSSProperties = {
                    width: width ? `${width}px` : '600px',
                    padding: component.padding || '10px',
                    borderRadius: component.borderRadius || '5px',
                    backgroundColor: backgroundColor || 'rgba(241, 236, 236, 1)',
                    border: component.borderWidth ? `${component.borderWidth}px solid ${component.borderColor || '#ccc'}` : 'none',
                };

                if (isMobile) {
                    containerStyles.width = '100%';
                }

                return (
                    <div id="matricula" key={component.id}>
                        <form
                            style={containerStyles}
                            onSubmit={(e) => handleSubmit(e, content || 'Formulário')} // Chamando handleSubmit no submit do form
                        >
                            <h2 className="text-xl font-bold mb-4 text-center">{content || 'Formulário'}</h2>

                            {/* Renderiza os campos do formulário */}
                            {children.map((field) => renderComponents([field]))}

                            <button
                                type="submit"
                                className="w-full py-3 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                disabled={isSubmitting}
                                style={{
                                    backgroundColor: component.buttonColor || '#007BFF',
                                    color: component.buttonTextColor || '#FFF',
                                    padding: '10px',
                                    borderRadius: '5px',
                                }}
                            >
                                {isSubmitting ? 'Enviando...' : component.buttonText || 'Enviar'}
                            </button>

                            {message && <p className="mt-2 text-center text-gray-600">{message}</p>}
                        </form>
                    </div>
                );
            }

            // 🔹 Renderiza os campos do formulário (inputs e textarea)
            if (type === 'text' && fieldType) {
                return (
                    <div key={id} className="mb-4">
                        <label htmlFor={name} className="block text-gray-700 font-medium mb-1">
                            {content}
                        </label>
                        {fieldType === 'textarea' ? (
                            <textarea
                                id={name}
                                name={name}
                                rows={4}
                                placeholder={placeholder}
                                required={required}
                                value={formData[name || ''] || ''}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        ) : (
                            <input
                                id={name}
                                name={name}
                                type={fieldType}
                                placeholder={placeholder}
                                required={required}
                                value={formData[name || ''] || ''}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        )}
                    </div>
                );
            }

            // Estilos do contêiner (divFull ou divInline)
            const containerStyles: React.CSSProperties = {
                margin: margin ? `${margin}px` : undefined,
                padding: padding ? `${padding}px` : undefined,
                paddingTop: paddingTop || top ? `${paddingTop || top}px` : undefined,
                paddingBottom: paddingBottom || bottom ? `${paddingBottom || bottom}px` : undefined,
                paddingLeft: paddingLeft || left ? `${paddingLeft || left}px` : undefined,
                paddingRight: paddingRight || right ? `${paddingRight || right}px` : undefined,
                width: width ? `${width}px` : '100%',
                height: height ? `${height}px` : 'auto',
                display: type === 'divInline' || type === 'divFull' ? 'flex' : undefined,
                flexDirection: type === 'divInline' ? 'row' : undefined,
                justifyContent: alignItems || 'flex-start',
                alignItems: justifyContent || 'flex-start',
                borderRadius: borderRadius ? `${borderRadius}px` : undefined,
                backgroundColor: backgroundColor || 'transparent',
                overflow: 'hidden',
                position: type === 'divFull' ? 'relative' : undefined,
                left: left ? `${left}px` : undefined,
                right: right ? `${right}px` : undefined,
                top: top ? `${top}px` : undefined,
                bottom: bottom ? `${bottom}px` : undefined,
            };

            if (isMobile) {
                containerStyles.flexDirection = 'column';
                containerStyles.width = '100%';
            }

            const textStyles: React.CSSProperties = {
                fontFamily: fontFamily || 'inherit',
                fontSize: fontSize || '1rem',
                color: textColor || 'inherit',
                textAlign: textAlign as React.CSSProperties['textAlign'] || 'left',
                width: width ? `${width}px` : 'auto',
                height: height ? `${height}px` : 'auto',
                overflow: 'hidden',
            };

            // Renderização para divs (divFull)
            if (type === 'divFull') {
                return (
                    <div key={id} style={containerStyles}>
                        {children && renderComponents(children)}
                    </div>
                );
            }

            if (type === 'divInline') {
                const hasDefinedWidth = width && width > 0;

                const containerStyles: React.CSSProperties = {
                    display: 'flex',
                    flexDirection: 'column', // Alinhamento interno em coluna
                    justifyContent: alignItems || 'flex-start',
                    alignItems: justifyContent || 'flex-start',
                    width: hasDefinedWidth ? `${width}px` : '100%',
                    flex: hasDefinedWidth ? '0 0 auto' : '1', // Ocupa o restante do espaço quando largura não está definida
                    height: height ? `${height}px` : 'auto',
                    backgroundColor: backgroundColor || 'transparent',
                    margin: margin ? `${margin}px` : undefined,
                    padding: padding ? `${padding}px` : undefined,
                    paddingTop: paddingTop || top ? `${paddingTop || top}px` : undefined,
                    paddingBottom: paddingBottom || bottom ? `${paddingBottom || bottom}px` : undefined,
                    paddingLeft: paddingLeft || left ? `${paddingLeft || left}px` : undefined,
                    paddingRight: paddingRight || right ? `${paddingRight || right}px` : undefined,
                    borderRadius: borderRadius ? `${borderRadius}px` : undefined,
                    position: 'relative',
                };

                if (isMobile) {
                    containerStyles.flexDirection = 'column';
                    containerStyles.width = '100%';
                }

                return (
                    <div key={id} style={containerStyles}>
                        {children && renderComponents(children)}
                    </div>
                );
            }

            // Renderização para textos
            if (type === 'text') {
                return (
                    <div
                        key={id}
                        className="text-content"
                        style={textStyles}
                        dangerouslySetInnerHTML={{ __html: content }}
                    ></div>
                );
            }

            if (type === 'image') {
                const imageContainerStyles: React.CSSProperties = {
                    width: width ? `${width}px` : '100%',
                    height: height ? `${height}px` : 'auto',
                    borderRadius: borderRadius ? `${borderRadius}px` : undefined,
                    overflow: 'hidden',
                };

                const imageStyles: React.CSSProperties = {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                };

                return (
                    <div key={id} style={imageContainerStyles}>
                        <Image src={content} alt="Imagem" style={imageStyles} />
                    </div>
                );
            }

            // Renderização para button
            if (type === 'button') {
                const buttonStyles: React.CSSProperties = {
                    fontSize: fontSize || '16px',
                    color: textColor || '#FFF',
                    backgroundColor: backgroundColor || '#007BFF',
                    borderRadius: borderRadius || '5px',
                    padding: padding ? `${padding}px` : '10px',
                    border: borderWidth ? `${borderWidth}px solid ${borderColor || 'transparent'}` : 'none',
                    cursor: 'pointer',
                    width: width ? `${width}px` : 'auto',
                    height: height ? `${height}px` : 'auto',
                };

                return (
                    <div key={id} style={{ display: 'flex', justifyContent: align }}>
                        <button style={buttonStyles}>{content || 'Clique aqui'}</button>
                    </div>
                );
            }

            return null;
        });
    };

    if (loading || error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className={`text-lg ${error ? 'text-red-600' : 'text-gray-600'}`}>
                    {error || 'Carregando...'}
                </p>
            </div>
        );
    }

    return (
        <main className="flex flex-col">
            <div
                style={{
                    maxWidth: pageWidth,
                    margin: '0 auto',
                    width: '100%',
                    position: 'relative',
                }}
            >
                <section className="p-4">{renderComponents(components)}</section>
            </div>
        </main>
    );
}
