import React, { useState } from 'react';
import { Task, Project } from '../types';
import { motion } from 'motion/react';
import { Archive, Search, Folder, CheckSquare, Calendar as CalendarIcon } from 'lucide-react';

interface ArchiveListProps {
  tasks: Task[];
  projects: Project[];
  onTaskClick: (taskId: string) => void;
  onProjectClick: (projectId: string) => void;
}

type FilterType = 'all' | 'tasks' | 'projects';

export function ArchiveList({ tasks, projects, onTaskClick, onProjectClick }: ArchiveListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const archivedTasks = tasks.filter(t => t.status === 'archived');
  const archivedProjects = projects.filter(p => p.status === 'archived');

  const allItems = [
    ...archivedProjects.map(p => ({ ...p, type: 'project' as const })),
    ...archivedTasks.map(t => ({ ...t, type: 'task' as const }))
  ];

  // Sort by date (mocking it by sorting by archiveId descending for now, or just keep them in order)
  allItems.sort((a, b) => {
    if (a.archiveId && b.archiveId) {
      return b.archiveId.localeCompare(a.archiveId);
    }
    return 0;
  });

  const filteredItems = allItems.filter(item => {
    if (filter === 'tasks' && item.type !== 'task') return false;
    if (filter === 'projects' && item.type !== 'project') return false;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const titleMatch = item.title.toLowerCase().includes(query);
      const tagMatch = item.tags?.some(tag => tag.toLowerCase().includes(query));
      const idMatch = item.archiveId?.toLowerCase().includes(query);
      return titleMatch || tagMatch || idMatch;
    }

    return true;
  });

  return (
    <div className="mx-auto max-w-5xl py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Archive</h2>
      </div>
      
      <div className="mb-8 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search old tasks, projects, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl bg-[#1C1C1E] py-3 pl-12 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:bg-[#2C2C2E] transition-all"
          />
        </div>
        <div className="flex items-center rounded-xl bg-[#1C1C1E] p-1 w-full sm:w-auto">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 sm:flex-none rounded-lg px-6 py-2 text-sm font-medium transition-all ${
              filter === 'all' ? 'bg-[#2C2C2E] text-white shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('tasks')}
            className={`flex-1 sm:flex-none rounded-lg px-6 py-2 text-sm font-medium transition-all ${
              filter === 'tasks' ? 'bg-[#2C2C2E] text-white shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            Tasks
          </button>
          <button
            onClick={() => setFilter('projects')}
            className={`flex-1 sm:flex-none rounded-lg px-6 py-2 text-sm font-medium transition-all ${
              filter === 'projects' ? 'bg-[#2C2C2E] text-white shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            Projects
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {filteredItems.map(item => (
          <motion.div
            key={item.id}
            layoutId={item.id}
            onClick={() => item.type === 'task' ? onTaskClick(item.id) : onProjectClick(item.id)}
            whileTap={{ scale: 0.99 }}
            className="group flex cursor-pointer items-center justify-between rounded-2xl bg-[#1C1C1E] p-5 transition-colors duration-200 hover:bg-[#2C2C2E]"
          >
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#2C2C2E] group-hover:bg-[#3A3A3C] transition-colors`}>
                {item.type === 'project' ? (
                  <Folder className="h-5 w-5 text-[#0A84FF]" />
                ) : (
                  <CheckSquare className="h-5 w-5 text-green-500" />
                )}
              </div>
              <div>
                <h3 className="text-base font-semibold text-white mb-1">{item.title}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                  <span className="text-gray-400">{item.archiveId}</span>
                  <span>•</span>
                  <span>Completed by {item.completedBy}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {item.tags && item.tags.length > 0 && (
                <div className="hidden md:flex items-center gap-2">
                  {item.tags.map(tag => (
                    <span key={tag} className="rounded-md bg-[#2C2C2E] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-300">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
                <CalendarIcon className="h-4 w-4 text-gray-500" />
                {item.completedAt}
              </div>
            </div>
          </motion.div>
        ))}

        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#2C2C2E] py-16 text-center">
            <Archive className="mb-4 h-12 w-12 text-gray-600" />
            <h3 className="mb-1 text-lg font-medium text-white">No archived items found</h3>
            <p className="text-sm text-gray-400">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
