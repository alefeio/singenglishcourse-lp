// types.ts
export enum COMPONENT_TYPES {
  DIV_INLINE = 'divInline', // Div que divide espaço com outras
  DIV_FULL = 'divFull',     // Div que ocupa a linha inteira
  TEXT = 'text',
  IMAGE = 'image',
}

export interface IComponent {
  id: string;
  type: COMPONENT_TYPES;
  content: string;
  parentSubId?: string | null;
  children?: IComponent[] | null;
  width?: number;   // Para imagens
  height?: number;  // Para imagens
}