import React from 'react';
import { motion } from 'framer-motion';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday } from 'date-fns';
import type { ContentPiece } from '../../data/content';

interface CalendarWeekProps {
  currentDate: Date;
  contentByDate: Record<string, ContentPiece[]>;
  onDateClick: (date: Date, pieces: ContentPiece[]) => void;
  onReschedule: (pieceId: string, newDate: string) => void;
}

const TIME_SLOTS = [
  '8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM', '8:00 PM'
];

const CalendarWeek: React.FC<CalendarWeekProps> = ({
  currentDate,
  contentByDate,
  onDateClick,
  onReschedule
}) => {
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
      {/* Week Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-dark-text">
          {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
        </h3>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-8 gap-4">
        {/* Time Column */}
        <div className="space-y-4">
          <div className="h-12" /> {/* Header spacer */}
          {TIME_SLOTS.map((time) => (
            <div key={time} className="h-16 flex items-center">
              <span className="text-dark-muted text-sm">{time}</span>
            </div>
          ))}
        </div>

        {/* Day Columns */}
        {days.map((day, dayIndex) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const pieces = contentByDate[dateKey] || [];
          const isTodayDate = isToday(day);

          return (
            <div key={day.toISOString()} className="space-y-4">
              {/* Day Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: dayIndex * 0.1 }}
                className={`h-12 flex flex-col items-center justify-center rounded-lg border ${
                  isTodayDate 
                    ? 'border-electric-400 bg-electric-500/10' 
                    : 'border-dark-border bg-dark-bg/50'
                }`}
              >
                <span className="text-dark-muted text-xs">
                  {format(day, 'EEE')}
                </span>
                <span className={`text-sm font-semibold ${
                  isTodayDate ? 'text-electric-400' : 'text-dark-text'
                }`}>
                  {format(day, 'd')}
                </span>
              </motion.div>

              {/* Time Slots */}
              {TIME_SLOTS.map((time, timeIndex) => {
                const slotPieces = pieces.filter((_, index) => index % TIME_SLOTS.length === timeIndex);
                
                return (
                  <div
                    key={time}
                    className="h-16 border border-dark-border/30 rounded-lg p-2 hover:border-electric-400/50 transition-colors duration-200"
                    onClick={() => onDateClick(day, pieces)}
                  >
                    {slotPieces.map((piece) => (
                      <motion.div
                        key={piece.id}
                        whileHover={{ scale: 1.02 }}
                        className={`text-xs px-2 py-1 rounded truncate mb-1 cursor-pointer ${
                          piece.status === 'Published' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-purple-500/20 text-purple-400'
                        }`}
                      >
                        {piece.title}
                      </motion.div>
                    ))}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarWeek;