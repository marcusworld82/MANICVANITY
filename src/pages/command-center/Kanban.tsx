import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { DropResult } from '@hello-pangea/dnd';
import Board from '../../components/command-center/Board';
import NewContentModal from '../../components/command-center/NewContentModal';
import { listPieces, updatePieceStatus, createContentPiece } from '../../data/content';
import type { ContentPiece } from '../../data/content';

const Kanban: React.FC = () => {
  const [pieces, setPieces] = useState<ContentPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);

  useEffect(() => {
    loadPieces();
  }, []);

  const loadPieces = async () => {
    setLoading(true);
    try {
      const data = await listPieces();
      setPieces(data);
    } catch (error) {
      console.error('Error loading pieces:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Optimistic update
    const newPieces = [...pieces];
    const piece = newPieces.find(p => p.id === draggableId);
    if (piece) {
      piece.status = destination.droppableId as ContentPiece['status'];
      setPieces(newPieces);
    }

    // Persist to backend
    try {
      await updatePieceStatus(draggableId, destination.droppableId as ContentPiece['status']);
    } catch (error) {
      console.error('Error updating piece status:', error);
      // Revert on error
      loadPieces();
    }
  };

  const handleUpdatePiece = (updatedPiece: ContentPiece) => {
    setPieces(prev => prev.map(p => p.id === updatedPiece.id ? updatedPiece : p));
  };

  const handleCreateContent = async (data: {
    title: string;
    platform: ContentPiece['platform'];
    planned_at?: string;
    brief?: string;
  }) => {
    try {
      const newPiece = await createContentPiece(data);
      if (newPiece) {
        setPieces(prev => [newPiece, ...prev]);
      }
    } catch (error) {
      console.error('Error creating content:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-electric-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark-text">Content Pipeline</h2>
          <p className="text-dark-muted">Manage your content workflow from idea to publication</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowNewModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-electric-500 to-neon-500 text-white rounded-lg font-semibold hover:from-electric-600 hover:to-neon-600 transition-all duration-200"
        >
          <Plus size={20} />
          <span>New Content</span>
        </motion.button>
      </div>

      {/* Board */}
      <Board
        pieces={pieces}
        onDragEnd={handleDragEnd}
        onUpdatePiece={handleUpdatePiece}
      />

      {/* New Content Modal */}
      <NewContentModal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        onCreate={handleCreateContent}
      />
    </div>
  );
};

export default Kanban;