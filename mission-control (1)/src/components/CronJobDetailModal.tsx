import React from 'react';
import { Task, TeamMember } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { getAvatarColor } from '../utils';

interface CronJobDetailModalProps {
  task: Task | null;
  onClose: () => void;
  teamMembers: TeamMember[];
}

export function CronJobDetailModal({ task, onClose, teamMembers }: CronJobDetailModalProps) {
  if (!task) return null;

  const assigneeColor = task.assignee ? getAvatarColor(task.assignee) : 'bg-gray-500';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-2xl overflow-hidden bg-[#1C1C1E] sm:rounded-[32px] rounded-t-[32px] shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* iOS Sheet Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#2C2C2E] bg-[#1C1C1E] shrink-0">
            <div className="w-16" /> {/* Spacer for centering */}
            <h2 className="text-[17px] font-semibold text-white tracking-tight">
              Cron Job
            </h2>
            <button
              onClick={onClose}
              className="w-16 text-right text-[17px] font-medium text-[#0A84FF] hover:text-[#0A84FF]/80 transition-colors active:opacity-70"
            >
              Done
            </button>
          </div>

          {/* Scrollable Content (iOS Grouped Background) */}
          <div className="overflow-y-auto p-4 sm:p-6 bg-black/20 flex-1 space-y-6">
            
            {/* Title Group */}
            <div className="bg-[#2C2C2E] rounded-2xl overflow-hidden">
              <div className="p-4">
                <h1 className="text-xl font-bold text-white tracking-tight">{task.title}</h1>
              </div>
            </div>

            {/* Description Group */}
            <div>
              <h3 className="text-[13px] uppercase text-gray-500 ml-4 mb-1.5 font-medium tracking-wide">Description</h3>
              <div className="bg-[#2C2C2E] rounded-2xl p-4">
                <p className="text-[15px] text-white leading-relaxed">
                  {task.description || 'No description provided.'}
                </p>
              </div>
            </div>

            {/* Details Group */}
            <div>
              <h3 className="text-[13px] uppercase text-gray-500 ml-4 mb-1.5 font-medium tracking-wide">Details</h3>
              <div className="bg-[#2C2C2E] rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-[#3A3A3C]/50">
                  <span className="text-[17px] text-white">Schedule</span>
                  <span className="text-[17px] text-gray-400">{task.cronScheduleText || 'Not specified'}</span>
                </div>
                <div className="flex items-center justify-between p-4 border-b border-[#3A3A3C]/50">
                  <span className="text-[17px] text-white">Status</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[17px] text-gray-400 capitalize">{task.cronStatus || 'Enabled'}</span>
                    <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border-b border-[#3A3A3C]/50">
                  <span className="text-[17px] text-white">Assigned Agent</span>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[17px] text-gray-400">{task.assignee || 'Unassigned'}</span>
                    {task.assignee && (
                      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${assigneeColor} text-[10px] font-bold text-white shadow-sm`}>
                        {task.assignee.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border-b border-[#3A3A3C]/50">
                  <span className="text-[17px] text-white">Next Run</span>
                  <span className="text-[17px] text-gray-400">{task.nextRun || 'Not scheduled'}</span>
                </div>
                <div className="flex items-center justify-between p-4">
                  <span className="text-[17px] text-white">Cron Expression</span>
                  <code className="text-[15px] font-mono text-gray-400 bg-[#1C1C1E] px-2 py-0.5 rounded-md border border-[#3A3A3C]/50">
                    {task.cronExpression || '* * * * *'}
                  </code>
                </div>
              </div>
            </div>

            {/* Footer text */}
            <div className="text-center space-y-1 pt-4 pb-8">
              <p className="text-[13px] text-gray-500">Created {task.createdAt || 'Unknown'}</p>
              <p className="text-[13px] text-gray-500">Updated {task.updatedAt || 'Unknown'}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
