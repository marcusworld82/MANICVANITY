import React from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import type { ContentPiece } from '../../data/content';

interface CalendarMonthProps {
  currentDate: Date;
  contentByDate: Record<string, ContentPiece[]>;
  onDateClick: (date: Date, pieces: ContentPiece[]) => void;
  onReschedule: (pieceId: string, newDate: string) => void;
}

const CalendarMonth: React.FC<CalendarMonthProps> = ({
  currentDate,
  contentByDate,
  onDateClick,
  onReschedule
}) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
      {/* Month Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-dark-text">
          {format(currentDate, 'MMMM yyyy')}
        </h3>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-dark-muted text-sm font-medium py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const pieces = contentByDate[dateKey] || [];
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isTodayDate = isToday(day);

          return (
            <motion.div
              key={day.toISOString()}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.01 }}
              onClick={() => onDateClick(day, pieces)}
              className={`
                min-h-[100px] p-2 rounded-lg border cursor-pointer transition-all duration-200
                ${isCurrentMonth 
                  ? 'border-dark-border hover:border-electric-400/50 bg-dark-bg/50' 
                  : 'border-transparent bg-dark-bg/20 opacity-50'
                }
                ${isTodayDate ? 'ring-2 ring-electric-400/50' : ''}
                ${pieces.length > 0 ? 'hover:bg-electric-500/5' : ''}
              `}
            >
              {/* Date Number */}
              <div className={`text-sm font-medium mb-1 ${
                isTodayDate ? 'text-electric-400' : 'text-dark-text'
              }`}>
                {format(day, 'd')}
              </div>

              {/* Content Pieces */}
              <div className="space-y-1">
                {pieces.slice(0, 3).map((piece) => (
                  <motion.div
                    key={piece.id}
                    whileHover={{ scale: 1.05 }}
                    className={`text-xs px-2 py-1 rounded truncate ${
                      piece.status === 'Published' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-purple-500/20 text-purple-400'
                    }`}
                  >
                    {piece.title}
                  </motion.div>
                ))}
                {pieces.length > 3 && (
                  <div className="text-xs text-dark-muted px-2">
                    +{pieces.length - 3} more
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarMonth;