'use client';
import React, { ReactNode } from 'react';
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
  const [, drag] = useDrag(() => ({
    type,
    item: { type, generateChildren },
  }));

  return (
    <div ref={drag} className="p-3 border border-gray-300 cursor-grab bg-gray-50">
      {children}
    </div>
  );
};

export default DraggableComponent;
