import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Command, Kanban, Calendar, Lightbulb } from 'lucide-react';
import KanbanPage from './command-center/Kanban';
import CalendarPage from './command-center/Calendar';
import IdeasPage from './command-center/Ideas';

type TabType = 'kanban' | 'calendar' | 'ideas';

const TABS = [
  { id: 'kanban' as TabType, label: 'Kanban', icon: Kanban },
  { id: 'calendar' as TabType, label: 'Calendar', icon: Calendar },
  { id: 'ideas' as TabType, label: 'Ideas', icon: Lightbulb }
];

const CommandCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('kanban');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'kanban':
        return <KanbanPage />;
      case 'calendar':
        return <CalendarPage />;
      case 'ideas':
        return <IdeasPage />;
      default:
        return <KanbanPage />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-electric-500 to-neon-500 rounded-xl flex items-center justify-center">
              <Command className="text-white" size={24} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-space text-dark-text">
              Command Center
            </h1>
          </div>
          <p className="text-dark-muted text-lg max-w-2xl mx-auto">
            Your content marketing mission control. Plan, create, and publish with precision.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="flex bg-dark-card border border-dark-border rounded-2xl p-2">
            {TABS.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-electric-500 to-neon-500 text-white shadow-lg'
                    : 'text-dark-muted hover:text-electric-400 hover:bg-dark-bg/50'
                }`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default CommandCenter;