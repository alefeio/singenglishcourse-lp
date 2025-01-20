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

  useEffect(() => {
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
          maxWidth: '1280px',
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
