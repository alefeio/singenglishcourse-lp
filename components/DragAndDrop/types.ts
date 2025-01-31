// types.ts
export enum COMPONENT_TYPES {
  DIV_INLINE = 'divInline', // Div que divide espaço com outras
  DIV_FULL = 'divFull',     // Div que ocupa a linha inteira
  TEXT = 'text',
  IMAGE = 'image',
  BUTTON = 'button',
  FORM = 'form',
}

export interface IComponent {
  id: string;
  type: COMPONENT_TYPES;
  content: string;
  parentSubId?: string | null;
  children?: IComponent[] | null;

  width?: number | null;
  height?: number | null;

  backgroundColor?: string | null;
  padding?: number | null;
  margin?: number | null;
  borderRadius?: number | null;

  borderWidth?: number | null;
  borderColor?: string | null;
  position?: string | null;

  textColor?: string | null;
  fontSize?: string | null;

  buttonColor?: string | null;
  buttonTextColor?: string | null;
  buttonText?: string | null;

  fieldType?: string | null;
  name?: string | null;

  textAlign?: string | null;
  fontFamily?: string | null;

  parentId?: string;

  text?: string;

  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;

  justifyContent?: string;
  alignItems?: string;

  top?: number | null;
  bottom?: number | null;
  left?: number | null;
  right?: number | null;

  align?: string;

  placeholder?: string;
  required?: boolean;
}