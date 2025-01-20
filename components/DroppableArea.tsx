// DroppableArea.tsx

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
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: Object.values(COMPONENT_TYPES),
    drop: (item: { type: COMPONENT_TYPES; generateChildren?: () => IComponent }, monitor) => {
      if (monitor.didDrop()) return;
      const extraChildren = item.generateChildren ? item.generateChildren() : null;
      onDrop(item.type, parentId || null, null, extraChildren);
      return { dropped: true };
    },
    collect: monitor => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = canDrop && isOver;
  const backgroundColor = isActive ? '#e2e8f0' : isMainArea ? '#fff' : 'transparent'; // Light blue background when active

  const containerClasses = `min-h-[100px] p-1 flex flex-wrap items-start ${isActive ? 'border-2 border-dashed border-blue-500' : 'border border-gray-300'}`;

  return (
    <div ref={drop} className={containerClasses} style={{ backgroundColor }}>
      {children}
    </div>
  );
};

export default DroppableArea;
