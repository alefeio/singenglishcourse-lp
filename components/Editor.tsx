import React, { useState, useMemo } from 'react';
import { createEditor, Descendant, BaseEditor, BaseElement } from 'slate';
import { Slate, Editable, withReact, ReactEditor, RenderElementProps } from 'slate-react';

// Definição correta do tipo de um elemento no Slate
interface CustomElement extends BaseElement {
  type: 'paragraph' | 'h1' | 'h2' | 'h3';
  children: Descendant[];
}

// Estado inicial tipado corretamente
const initialValue: CustomElement[] = [
  {
    type: 'paragraph',
    children: [{ text: 'Digite seu texto aqui...' }],
  },
];

const SlateEditor: React.FC = () => {
  const editor = useMemo(() => withReact(createEditor() as BaseEditor & ReactEditor), []);
  const [value, setValue] = useState<Descendant[]>(initialValue);

  // Função chamada quando o conteúdo do editor é alterado
  const handleChange = (newValue: Descendant[]) => {
    setValue(newValue);
  };

  // **Correção**: Adaptando o tipo `renderElement` para `RenderElementProps` do `slate-react`
  const renderElement = (props: RenderElementProps) => {
    const { element, attributes, children } = props;

    switch ((element as CustomElement).type) { // **Correção**: Fazendo cast para `CustomElement`
      case 'h1':
        return <h1 {...attributes}>{children}</h1>;
      case 'h2':
        return <h2 {...attributes}>{children}</h2>;
      case 'h3':
        return <h3 {...attributes}>{children}</h3>;
      default:
        return <p {...attributes}>{children}</p>;
    }
  };

  return (
    <div className="container my-5">
      <Slate editor={editor} initialValue={value} onChange={handleChange}>
        <Editable
          renderElement={renderElement}
          placeholder="Digite aqui..."
          spellCheck
          autoFocus
        />
      </Slate>
      <textarea
        style={{ marginTop: '20px', width: '100%', height: '200px' }}
        disabled
        value={JSON.stringify(value, null, 2)}
      />
    </div>
  );
};

export default SlateEditor;
