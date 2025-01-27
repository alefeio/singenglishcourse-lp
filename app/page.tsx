'use client';

import Carousel from '@/components/Carousel';
import { useEffect, useState } from 'react';

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
  children: IComponent[];
}

export default function LandingPage() {
  const [components, setComponents] = useState<IComponent[]>([]);
  const [pageWidth, setPageWidth] = useState('1280px'); // Estado para armazenar o valor de pageWidth

  useEffect(() => {
    const fetchConfigurations = async () => {
      try {
        const res = await fetch('/api/configurations', { method: 'GET' });
        if (!res.ok) throw new Error('Erro ao buscar configurações');

        const data = await res.json();
        setPageWidth(data.pageWidth || '1280px'); // Define o valor de pageWidth
      } catch (error) {
        console.error('Erro ao buscar configurações:', error);
      }
    };

    const fetchContent = async () => {
      try {
        const res = await fetch('/api/pages', { method: 'GET' });
        if (!res.ok) throw new Error('Erro ao buscar conteúdo da página');

        const pages = await res.json();
        const homePage = pages.find((page: { name: string }) => page.name === 'Home');

        console.log('homePage', homePage)

        if (homePage && homePage.content) {
          setComponents(homePage.content);
        } else {
          console.error('Página "Home" não encontrada ou sem conteúdo');
        }
      } catch (error) {
        console.error('Erro ao carregar a página:', error);
      }
    };

    fetchConfigurations();
    fetchContent();
  }, []);

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
        children,
      } = component;

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
        justifyContent: justifyContent || 'flex-start',
        alignItems: alignItems || 'flex-start',
        borderRadius: borderRadius ? `${borderRadius}px` : undefined,
        backgroundColor: backgroundColor || 'transparent',
        overflow: 'hidden',
        position: type === 'divFull' ? 'relative' : undefined,
        left: left ? `${left}px` : undefined,
        right: right ? `${right}px` : undefined,
        top: top ? `${top}px` : undefined,
        bottom: bottom ? `${bottom}px` : undefined,
      };

      // Estilos para texto
      const textStyles: React.CSSProperties = {
        fontFamily,
        fontSize,
        color: textColor,
        textAlign,
        width: width ? `${width}px` : 'auto',
        height: height ? `${height}px` : 'auto',
        overflow: 'hidden',
      };

      // Estilos para imagens
      const imageStyles: React.CSSProperties = {
        width: width ? `${width}px` : 'auto',
        height: height ? `${height}px` : 'auto',
        borderRadius: borderRadius ? `${borderRadius}px` : undefined,
        objectFit: 'cover',
      };

      // Renderização para divs (divFull e divInline)
      if (type === 'divFull') {
        return (
          <div key={id} style={containerStyles}>
            {renderComponents(children)}
          </div>
        );
      }

      if (type === 'divInline') {
        const hasDefinedWidth = width && width > 0;
      
        const containerStyles: React.CSSProperties = {
          display: 'flex',
          flexDirection: 'column', // Alinhamento interno em coluna
          justifyContent: justifyContent || 'flex-start',
          alignItems: alignItems || 'flex-start',
          width: hasDefinedWidth ? `${width}px` : undefined,
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
      
        return (
          <div key={id} style={containerStyles}>
            {renderComponents(children)}
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

      // Renderização para imagens
      if (type === 'image') {
        const imageContainerStyles: React.CSSProperties = {
          width: width ? `${width}px` : '100%',
          height: height ? `${height}px` : 'auto',
          borderRadius: borderRadius ? `${borderRadius}px` : undefined,
          overflow: 'hidden', // Certifica que a imagem respeita os limites do container
        };

        const imageStyles: React.CSSProperties = {
          width: '100%',
          height: '100%',
          objectFit: 'cover', // Faz com que a imagem preencha o container mantendo proporções
        };

        return (
          <div key={id} style={imageContainerStyles}>
            <img src={content} alt="Imagem" style={imageStyles} />
          </div>
        );
      }

      return null;
    });
  };

  return (
    <main className="flex flex-col">
      <Carousel />

      <div
        style={{
          maxWidth: pageWidth, // Usa o valor de pageWidth obtido da coleção configuracoes
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
