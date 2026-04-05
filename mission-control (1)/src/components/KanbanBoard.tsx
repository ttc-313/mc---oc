import React, { useState } from 'react';
import { Task, TaskStatus, Project } from '../types';
import { Plus, MoreHorizontal, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { getAvatarColor, isTaskActive } from '../utils';
import { TypingIndicator } from './TypingIndicator';

interface KanbanBoardProps {
  tasks: Task[];
  projects: Project[];
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onTaskClick: (taskId: string) => void;
}

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'completed', title: 'Completed' },
];

export function KanbanBoard({ tasks, projects, onUpdateTaskStatus, onTaskClick }: KanbanBoardProps) {

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onUpdateTaskStatus(taskId, status);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex h-full gap-6 overflow-x-auto pb-4">
      {COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.id);

        return (
          <div
            key={col.id}
            className="flex w-80 shrink-0 flex-col rounded-2xl bg-[#1C1C1E] p-4"
            onDrop={(e) => handleDrop(e, col.id)}
            onDragOver={handleDragOver}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-white">{col.title}</h3>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2C2C2E] text-xs font-medium text-gray-400">
                {columnTasks.length}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-3 overflow-y-auto pr-2 -mr-2">
              {columnTasks.map((task) => {
                const project = projects.find((p) => p.id === task.projectId);
                return (
                  <motion.div
                    layout
                    layoutId={task.id}
                    key={task.id}
                    draggable
                    onDragStart={(e: any) => handleDragStart(e, task.id)}
                    onClick={() => onTaskClick(task.id)}
                    whileTap={{ scale: 0.98, opacity: 0.9 }}
                    className="group relative flex h-[116px] shrink-0 flex-col cursor-grab rounded-xl bg-[#2C2C2E] p-3 shadow-sm active:cursor-grabbing transition-colors duration-200 hover:bg-[#3A3A3C] overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 text-sm font-medium text-white leading-snug">{task.title}</p>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {isTaskActive(task) && (
                          <TypingIndicator />
                        )}
                        {task.isStuck && (
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-red-500" title="Task is stuck">
                            <AlertCircle className="h-3 w-3" />
                          </div>
                        )}
                        {task.assignee && (
                          <div 
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${getAvatarColor(task.assignee)} text-[10px] font-bold text-white shadow-sm`}
                            title={`Assigned to: ${task.assignee}`}
                          >
                            {task.assignee.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {(task.progress !== undefined) && (
                      <div className="mt-2.5 flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#1C1C1E]">
                          <div
                            className="h-full rounded-full bg-[#0A84FF] transition-all duration-500"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-medium text-gray-400 w-6 text-right">{task.progress}%</span>
                      </div>
                    )}
                    
                    <div className="mt-auto flex items-end justify-between gap-2">
                      {project ? (
                        <div className="inline-flex max-w-[70%] items-center truncate rounded-md bg-[#3A3A3C] px-2 py-1 text-[10px] font-medium text-gray-300 transition-colors group-hover:bg-[#48484A]">
                          {project.title}
                        </div>
                      ) : <div />}
                      
                      {task.status === 'completed' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateTaskStatus(task.id, 'archived');
                          }}
                          className="shrink-0 rounded bg-green-500/20 px-2 py-1 text-[10px] font-semibold text-green-500 transition-all duration-200 hover:bg-green-500/30"
                        >
                          Confirm
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
