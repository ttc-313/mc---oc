import React, { useState } from 'react';
import { Project, Task } from '../types';
import { Plus, Folder, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { TypingIndicator } from './TypingIndicator';
import { isTaskActive } from '../utils';

interface ProjectsListProps {
  projects: Project[];
  tasks: Task[];
  onSelectProject: (projectId: string) => void;
  onAddProject: (title: string, description: string) => void;
}

export function ProjectsList({ projects, tasks, onSelectProject, onAddProject }: ProjectsListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      onAddProject(newTitle.trim(), newDescription.trim());
      setNewTitle('');
      setNewDescription('');
      setIsAdding(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Projects</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 rounded-full bg-[#0A84FF] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-[#007AFF] active:scale-95 active:opacity-80 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      {isAdding && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleAdd}
          className="mb-8 rounded-2xl bg-[#1C1C1E] p-6"
        >
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-400">Project Title</label>
              <input
                autoFocus
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full rounded-xl bg-[#2C2C2E] p-3 text-white outline-none focus:ring-2 focus:ring-[#0A84FF]"
                placeholder="e.g. Website Redesign"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-400">Description</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full rounded-xl bg-[#2C2C2E] p-3 text-white outline-none focus:ring-2 focus:ring-[#0A84FF]"
                placeholder="What is this project about?"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="rounded-xl px-4 py-2 text-sm font-medium text-gray-400 transition-all duration-200 hover:bg-[#2C2C2E] hover:text-white active:scale-95 active:opacity-80"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newTitle.trim()}
                className="rounded-xl bg-[#0A84FF] px-6 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-[#007AFF] disabled:opacity-50 active:scale-95 active:opacity-80"
              >
                Create
              </button>
            </div>
          </div>
        </motion.form>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((project) => {
          const projectTasks = tasks.filter((t) => t.projectId === project.id);
          const completedTasks = projectTasks.filter((t) => t.status === 'completed');
          const progress = projectTasks.length === 0 ? 0 : Math.round((completedTasks.length / projectTasks.length) * 100);

          return (
            <motion.div
              layoutId={`project-${project.id}`}
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              whileTap={{ scale: 0.98, opacity: 0.9 }}
              className="group cursor-pointer rounded-2xl bg-[#1C1C1E] p-6 transition-colors duration-200 hover:bg-[#2C2C2E]"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2C2C2E] group-hover:bg-[#3A3A3C] transition-colors">
                    <Folder className="h-5 w-5 text-[#0A84FF]" />
                  </div>
                  {projectTasks.some(isTaskActive) && (
                    <TypingIndicator />
                  )}
                </div>
                <ChevronRight className="h-5 w-5 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{project.title}</h3>
              <p className="mb-6 line-clamp-2 text-sm text-gray-400">{project.description}</p>
              
              <div>
                <div className="mb-2 flex items-center justify-between text-xs font-medium text-gray-400">
                  <span>{completedTasks.length} / {projectTasks.length} tasks</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#2C2C2E]">
                  <div
                    className="h-full rounded-full bg-[#0A84FF] transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
        {projects.length === 0 && !isAdding && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#2C2C2E] py-12 text-center">
            <Folder className="mb-4 h-12 w-12 text-gray-600" />
            <h3 className="mb-1 text-lg font-medium text-white">No projects yet</h3>
            <p className="text-sm text-gray-400">Create a project to group your tasks.</p>
          </div>
        )}
      </div>
    </div>
  );
}
