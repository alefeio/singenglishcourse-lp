'use client'

import React, { useState } from 'react';
import { SketchPicker, ColorResult } from 'react-color';

/**
 * Props:
 *  - value: string → valor atual da cor (rgba, hex, etc.)
 *  - onChange: (newColor: string) => void
 *  - label?: string → (opcional) texto do botão
 */
interface ColorPickerButtonProps {
  value: string;  
  onChange: (newColor: string) => void;
  label?: string;
}

/**
 * Esse componente exibe um botão "Selecionar" (ou label custom) 
 * e, ao clicar, mostra o SketchPicker. Ao selecionar a cor e 
 * soltar o mouse, chamamos onChange(newColor).
 * O usuário fecha manualmente clicando em "Fechar".
 */
const ColorPickerButton: React.FC<ColorPickerButtonProps> = ({ value, onChange, label }) => {
  const [showPicker, setShowPicker] = useState(false);

  // Função para converter color.rgb → rgba
  const makeRGBA = (color: ColorResult) => {
    const { r, g, b, a } = color.rgb;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        className="ml-1 px-2 py-1 border border-gray-300"
        onClick={() => setShowPicker(!showPicker)}
      >
        {label || 'Selecionar'}
      </button>

      {showPicker && (
        <div style={{ position: 'absolute', zIndex: 1, background: '#fff' }}>
          <SketchPicker
            color={value || 'rgba(0, 0, 0, 1)'}
            onChangeComplete={(color) => {
              onChange(makeRGBA(color));
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ColorPickerButton;
