import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { Calendar, MoreVertical, Edit, Move, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import type { ContentPiece } from '../../data/content';

interface CardProps {
  piece: ContentPiece;
  index: number;
  onUpdate: (piece: ContentPiece) => void;
}

const PLATFORM_COLORS = {
  YouTube: 'bg-red-500',
  Instagram: 'bg-pink-500',
  LinkedIn: 'bg-blue-500',
  Blog: 'bg-green-500',
  Email: 'bg-purple-500'
};

const Card: React.FC<CardProps> = ({ piece, index, onUpdate }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuAction = (action: string) => {
    setShowMenu(false);
    
    switch (action) {
      case 'edit':
        // TODO: Open edit modal
        console.log('Edit piece:', piece.id);
        break;
      case 'move':
        // TODO: Open move modal
        console.log('Move piece:', piece.id);
        break;
      case 'delete':
        // Demo only - show toast
        alert('Delete is disabled in demo mode');
        break;
    }
  };

  return (
    <Draggable draggableId={piece.id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          whileHover={{ y: -2, scale: 1.02 }}
          className={`bg-dark-bg border border-dark-border rounded-lg p-4 cursor-grab active:cursor-grabbing transition-all duration-200 ${
            snapshot.isDragging ? 'shadow-xl border-electric-400 rotate-2' : 'hover:border-electric-400/50'
          }`}
        >
          {/* Thumbnail */}
          {piece.thumbnail_url && (
            <div className="aspect-video rounded-lg overflow-hidden mb-3">
              <img
                src={piece.thumbnail_url}
                alt={piece.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h4 className="text-dark-text font-medium text-sm leading-tight line-clamp-2">
                {piece.title}
              </h4>
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="text-dark-muted hover:text-electric-400 p-1 rounded transition-colors duration-200"
                >
                  <MoreVertical size={14} />
                </button>
                
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-0 top-6 bg-dark-card border border-dark-border rounded-lg shadow-xl z-10 py-1 min-w-[120px]"
                  >
                    <button
                      onClick={() => handleMenuAction('edit')}
                      className="flex items-center space-x-2 px-3 py-2 text-dark-muted hover:text-electric-400 hover:bg-dark-bg/50 w-full text-left text-sm"
                    >
                      <Edit size={12} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleMenuAction('move')}
                      className="flex items-center space-x-2 px-3 py-2 text-dark-muted hover:text-electric-400 hover:bg-dark-bg/50 w-full text-left text-sm"
                    >
                      <Move size={12} />
                      <span>Move</span>
                    </button>
                    <button
                      onClick={() => handleMenuAction('delete')}
                      className="flex items-center space-x-2 px-3 py-2 text-red-400 hover:bg-red-500/10 w-full text-left text-sm"
                    >
                      <Trash2 size={12} />
                      <span>Delete</span>
                    </button>
                  </motion.div>
                )}
              </div>
            </div>

            {piece.brief && (
              <p className="text-dark-muted text-xs line-clamp-2">
                {piece.brief}
              </p>
            )}

            <div className="flex items-center justify-between">
              <span className={`${PLATFORM_COLORS[piece.platform]} text-white text-xs px-2 py-1 rounded-full`}>
                {piece.platform}
              </span>
              
              {piece.planned_at && (
                <div className="flex items-center space-x-1 text-dark-muted text-xs">
                  <Calendar size={10} />
                  <span>{format(new Date(piece.planned_at), 'MMM d')}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </Draggable>
  );
};

export default Card;