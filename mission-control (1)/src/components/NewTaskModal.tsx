import React, { useState, useEffect } from 'react';
import { Project, TaskStatus, TeamMember } from '../types';
import { X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CustomSelect } from './CustomSelect';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, description: string, assignee: string, status: TaskStatus, projectId?: string, dueDate?: string, scheduledTime?: string, isCron?: boolean) => void;
  projects: Project[];
  teamMembers: TeamMember[];
  initialProjectId?: string;
}

export function NewTaskModal({ isOpen, onClose, onAdd, projects, teamMembers, initialProjectId }: NewTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');
  const [status, setStatus] = useState<TaskStatus>('backlog');
  const [projectId, setProjectId] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<string>('');
  const [isCron, setIsCron] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setProjectId(initialProjectId || '');
      setTitle('');
      setDescription('');
      setAssignee(teamMembers.length > 0 ? teamMembers[0].name : '');
      setStatus('backlog');
      setDueDate('');
      setScheduledTime('');
      setIsCron(false);
    }
  }, [isOpen, initialProjectId, teamMembers]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), description.trim(), assignee.trim(), status, projectId || undefined, dueDate || undefined, scheduledTime || undefined, isCron);
      onClose();
    }
  };

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
          className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-[#1C1C1E] shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-[#2C2C2E] p-6">
            <h2 className="text-xl font-semibold text-white">New Task</h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 transition-all duration-200 hover:bg-[#2C2C2E] hover:text-white active:scale-95 active:opacity-80"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-400">Title</label>
              <input
                autoFocus
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl bg-[#2C2C2E] p-3 text-white outline-none focus:ring-2 focus:ring-[#0A84FF]"
                placeholder="Task title"
              />
            </div>
            
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-400">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl bg-[#2C2C2E] p-3 text-white outline-none focus:ring-2 focus:ring-[#0A84FF] resize-none"
                placeholder="Task description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-400">Assignee</label>
                <CustomSelect
                  value={assignee}
                  onChange={setAssignee}
                  options={teamMembers.map(m => ({ value: m.name, label: m.name }))}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-400">Status</label>
                <CustomSelect
                  value={status}
                  onChange={(val) => setStatus(val as TaskStatus)}
                  options={[
                    { value: 'backlog', label: 'Backlog' },
                    { value: 'in-progress', label: 'In Progress' },
                    { value: 'review', label: 'Review' },
                    { value: 'completed', label: 'Completed' }
                  ]}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {projects.length > 0 && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-400">Project</label>
                  <CustomSelect
                    value={projectId}
                    onChange={setProjectId}
                    options={[
                      { value: '', label: 'No Project' },
                      ...projects.map(p => ({ value: p.id, label: p.title }))
                    ]}
                    placeholder="No Project"
                  />
                </div>
              )}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-400">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-xl bg-[#2C2C2E] p-3 text-white outline-none focus:ring-2 focus:ring-[#0A84FF] [color-scheme:dark]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-400">Scheduled Time</label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isCron}
                      onChange={(e) => setIsCron(e.target.checked)}
                      className="rounded border-[#3A3A3C] bg-[#1C1C1E] text-[#0A84FF] focus:ring-[#0A84FF] focus:ring-offset-0"
                    />
                    <span className="text-xs text-gray-400">Cron Job</span>
                  </label>
                </div>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full rounded-xl bg-[#2C2C2E] p-3 text-white outline-none focus:ring-2 focus:ring-[#0A84FF] [color-scheme:dark]"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-sm font-medium text-gray-400 transition-all duration-200 hover:bg-[#2C2C2E] hover:text-white active:scale-95 active:opacity-80"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="rounded-xl bg-[#0A84FF] px-6 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-[#007AFF] disabled:opacity-50 active:scale-95 active:opacity-80 shadow-sm"
              >
                Create Task
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
