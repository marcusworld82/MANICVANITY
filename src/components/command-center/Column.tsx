import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import Card from './Card';
import type { ContentPiece } from '../../data/content';

interface ColumnProps {
  title: string;
  color: string;
  pieces: ContentPiece[];
  isDraggingOver: boolean;
  onUpdatePiece: (piece: ContentPiece) => void;
  children: React.ReactNode;
}

const Column = forwardRef<HTMLDivElement, ColumnProps>(
  ({ title, color, pieces, isDraggingOver, onUpdatePiece, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        className={`w-80 bg-dark-card border border-dark-border rounded-2xl p-4 transition-all duration-200 ${
          isDraggingOver ? 'border-electric-400 bg-electric-500/5' : ''
        }`}
      >
        {/* Column Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${color}`} />
            <h3 className="text-dark-text font-semibold">{title}</h3>
          </div>
          <span className="text-dark-muted text-sm bg-dark-bg px-2 py-1 rounded-full">
            {pieces.length}
          </span>
        </div>

        {/* Cards */}
        <div className="space-y-3 min-h-[200px]">
          {pieces.map((piece, index) => (
            <motion.div
              key={piece.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card
                piece={piece}
                index={index}
                onUpdate={onUpdatePiece}
              />
            </motion.div>
          ))}
          {children}
        </div>
      </div>
    );
  }
);

Column.displayName = 'Column';

export default Column;