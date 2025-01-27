// types.ts
export enum COMPONENT_TYPES {
  DIV_INLINE = 'divInline', // Div que divide espaço com outras
  DIV_FULL = 'divFull',     // Div que ocupa a linha inteira
  TEXT = 'text',
  IMAGE = 'image',
  BUTTON = 'button',
}

export interface IComponent {
  id: string;
  type: COMPONENT_TYPES;
  content: string;
  parentSubId?: string | null;
  children?: IComponent[] | null;

  width?: number;
  height?: number;

  backgroundColor?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;

  borderWidth?: number;
  borderColor?: string;
  position?: string;

  textColor?: string;
  fontSize?: string;
}