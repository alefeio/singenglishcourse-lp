import React, { useState, useMemo } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { Node } from 'slate';

// Definindo o tipo de valor para o estado inicial
const initialValue: Node[] = [
  {
    type: 'paragraph',
    children: [{ text: 'Digite seu texto aqui...' }],
  },
];

const SlateEditor: React.FC = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Node[]>(initialValue);

  // Função chamada quando o conteúdo do editor é alterado
  const handleChange = (newValue: Node[]) => {
    setValue(newValue);
  };

  // Função para renderizar o elemento baseado no tipo
  const renderElement = (props: any) => {
    switch (props.element.type) {
      case 'h1':
        return <h1 {...props.attributes}>{props.children}</h1>;
      case 'h2':
        return <h2 {...props.attributes}>{props.children}</h2>;
      case 'h3':
        return <h3 {...props.attributes}>{props.children}</h3>;
      default:
        return <p {...props.attributes}>{props.children}</p>;
    }
  };

  return (
    <div className="container my-5">
      <Slate editor={editor} value={value} onChange={handleChange}>
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
