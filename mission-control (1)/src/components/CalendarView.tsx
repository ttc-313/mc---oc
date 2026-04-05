import React, { useState } from 'react';
import { Task, Project } from '../types';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { getAvatarColor, formatLocalTime, isTaskActive } from '../utils';
import { TypingIndicator } from './TypingIndicator';

interface CalendarViewProps {
  tasks: Task[];
  projects: Project[];
  onTaskClick: (taskId: string) => void;
}

type ViewMode = 'week' | 'day';

export function CalendarView({ tasks, projects, onTaskClick }: CalendarViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState(new Date('2026-04-03T12:00:00Z')); // Using current date from metadata

  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is sunday
    return new Date(d.setDate(diff));
  };

  const startOfWeek = getStartOfWeek(currentDate);
  
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return d;
  });

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date('2026-04-03T12:00:00Z'));
  };

  const isSameDay = (dueDateStr: string, d2: Date) => {
    if (!dueDateStr) return false;
    // Handle both YYYY-MM-DD and full ISO strings
    const datePart = dueDateStr.includes('T') ? dueDateStr.split('T')[0] : dueDateStr;
    const [year, month, day] = datePart.split('-').map(Number);
    return year === d2.getFullYear() &&
           month - 1 === d2.getMonth() &&
           day === d2.getDate();
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const formatDayHeader = (date: Date) => {
    return {
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: date.getDate()
    };
  };

  const getTasksForDate = (date: Date) => {
    return tasks
      .filter(t => t.dueDate && isSameDay(t.dueDate, date) && t.isCron)
      .sort((a, b) => (a.scheduledTime || '').localeCompare(b.scheduledTime || ''));
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const project = projects.find(p => p.id === task.projectId);
    const accentColor = task.assignee ? getAvatarColor(task.assignee) : 'bg-gray-500';

    return (
      <motion.div
        onClick={() => onTaskClick(task.id)}
        whileTap={{ scale: 0.98 }}
        className="group relative flex cursor-pointer flex-col rounded-xl bg-[#2C2C2E] p-2.5 shadow-sm transition-all duration-200 hover:bg-[#3A3A3C] mb-2 border border-[#3A3A3C] shrink-0 overflow-hidden min-h-[72px]"
      >
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentColor}`} />
        
        <div className="pl-2 flex flex-col h-full">
          <div className="flex items-start justify-between mb-1">
            <p className="line-clamp-2 text-xs font-medium text-white leading-tight pr-2">{task.title}</p>
            <div className="flex items-center gap-1 shrink-0">
              {isTaskActive(task) && (
                <TypingIndicator />
              )}
              {task.isStuck && (
                <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-red-500 mt-0.5" title="Task is stuck">
                  <AlertCircle className="h-2.5 w-2.5" />
                </div>
              )}
              {task.assignee && (
                <div 
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${accentColor} text-[8px] font-bold text-white shadow-sm mt-0.5`}
                  title={`Assigned to: ${task.assignee}`}
                >
                  {task.assignee.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
          <span className="text-[11px] font-semibold text-gray-400 tracking-wide mb-1.5">
            {formatLocalTime(task.scheduledTime)}
          </span>
          
          {project && (
            <div className="mt-auto">
              <span className="text-[10px] text-gray-500 font-medium truncate block">
                {project.title}
              </span>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold text-white">Calendar</h2>
          <div className="flex items-center rounded-lg bg-[#1C1C1E] p-1">
            <button
              onClick={() => setViewMode('week')}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                viewMode === 'week' ? 'bg-[#2C2C2E] text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                viewMode === 'day' ? 'bg-[#2C2C2E] text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Day
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-lg font-medium text-white w-48 text-right">
            {formatMonthYear(currentDate)}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToday}
              className="rounded-lg bg-[#1C1C1E] px-3 py-1.5 text-sm font-medium text-gray-300 transition-colors hover:bg-[#2C2C2E] hover:text-white"
            >
              Today
            </button>
            <div className="flex items-center rounded-lg bg-[#1C1C1E] p-1">
              <button
                onClick={handlePrev}
                className="rounded-md p-1 text-gray-400 transition-colors hover:bg-[#2C2C2E] hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNext}
                className="rounded-md p-1 text-gray-400 transition-colors hover:bg-[#2C2C2E] hover:text-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-2xl bg-[#1C1C1E] border border-[#2C2C2E] flex flex-col">
        {viewMode === 'week' ? (
          <div className="grid grid-cols-7 h-full divide-x divide-[#2C2C2E]">
            {weekDays.map((day, i) => {
              const { dayName, dayNumber } = formatDayHeader(day);
              const isToday = isSameDay('2026-04-03', day);
              const dayTasks = getTasksForDate(day);
              
              return (
                <div key={i} className="flex flex-col h-full">
                  <div className={`p-3 text-center border-b border-[#2C2C2E] ${isToday ? 'bg-[#0A84FF]/10' : ''}`}>
                    <div className={`text-xs font-medium uppercase tracking-wider ${isToday ? 'text-[#0A84FF]' : 'text-gray-400'}`}>
                      {dayName}
                    </div>
                    <div className={`mt-1 text-xl font-semibold ${isToday ? 'text-[#0A84FF]' : 'text-white'}`}>
                      {dayNumber}
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 bg-black/20">
                    {dayTasks.map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-[#2C2C2E] flex items-center gap-4 bg-[#0A84FF]/5">
              <div className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl bg-[#0A84FF] text-white shadow-lg">
                <span className="text-sm font-medium uppercase">{currentDate.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                <span className="text-2xl font-bold leading-none">{currentDate.getDate()}</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                <p className="text-sm text-[#0A84FF]">{getTasksForDate(currentDate).length} tasks scheduled</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-black/20">
              <div className="max-w-3xl mx-auto space-y-4">
                {getTasksForDate(currentDate).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <CalendarIcon className="h-12 w-12 text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-white mb-1">No tasks scheduled</h3>
                    <p className="text-gray-400">There are no tasks scheduled for this day.</p>
                  </div>
                ) : (
                  getTasksForDate(currentDate).map(task => {
                    const project = projects.find(p => p.id === task.projectId);
                    return (
                      <motion.div
                        key={task.id}
                        onClick={() => onTaskClick(task.id)}
                        whileTap={{ scale: 0.98 }}
                        className="group relative flex cursor-pointer items-center justify-between rounded-2xl bg-[#2C2C2E] p-4 shadow-sm transition-colors duration-200 hover:bg-[#3A3A3C] border border-[#3A3A3C] overflow-hidden"
                      >
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${task.assignee ? getAvatarColor(task.assignee) : 'bg-gray-500'}`} />
                        <div className="flex items-center gap-4 flex-1 pl-2">
                          <div className="flex flex-col items-center justify-center min-w-[60px]">
                            <span className="text-lg font-semibold text-white">
                              {formatLocalTime(task.scheduledTime)}
                            </span>
                          </div>
                          <div className="h-10 w-px bg-[#3A3A3C] mx-2" />
                          <div>
                            <h4 className="text-base font-medium text-white">{task.title}</h4>
                            {project && (
                              <p className="text-sm text-gray-400 mt-0.5">{project.title}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {isTaskActive(task) && (
                            <TypingIndicator />
                          )}
                          {task.isStuck && (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-red-500" title="Task is stuck">
                              <AlertCircle className="h-4 w-4" />
                            </div>
                          )}
                          {task.assignee && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-400">{task.assignee}</span>
                              <div 
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${getAvatarColor(task.assignee)} text-xs font-bold text-white shadow-sm`}
                              >
                                {task.assignee.charAt(0).toUpperCase()}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
