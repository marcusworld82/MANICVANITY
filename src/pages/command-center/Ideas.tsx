import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Lightbulb } from 'lucide-react';
import IdeaCard from '../../components/command-center/IdeaCard';
import { listIdeas, createIdea, archiveIdea, createContentPiece } from '../../data/content';
import type { ContentIdea, ContentPiece } from '../../data/content';

const Ideas: React.FC = () => {
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newPriority, setNewPriority] = useState<1 | 2 | 3>(2);

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    setLoading(true);
    try {
      const data = await listIdeas();
      setIdeas(data);
    } catch (error) {
      console.error('Error loading ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const idea = await createIdea({
        title: newTitle.trim(),
        notes: newNotes.trim() || undefined,
        priority: newPriority
      });

      if (idea) {
        setIdeas(prev => [idea, ...prev]);
        setNewTitle('');
        setNewNotes('');
        setNewPriority(2);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error creating idea:', error);
    }
  };

  const handleConvertIdea = async (idea: ContentIdea) => {
    try {
      const contentPiece = await createContentPiece({
        title: idea.title,
        platform: 'Instagram', // Default platform
        brief: idea.notes || undefined
      });

      if (contentPiece) {
        // Archive the idea
        await archiveIdea(idea.id);
        setIdeas(prev => prev.filter(i => i.id !== idea.id));
        
        // Show success message
        alert(`"${idea.title}" has been converted to a draft!`);
      }
    } catch (error) {
      console.error('Error converting idea:', error);
    }
  };

  const handleArchiveIdea = async (id: string) => {
    try {
      await archiveIdea(id);
      setIdeas(prev => prev.filter(i => i.id !== id));
    } catch (error) {
      console.error('Error archiving idea:', error);
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
          <h2 className="text-2xl font-bold text-dark-text">Content Ideas</h2>
          <p className="text-dark-muted">Capture and develop your creative concepts</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-electric-500 to-neon-500 text-white rounded-lg font-semibold hover:from-electric-600 hover:to-neon-600 transition-all duration-200"
        >
          <Plus size={20} />
          <span>New Idea</span>
        </motion.button>
      </div>

      {/* Quick Add Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-card border border-dark-border rounded-2xl p-6"
        >
          <form onSubmit={handleCreateIdea} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="What's your idea?"
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text"
                  required
                />
              </div>
              <div>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(Number(e.target.value) as 1 | 2 | 3)}
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text"
                >
                  <option value={1}>Low Priority</option>
                  <option value={2}>Medium Priority</option>
                  <option value={3}>High Priority</option>
                </select>
              </div>
            </div>
            
            <textarea
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="Add some notes about your idea..."
              rows={3}
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text resize-none"
            />
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-dark-border bg-dark-bg text-dark-text rounded-lg font-medium hover:border-electric-400 hover:text-electric-400 transition-all duration-200"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-electric-500 to-neon-500 text-white rounded-lg font-medium hover:from-electric-600 hover:to-neon-600 transition-all duration-200"
              >
                Add Idea
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Ideas Grid */}
      {ideas.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Lightbulb size={64} className="text-dark-muted mx-auto mb-4" />
          <h3 className="text-dark-text text-xl font-semibold mb-2">No ideas yet</h3>
          <p className="text-dark-muted">Start capturing your creative concepts!</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea, index) => (
            <motion.div
              key={idea.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <IdeaCard
                idea={idea}
                onConvert={handleConvertIdea}
                onArchive={handleArchiveIdea}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Ideas;