import React from 'react';
import { motion } from 'framer-motion';
import { Archive, ArrowRight, Circle } from 'lucide-react';
import type { ContentIdea } from '../../data/content';

interface IdeaCardProps {
  idea: ContentIdea;
  onConvert: (idea: ContentIdea) => void;
  onArchive: (id: string) => void;
}

const PRIORITY_COLORS = {
  1: 'text-gray-400',
  2: 'text-yellow-400',
  3: 'text-red-400'
};

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onConvert, onArchive }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-dark-card border border-dark-border rounded-2xl p-6 hover:border-electric-400/50 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          {[1, 2, 3].map((level) => (
            <Circle
              key={level}
              size={8}
              className={`${
                level <= idea.priority 
                  ? PRIORITY_COLORS[idea.priority] 
                  : 'text-dark-border'
              } ${level <= idea.priority ? 'fill-current' : ''}`}
            />
          ))}
        </div>
        
        <button
          onClick={() => onArchive(idea.id)}
          className="text-dark-muted hover:text-red-400 transition-colors duration-200"
        >
          <Archive size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <h3 className="text-dark-text font-semibold text-lg leading-tight">
          {idea.title}
        </h3>
        
        {idea.notes && (
          <p className="text-dark-muted text-sm leading-relaxed line-clamp-3">
            {idea.notes}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 pt-4 border-t border-dark-border">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onConvert(idea)}
          className="w-full py-2 bg-gradient-to-r from-electric-500 to-neon-500 text-white rounded-lg font-medium hover:from-electric-600 hover:to-neon-600 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <span>Convert to Draft</span>
          <ArrowRight size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default IdeaCard;