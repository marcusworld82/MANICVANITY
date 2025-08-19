import React from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import Column from './Column';
import type { ContentPiece } from '../../data/content';

interface BoardProps {
  pieces: ContentPiece[];
  onDragEnd: (result: DropResult) => void;
  onUpdatePiece: (piece: ContentPiece) => void;
}

const COLUMNS = [
  { id: 'Backlog', title: 'Backlog', color: 'from-gray-500 to-gray-600' },
  { id: 'Draft', title: 'Draft', color: 'from-blue-500 to-blue-600' },
  { id: 'Review', title: 'Review', color: 'from-yellow-500 to-yellow-600' },
  { id: 'Scheduled', title: 'Scheduled', color: 'from-purple-500 to-purple-600' },
  { id: 'Published', title: 'Published', color: 'from-green-500 to-green-600' }
];

const Board: React.FC<BoardProps> = ({ pieces, onDragEnd, onUpdatePiece }) => {
  const groupedPieces = COLUMNS.reduce((acc, column) => {
    acc[column.id] = pieces.filter(piece => piece.status === column.id);
    return acc;
  }, {} as Record<string, ContentPiece[]>);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-6 overflow-x-auto pb-6">
        {COLUMNS.map((column, index) => (
          <motion.div
            key={column.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex-shrink-0"
          >
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <Column
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  title={column.title}
                  color={column.color}
                  pieces={groupedPieces[column.id] || []}
                  isDraggingOver={snapshot.isDraggingOver}
                  onUpdatePiece={onUpdatePiece}
                >
                  {provided.placeholder}
                </Column>
              )}
            </Droppable>
          </motion.div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default Board;