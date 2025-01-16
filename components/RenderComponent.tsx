'use client';
import React from 'react';
import DroppableArea from './DroppableArea';
import { COMPONENT_TYPES, IComponent } from './DragAndDrop/types';

interface RenderComponentProps {
  component: IComponent;
  onDrop: (
    type: COMPONENT_TYPES,
    parentId?: string | null,
    parentSubId?: string | null,
    extraChildren?: IComponent | null
  ) => void;
  updateComponent: (id: string, updatedComponent: IComponent) => void;
}

const RenderComponent: React.FC<RenderComponentProps> = ({
  component,
  onDrop,
  updateComponent,
}) => {
  // Função p/ atualizar imagem
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

  // --------------------------- DIV_INLINE ---------------------------
  if (component.type === COMPONENT_TYPES.DIV_INLINE) {
    // Ref para a div (usada para obter boundingClientRect, etc.)
    const containerRef = React.useRef<HTMLDivElement>(null);
    // Estado local para saber se estamos arrastando a borda
    const [isResizing, setIsResizing] = React.useState(false);

    // Inicia o resize
    const startResize = (ev: React.MouseEvent<HTMLDivElement>) => {
      ev.preventDefault();
      ev.stopPropagation();
      setIsResizing(true);
    };

    // Efeito que escuta mousemove e mouseup no document
    React.useEffect(() => {
      if (!isResizing) return;

      const onMouseMove = (moveEvt: MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();

        // Distância da borda esquerda da div até o mouse
        const newWidth = moveEvt.clientX - rect.left;

        // Limite mínimo (poderia ser 50px, 100px, etc.)
        if (newWidth > 50) {
          updateComponent(component.id, {
            ...component,
            width: newWidth, // define a div como width fixa
          });
        }
      };

      const onMouseUp = () => {
        setIsResizing(false);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);

      return () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
    }, [isResizing, component, updateComponent]);

    // Se tiver 'component.width' > 0, fica fixa
    // Senão, flex: 1 1 0 => ocupa espaço restante
    const hasFixedWidth = component.width && component.width > 0;
    const style: React.CSSProperties = hasFixedWidth
      ? {
          width: component.width,
          flex: '0 0 auto',
        }
      : {
          flex: '1 1 0',
        };

    return (
      <div
        ref={containerRef}
        style={style}
        className="relative border border-gray-300 bg-white p-3 overflow-auto"
      >
        {/* 'handle' de resize na borda direita */}
        <div
          onMouseDown={startResize}
          className="absolute top-0 right-0 h-full w-2 cursor-col-resize"
          style={{ zIndex: 10 }}
        />

        {/* Se quiser também permitir input de largura manual */}
        <div className="mb-2">
          <label>
            Largura (px):
            <input
              type="number"
              value={component.width || ''}
              onChange={(e) =>
                updateComponent(component.id, {
                  ...component,
                  width: parseInt(e.target.value) || 0,
                })
              }
              className="ml-2 w-20 border border-gray-300"
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
            />
          ))}
        </DroppableArea>
      </div>
    );
  }

  // --------------------------- DIV_FULL ---------------------------
  if (component.type === COMPONENT_TYPES.DIV_FULL) {
    return (
      <div className="border border-gray-300 bg-white p-3 basis-full w-full">
        <DroppableArea parentId={component.id} onDrop={onDrop}>
          {component.children?.map((child) => (
            <RenderComponent
              key={child.id}
              component={child}
              onDrop={onDrop}
              updateComponent={updateComponent}
            />
          ))}
        </DroppableArea>
      </div>
    );
  }

  // --------------------------- TEXT ---------------------------
  if (component.type === COMPONENT_TYPES.TEXT) {
    return (
      <div className="w-full mb-2">
        <textarea
          className="w-full h-[150px] p-2 border border-gray-300 rounded bg-white"
          placeholder="Escreva seu texto aqui..."
          value={component.content}
          onChange={(e) =>
            updateComponent(component.id, { ...component, content: e.target.value })
          }
        />
      </div>
    );
  }

  // --------------------------- IMAGE ---------------------------
  if (component.type === COMPONENT_TYPES.IMAGE) {
    return (
      <div className="mb-2">
        <input type="file" onChange={handleImageChange} />
        {component.content && (
          <div className="mt-2">
            <img
              src={component.content}
              alt="Uploaded"
              style={{
                width: component.width || 300,
                height: component.height || 'auto',
                maxWidth: '100%',
              }}
              className="rounded"
            />
            {/* Inputs para redimensionar a imagem */}
            <div className="mt-2">
              <label className="mr-2">
                Largura (px):
                <input
                  type="number"
                  value={component.width || 300}
                  onChange={(e) => {
                    const newImgWidth = parseInt(e.target.value) || 300;
                    updateComponent(component.id, {
                      ...component,
                      width: newImgWidth,
                    });
                  }}
                  className="ml-1 w-20 border border-gray-300"
                />
              </label>
              <label>
                Altura (px):
                <input
                  type="number"
                  value={component.height || 0}
                  onChange={(e) =>
                    updateComponent(component.id, {
                      ...component,
                      height: parseInt(e.target.value) || 0,
                    })
                  }
                  className="ml-1 w-20 border border-gray-300"
                />
              </label>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default RenderComponent;
