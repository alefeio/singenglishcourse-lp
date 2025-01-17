'use client';
import React, { ReactNode } from 'react';
import { useDrop } from 'react-dnd';
import { COMPONENT_TYPES, IComponent } from './DragAndDrop/types';

interface DroppableAreaProps {
  parentId?: string | null;
  onDrop: (
    type: COMPONENT_TYPES,
    parentId?: string | null,
    parentSubId?: string | null,
    extraChildren?: IComponent | null
  ) => void;
  children?: ReactNode;
  isMainArea?: boolean;
  isChildArea?: boolean;
}

const DroppableArea: React.FC<DroppableAreaProps> = ({
  parentId,
  onDrop,
  children,
  isMainArea,
  isChildArea,
}) => {
  const [, drop] = useDrop(() => ({
    accept: Object.values(COMPONENT_TYPES),
    drop: (item, monitor) => {
      if (monitor.didDrop()) return;
      const extraChildren = item.generateChildren ? item.generateChildren() : null;
      onDrop(item.type, parentId || null, null, extraChildren);
      return { dropped: true };
    },
  }));

  // flex-wrap: wrap → Div (Linha Única) ocupa 100% e joga próximos pra linha de baixo
  const containerClasses = isMainArea
    ? 'min-h-[400px] p-5 border-2 border-dashed border-gray-300 mb-2 flex flex-wrap items-start'
    : 'min-h-[100px] p-5 border border-dashed border-gray-300 mb-2 flex flex-wrap items-start';

  return (
    <div ref={drop} className={containerClasses}>
      {children}
    </div>
  );
};

export default DroppableArea;
