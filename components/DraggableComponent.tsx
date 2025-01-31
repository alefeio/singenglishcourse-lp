'use client';
import React, { ReactNode, useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { COMPONENT_TYPES, IComponent } from './DragAndDrop/types';

interface DraggableComponentProps {
  type: COMPONENT_TYPES;
  children: ReactNode;
  generateChildren?: () => IComponent;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({
  type,
  children,
  generateChildren,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  
  const [, drag] = useDrag(() => ({
    type,
    item: { type, generateChildren },
  }));

  // Aplica a função drag ao ref manualmente
  useEffect(() => {
    if (ref.current) {
      drag(ref.current);
    }
  }, [drag]);

  return (
    <div ref={ref} className="p-3 border border-gray-300 cursor-grab bg-gray-50">
      {children}
    </div>
  );
};

export default DraggableComponent;
