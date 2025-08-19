import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Type, Globe } from 'lucide-react';
import type { ContentPiece } from '../../data/content';

interface NewContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: {
    title: string;
    platform: ContentPiece['platform'];
    planned_at?: string;
    brief?: string;
  }) => void;
}

const PLATFORMS: ContentPiece['platform'][] = ['YouTube', 'Instagram', 'LinkedIn', 'Blog', 'Email'];

const NewContentModal: React.FC<NewContentModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<ContentPiece['platform']>('Instagram');
  const [plannedAt, setPlannedAt] = useState('');
  const [brief, setBrief] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    
    try {
      await onCreate({
        title: title.trim(),
        platform,
        planned_at: plannedAt || undefined,
        brief: brief.trim() || undefined
      });
      
      // Reset form
      setTitle('');
      setPlatform('Instagram');
      setPlannedAt('');
      setBrief('');
      onClose();
    } catch (error) {
      console.error('Error creating content:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6 w-full max-w-md">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-dark-text">New Content</h2>
                <button
                  onClick={onClose}
                  className="text-dark-muted hover:text-electric-400 transition-colors duration-200"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    <Type size={16} className="inline mr-2" />
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text"
                    placeholder="Enter content title..."
                    required
                  />
                </div>

                {/* Platform */}
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    <Globe size={16} className="inline mr-2" />
                    Platform
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as ContentPiece['platform'])}
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text"
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* Planned Date */}
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    <Calendar size={16} className="inline mr-2" />
                    Planned Date (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={plannedAt}
                    onChange={(e) => setPlannedAt(e.target.value)}
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text"
                  />
                </div>

                {/* Brief */}
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    Brief (Optional)
                  </label>
                  <textarea
                    value={brief}
                    onChange={(e) => setBrief(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text resize-none"
                    placeholder="Brief description of the content..."
                  />
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 border border-dark-border bg-dark-bg text-dark-text rounded-lg font-semibold hover:border-electric-400 hover:text-electric-400 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading || !title.trim()}
                    className="flex-1 py-3 bg-gradient-to-r from-electric-500 to-neon-500 text-white rounded-lg font-semibold hover:from-electric-600 hover:to-neon-600 transition-all duration-200 disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create'}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NewContentModal;