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
  width?: number;
  height?: number;
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
        width,
        height,
        children,
      } = component;

      const containerStyles = {
        margin: margin ? `${margin}px` : undefined,
        padding: padding ? `${padding}px` : undefined,
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
      };

      const contentStyles = {
        fontFamily,
        fontSize,
        color: textColor,
        textAlign,
        display: justifyContent || alignItems ? 'flex' : undefined,
        justifyContent: justifyContent || undefined,
        alignItems: alignItems || undefined,
        width: '100%',
        height: '100%',
      };

      if (type === 'divFull' || type === 'divInline') {
        return (
          <div
            key={id}
            style={{
              display: type === 'divInline' ? 'inline-block' : 'block',
              ...containerStyles,
            }}
          >
            <div style={contentStyles}>{renderComponents(children)}</div>
          </div>
        );
      }

      if (type === 'text') {
        return (
          <div
            key={id}
            className="text-content"
            style={{
              fontFamily,
              fontSize,
              color: textColor,
              textAlign,
            }}
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
        );
      }

      if (type === 'image') {
        return (
          <img
            key={id}
            src={content}
            alt="Imagem"
            style={{
              width: width ? `${width}px` : 'auto',
              height: height ? `${height}px` : 'auto',
            }}
          />
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
