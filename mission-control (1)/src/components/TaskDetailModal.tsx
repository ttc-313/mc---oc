import React from 'react';
import { Task, TeamMember } from '../types';
import { X, User, Clock, AlignLeft, Percent, ChevronDown, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CustomSelect } from './CustomSelect';
import { getAvatarColor, isTaskActive } from '../utils';
import { TypingIndicator } from './TypingIndicator';

interface TaskDetailModalProps {
  task: Task | null;
  onClose: () => void;
  onUpdateTask: (task: Task) => void;
  teamMembers: TeamMember[];
}

export function TaskDetailModal({ task, onClose, onUpdateTask, teamMembers }: TaskDetailModalProps) {
  if (!task) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-[#1C1C1E] shadow-2xl flex flex-col max-h-[90vh]"
        >
          <div className="flex items-center justify-between border-b border-[#2C2C2E] p-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-white">{task.title}</h2>
              {isTaskActive(task) && (
                <TypingIndicator />
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 transition-all duration-200 hover:bg-[#2C2C2E] hover:text-white active:scale-95 active:opacity-80"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="overflow-y-auto p-6 space-y-8">
            <div className="grid grid-cols-2 gap-6">
              {/* Assignee */}
              <div className="col-span-2">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-400">
                  <User className="h-4 w-4" />
                  Assigned To
                </div>
                <CustomSelect
                  value={task.assignee || (teamMembers.length > 0 ? teamMembers[0].name : '')}
                  onChange={(val) => onUpdateTask({ ...task, assignee: val })}
                  options={teamMembers.map(m => ({ value: m.name, label: m.name }))}
                />
              </div>

              {/* Progress */}
              <div className="col-span-2">
                <div className="mb-3 flex items-center justify-between text-sm font-medium text-gray-400">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    Progress
                  </div>
                  <span className="text-white">{task.progress || 0}%</span>
                </div>
                <div className="flex items-center bg-[#2C2C2E] p-4 rounded-xl h-[48px]">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#1C1C1E]">
                    <div
                      className="h-full rounded-full bg-[#0A84FF] transition-all duration-500"
                      style={{ width: `${task.progress || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-400">
                <AlignLeft className="h-4 w-4" />
                Description
              </div>
              <textarea
                value={task.description || ''}
                onChange={(e) => onUpdateTask({ ...task, description: e.target.value })}
                placeholder="Add a more detailed description..."
                rows={4}
                className="w-full rounded-xl bg-[#2C2C2E] p-3 text-white outline-none focus:ring-2 focus:ring-[#0A84FF] resize-none"
              />
            </div>

            {/* History */}
            <div>
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-400">
                <Clock className="h-4 w-4" />
                History & Activity
              </div>
              
              <div className="space-y-4">
                {(!task.history || task.history.length === 0) ? (
                  <p className="text-sm text-gray-500 italic">No history yet.</p>
                ) : (
                  task.history.map((entry) => (
                    <div key={entry.id} className="flex gap-4 rounded-2xl bg-[#2C2C2E] p-4">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${getAvatarColor(entry.person)} text-sm font-bold text-white`}>
                        {entry.person.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-medium text-white">{entry.person}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(entry.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-300">{entry.action}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
