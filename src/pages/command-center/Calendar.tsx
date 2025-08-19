import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Grid, List } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import CalendarMonth from '../../components/command-center/CalendarMonth';
import CalendarWeek from '../../components/command-center/CalendarWeek';
import { listCalendar, updatePlannedDate } from '../../data/content';
import type { ContentPiece } from '../../data/content';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [contentByDate, setContentByDate] = useState<Record<string, ContentPiece[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedPieces, setSelectedPieces] = useState<ContentPiece[]>([]);

  useEffect(() => {
    loadCalendarData();
  }, [currentDate, viewMode]);

  const loadCalendarData = async () => {
    setLoading(true);
    try {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      
      const data = await listCalendar({
        from: start.toISOString(),
        to: end.toISOString()
      });
      
      setContentByDate(data);
    } catch (error) {
      console.error('Error loading calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNext = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date: Date, pieces: ContentPiece[]) => {
    setSelectedDate(date);
    setSelectedPieces(pieces);
  };

  const handleReschedule = async (pieceId: string, newDate: string) => {
    try {
      await updatePlannedDate(pieceId, newDate);
      loadCalendarData();
    } catch (error) {
      console.error('Error rescheduling content:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark-text">Content Calendar</h2>
          <p className="text-dark-muted">Schedule and manage your content timeline</p>
        </div>

        {/* View Controls */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-dark-card border border-dark-border rounded-lg p-1">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'month'
                  ? 'bg-electric-500 text-white'
                  : 'text-dark-muted hover:text-electric-400'
              }`}
            >
              <Grid size={16} className="inline mr-2" />
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'week'
                  ? 'bg-electric-500 text-white'
                  : 'text-dark-muted hover:text-electric-400'
              }`}
            >
              <List size={16} className="inline mr-2" />
              Week
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            className="p-2 text-dark-muted hover:text-electric-400 hover:bg-dark-card rounded-lg transition-all duration-200"
          >
            <ChevronLeft size={20} />
          </motion.button>
          
          <h3 className="text-xl font-semibold text-dark-text min-w-[200px]">
            {format(currentDate, 'MMMM yyyy')}
          </h3>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="p-2 text-dark-muted hover:text-electric-400 hover:bg-dark-card rounded-lg transition-all duration-200"
          >
            <ChevronRight size={20} />
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToday}
          className="px-4 py-2 bg-dark-card border border-dark-border text-dark-text rounded-lg font-medium hover:border-electric-400 hover:text-electric-400 transition-all duration-200"
        >
          <CalendarIcon size={16} className="inline mr-2" />
          Today
        </motion.button>
      </div>

      {/* Calendar View */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-electric-400"></div>
        </div>
      ) : (
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === 'month' ? (
            <CalendarMonth
              currentDate={currentDate}
              contentByDate={contentByDate}
              onDateClick={handleDateClick}
              onReschedule={handleReschedule}
            />
          ) : (
            <CalendarWeek
              currentDate={currentDate}
              contentByDate={contentByDate}
              onDateClick={handleDateClick}
              onReschedule={handleReschedule}
            />
          )}
        </motion.div>
      )}

      {/* Selected Date Modal */}
      {selectedDate && selectedPieces.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedDate(null)}
        >
          <div
            className="bg-dark-card border border-dark-border rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-dark-text mb-4">
              {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            <div className="space-y-3">
              {selectedPieces.map((piece) => (
                <div
                  key={piece.id}
                  className="flex items-center space-x-3 p-3 bg-dark-bg rounded-lg"
                >
                  {piece.thumbnail_url && (
                    <img
                      src={piece.thumbnail_url}
                      alt={piece.title}
                      className="w-12 h-12 rounded object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="text-dark-text font-medium">{piece.title}</h4>
                    <p className="text-dark-muted text-sm">{piece.platform}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    piece.status === 'Published' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-purple-500/20 text-purple-400'
                  }`}>
                    {piece.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Calendar;