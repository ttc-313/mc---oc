import React, { useState } from 'react';
import { Project, Task, TaskStatus } from '../types';
import { ArrowLeft, Plus, CheckCircle2, Circle, Clock, AlertCircle, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { getAvatarColor, isTaskActive } from '../utils';
import { TypingIndicator } from './TypingIndicator';

interface ProjectDetailProps {
  project: Project;
  tasks: Task[];
  onBack: () => void;
  onOpenNewTask: (projectId: string) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onTaskClick: (taskId: string) => void;
  backLabel?: string;
  onConfirmProject?: (projectId: string) => void;
}

const STATUS_ICONS = {
  'backlog': <Circle className="h-4 w-4 text-gray-500" />,
  'in-progress': <Clock className="h-4 w-4 text-yellow-500" />,
  'review': <AlertCircle className="h-4 w-4 text-purple-500" />,
  'completed': <CheckCircle2 className="h-4 w-4 text-green-500" />,
};

const STATUS_LABELS = {
  'backlog': 'Backlog',
  'in-progress': 'In Progress',
  'review': 'Review',
  'completed': 'Completed',
};

export function ProjectDetail({ project, tasks, onBack, onOpenNewTask, onUpdateTaskStatus, onTaskClick, backLabel = 'Back to Projects', onConfirmProject }: ProjectDetailProps) {
  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const isArchived = project.status === 'archived';
  const canConfirm = !isArchived && projectTasks.length > 0 && projectTasks.every(t => t.status === 'completed');

  return (
    <div className="mx-auto max-w-4xl">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-[#0A84FF] transition-all duration-200 hover:text-[#007AFF] active:opacity-50"
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </button>

      <div className="mb-8 rounded-3xl bg-[#1C1C1E] p-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h2 className="mb-3 text-3xl font-bold text-white">{project.title}</h2>
          <p className="text-lg text-gray-400">{project.description}</p>
        </div>
        {canConfirm && onConfirmProject && (
          <button
            onClick={() => onConfirmProject(project.id)}
            className="flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2 text-sm font-medium text-green-500 transition-all duration-200 hover:bg-green-500/20 active:scale-95 whitespace-nowrap"
          >
            <CheckCircle2 className="h-4 w-4" />
            Confirm Project
          </button>
        )}
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Tasks</h3>
        <button
          onClick={() => onOpenNewTask(project.id)}
          className="flex items-center gap-2 rounded-full bg-[#2C2C2E] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-[#3A3A3C] active:scale-95 active:opacity-80 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </button>
      </div>

      <div className="space-y-3">
        {projectTasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#2C2C2E] py-12 text-center">
            <p className="text-sm text-gray-400">No tasks in this project yet.</p>
          </div>
        ) : (
          projectTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onTaskClick(task.id)}
              className="flex cursor-pointer items-center justify-between rounded-2xl bg-[#1C1C1E] p-4 transition-all duration-200 hover:bg-[#2C2C2E] active:scale-[0.99] active:opacity-90"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {STATUS_ICONS[task.status]}
                <div className="flex-1 min-w-0">
                  <span className={`block truncate font-medium ${task.status === 'completed' ? 'text-gray-500' : 'text-white'}`}>
                    {task.title}
                  </span>
                  {(task.progress !== undefined) && (
                    <div className="mt-1 flex items-center gap-3">
                      <div className="h-1.5 w-32 overflow-hidden rounded-full bg-[#2C2C2E]">
                        <div
                          className="h-full rounded-full bg-[#0A84FF] transition-all duration-500"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-medium text-gray-400">{task.progress}%</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-4">
                {isTaskActive(task) && (
                  <TypingIndicator />
                )}
                {task.isStuck && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-red-500" title="Task is stuck">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                )}
                {task.assignee && (
                  <div 
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${getAvatarColor(task.assignee)} text-xs font-bold text-white`}
                    title={`Assigned to: ${task.assignee}`}
                  >
                    {task.assignee.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex w-28 items-center justify-center rounded-lg bg-[#2C2C2E] py-1.5 px-3 text-sm font-medium text-gray-300">
                  {STATUS_LABELS[task.status]}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
