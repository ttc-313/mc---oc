import React, { useState } from 'react';
import { KanbanBoard } from './components/KanbanBoard';
import { ProjectsList } from './components/ProjectsList';
import { ProjectDetail } from './components/ProjectDetail';
import { NewTaskModal } from './components/NewTaskModal';
import { TaskDetailModal } from './components/TaskDetailModal';
import { CronJobDetailModal } from './components/CronJobDetailModal';
import { ArchiveList } from './components/ArchiveList';
import { TeamOrgChart } from './components/TeamOrgChart';
import { TeamMemberModal } from './components/TeamMemberModal';
import { DocumentsList } from './components/DocumentsList';
import { JournalList } from './components/JournalList';
import { CalendarView } from './components/CalendarView';
import { LayoutGrid, CheckSquare, Plus, Archive, Users, FileText, BookOpen, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task, Project, TaskStatus, TeamMember, Document, JournalEntry } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'projects' | 'archive' | 'team' | 'documents' | 'journal' | 'calendar'>('tasks');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [newTaskInitialProject, setNewTaskInitialProject] = useState<string>('');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 'd0',
      title: 'Q2 Marketing Strategy.pdf',
      type: 'pdf',
      size: '3.4 MB',
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Alice',
      folder: 'inbox',
      keywords: ['marketing', 'strategy', 'q2']
    },
    {
      id: 'd0_1',
      title: 'Weekly Sync Notes.txt',
      type: 'text',
      size: '12 KB',
      uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Yesterday
      uploadedBy: 'Bob',
      folder: 'inbox',
      keywords: ['notes', 'sync', 'weekly']
    },
    {
      id: 'd0_2',
      title: 'Client Presentation.pptx',
      type: 'pdf', // using pdf icon for pptx
      size: '8.1 MB',
      uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago (Day of week)
      uploadedBy: 'Charlie',
      folder: 'inbox',
      keywords: ['presentation', 'client', 'deck']
    },
    {
      id: 'd0_3',
      title: 'Team Roster.xlsx',
      type: 'excel',
      size: '45 KB',
      uploadedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // Last Week
      uploadedBy: 'Diana',
      folder: 'inbox',
      keywords: ['team', 'roster', 'hr']
    },
    {
      id: 'd0_4',
      title: 'Vendor Contract.pdf',
      type: 'pdf',
      size: '1.8 MB',
      uploadedAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(), // Two Weeks Ago
      uploadedBy: 'Eve',
      folder: 'inbox',
      keywords: ['contract', 'vendor', 'legal']
    },
    {
      id: 'd1',
      title: 'Q3 Financial Report.xlsx',
      type: 'excel',
      size: '1.2 MB',
      uploadedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), // Last Month
      uploadedBy: 'Diana',
      folder: 'inbox',
      keywords: ['finance', 'q3', 'report', 'budget']
    },
    {
      id: 'd2',
      title: 'Project Alpha Requirements.docx',
      type: 'word',
      size: '450 KB',
      uploadedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // Last Month
      uploadedBy: 'Alice',
      folder: 'starred',
      keywords: ['requirements', 'alpha', 'planning']
    },
    {
      id: 'd3',
      title: 'New Brand Guidelines.pdf',
      type: 'pdf',
      size: '5.8 MB',
      uploadedAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(), // Older
      uploadedBy: 'Eve',
      folder: 'inbox',
      keywords: ['brand', 'design', 'guidelines', 'marketing']
    },
    {
      id: 'd4',
      title: 'System Architecture Diagram.png',
      type: 'image',
      size: '2.1 MB',
      uploadedAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(), // Older
      uploadedBy: 'Charlie',
      folder: 'archive',
      keywords: ['architecture', 'diagram', 'system', 'tech']
    }
  ]);

  const handleUploadDocument = (partialDoc: Partial<Document>) => {
    const newDoc: Document = {
      id: Math.random().toString(36).substring(7),
      title: partialDoc.title || 'Untitled Document',
      type: partialDoc.type || 'text',
      size: partialDoc.size || '0 KB',
      uploadedAt: new Date().toISOString(),
      uploadedBy: partialDoc.uploadedBy || 'Current User',
      folder: 'inbox',
      keywords: partialDoc.keywords || [],
    };
    setDocuments(prev => [newDoc, ...prev]);
  };

  const handleUpdateDocument = (id: string, updates: Partial<Document>) => {
    setDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, ...updates } : doc));
  };

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    {
      id: 'j1',
      title: 'Project Alpha Kickoff Thoughts',
      content: 'Today we finally kicked off Project Alpha. The team seems really aligned on the goals, but I am a bit worried about the timeline. We need to make sure we do not get bogged down in the design phase. I will schedule a check-in next week to ensure we are on track.',
      date: new Date().toISOString(),
      keywords: ['alpha', 'kickoff', 'planning']
    },
    {
      id: 'j2',
      title: 'Reflecting on Q1 Performance',
      content: 'Looking back at Q1, we hit most of our major milestones. The marketing campaign was a huge success, driving a 20% increase in engagement. However, our technical debt is starting to slow down feature development. We need to dedicate at least 20% of our sprint capacity to refactoring in Q2.',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      keywords: ['q1', 'reflection', 'tech-debt']
    },
    {
      id: 'j3',
      title: 'Meeting with the Design Team',
      content: 'Had a great brainstorming session with the design team today. We explored some new concepts for the user dashboard. The idea of using a more modular, widget-based approach is promising. I need to follow up with engineering to see how feasible this is with our current architecture.',
      date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      keywords: ['design', 'dashboard', 'brainstorming']
    },
    {
      id: 'j4',
      title: 'Thoughts on Remote Work Culture',
      content: 'It has been a year since we transitioned to a fully remote setup. While productivity has remained high, I feel like we are losing some of the spontaneous collaboration that happens in an office. I should propose a quarterly offsite to bring everyone together and build stronger relationships.',
      date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      keywords: ['remote', 'culture', 'team-building']
    }
  ]);

  const [teamMembers] = useState<TeamMember[]>([
    {
      id: 'm1',
      name: 'OpenClaw Master',
      title: 'System Orchestrator',
      role: 'System Orchestrator',
      responsibility: 'The core dispatcher. Manages the Kanban board and routes tasks.',
      llmModels: ['Claude 3.5 Sonnet']
    },
    {
      id: 'm2',
      name: 'CodeSmith',
      title: 'Lead Developer',
      role: 'Lead Developer',
      responsibility: 'Handles complex logic, API integrations, and Next.js components.',
      llmModels: ['GPT-4o']
    },
    {
      id: 'm3',
      name: 'PixelWeaver',
      title: 'UI/UX Designer',
      role: 'UI/UX Designer',
      responsibility: 'Generates CSS styling and ensures iOS design consistency.',
      llmModels: ['Gemini 1.5 Pro']
    },
    {
      id: 'm4',
      name: 'DataHound',
      title: 'Database Engineer',
      role: 'Database Engineer',
      responsibility: 'Optimizes queries, manages backups, and ensures data integrity.',
      llmModels: ['Claude 3.5 Haiku']
    },
    {
      id: 'm5',
      name: 'Sentinel',
      title: 'QA & Security',
      role: 'QA & Security',
      responsibility: 'Reviews code for vulnerabilities and runs automated tests.',
      llmModels: ['GPT-4o']
    }
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: '1', 
      title: 'Design system updates', 
      description: 'Update the core components to match the new iOS design guidelines.',
      assignee: 'OpenClaw Master',
      status: 'in-progress', 
      projectId: 'p1',
      progress: 45,
      dueDate: '2026-04-03',
      scheduledTime: '10:00',
      history: [
        { id: 'h1', person: 'CodeSmith', action: 'Created the initial design draft', date: '2026-03-28T10:00:00Z' },
        { id: 'h2', person: 'OpenClaw Master', action: 'Started implementing components', date: '2026-04-01T14:30:00Z' }
      ]
    },
    { id: '2', title: 'User authentication', assignee: 'CodeSmith', status: 'backlog', projectId: 'p1', progress: 0, dueDate: '2026-04-04', scheduledTime: '14:30' },
    { 
      id: '3', 
      title: 'Database migration', 
      description: 'Weekday database migration workflow owned by DataHound: collect trending tables, apply the filtering and anti-duplication gate, route research-dependent judgments to Pliny, and prepare the approved input pack for Cicero\'s draft cycle.',
      assignee: 'DataHound', 
      status: 'review', 
      progress: 90, 
      dueDate: '2026-04-02', 
      scheduledTime: '02:00', 
      isCron: true,
      cronExpression: '0 02 * * 1-5',
      cronScheduleText: 'Weekdays at 2:00 AM ET',
      cronStatus: 'enabled',
      nextRun: 'Tomorrow at 2:00 AM ET',
      createdAt: 'Mar 29, 2026',
      updatedAt: 'Mar 30, 2026'
    },
    { 
      id: '5', 
      title: 'Cache invalidation', 
      description: 'Clear Redis cache for daily rollover to ensure fresh data for morning reports.',
      assignee: 'OpenClaw Master', 
      status: 'backlog', 
      progress: 0, 
      dueDate: '2026-04-02', 
      scheduledTime: '02:00', 
      isCron: true,
      cronExpression: '0 02 * * *',
      cronScheduleText: 'Every day at 2:00 AM ET',
      cronStatus: 'enabled',
      nextRun: 'Tomorrow at 2:00 AM ET',
      createdAt: 'Apr 01, 2026',
      updatedAt: 'Apr 01, 2026'
    },
    { 
      id: '6', 
      title: 'Sync user analytics', 
      description: 'Export daily user analytics to data warehouse for business intelligence team.',
      assignee: 'PixelWeaver', 
      status: 'in-progress', 
      progress: 10, 
      dueDate: '2026-04-03', 
      scheduledTime: '23:45', 
      isCron: true,
      cronExpression: '45 23 * * *',
      cronScheduleText: 'Every day at 11:45 PM ET',
      cronStatus: 'enabled',
      nextRun: 'Today at 11:45 PM ET',
      createdAt: 'Apr 02, 2026',
      updatedAt: 'Apr 02, 2026'
    },
    { id: '4', title: 'Landing page copy', assignee: 'PixelWeaver', status: 'completed', projectId: 'p2', progress: 100, dueDate: '2026-04-01', scheduledTime: '09:15' },
    {
      id: 'a1',
      title: 'Fix Navigation Bug on Mobile Safari',
      status: 'archived',
      assignee: 'QA Agent',
      completedBy: 'QA Agent',
      completedAt: 'Mar 28, 2026',
      archiveId: 'ARC-1041',
      tags: ['BUG', 'UI/UX']
    },
    {
      id: 'a2',
      title: 'Initialize Next.js Repository',
      status: 'archived',
      assignee: 'CodeSmith',
      completedBy: 'CodeSmith',
      completedAt: 'Mar 25, 2026',
      archiveId: 'ARC-1040',
      tags: ['SETUP', 'FRONTEND']
    },
    {
      id: 'a3',
      title: 'Design System Global CSS',
      status: 'archived',
      assignee: 'PixelWeaver',
      completedBy: 'PixelWeaver',
      completedAt: 'Mar 25, 2026',
      archiveId: 'ARC-1039',
      tags: ['DESIGN', 'CSS']
    }
  ]);

  const [projects, setProjects] = useState<Project[]>([
    { id: 'p1', title: 'Core Platform v2', description: 'Major rewrite of the core platform using new tech stack.', status: 'active' },
    { id: 'p2', title: 'Marketing Site', description: 'Redesign and content update for the public facing website.', status: 'active' },
    {
      id: 'pa1',
      title: 'Server Migration & Cloud Setup',
      description: 'Migrate all backend services to the new cloud infrastructure.',
      status: 'archived',
      completedBy: 'OpenClaw Master',
      completedAt: 'Mar 30, 2026',
      archiveId: 'ARC-1042',
      tags: ['DEVOPS', 'INFRASTRUCTURE']
    },
    {
      id: 'pa2',
      title: 'Q1 Financial Audit',
      description: 'Complete the Q1 financial audit and generate reports.',
      status: 'archived',
      completedBy: 'DataHound',
      completedAt: 'Mar 15, 2026',
      archiveId: 'ARC-1038',
      tags: ['FINANCE', 'REPORTING']
    }
  ]);

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const handleAddTask = (title: string, description: string, assignee: string, status: TaskStatus, projectId?: string, dueDate?: string, scheduledTime?: string, isCron?: boolean) => {
    const newTask: Task = {
      id: Math.random().toString(36).substring(7),
      title,
      description,
      assignee,
      status,
      projectId,
      dueDate,
      scheduledTime,
      isCron,
      progress: 0,
      history: [
        {
          id: Math.random().toString(36).substring(7),
          person: 'System',
          action: 'Task created',
          date: new Date().toISOString(),
        }
      ]
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const handleAddProject = (title: string, description: string) => {
    const newProject: Project = {
      id: Math.random().toString(36).substring(7),
      title,
      description,
      status: 'active'
    };
    setProjects((prev) => [...prev, newProject]);
  };

  const handleConfirmProject = (projectId: string) => {
    const archiveId = `ARC-${Math.floor(1000 + Math.random() * 9000)}`;
    const completedAt = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          status: 'archived',
          completedBy: 'System',
          completedAt,
          archiveId
        };
      }
      return p;
    }));

    setTasks(prev => prev.map(t => {
      if (t.projectId === projectId) {
        return {
          ...t,
          status: 'archived',
          completedBy: t.assignee || 'System',
          completedAt,
          archiveId
        };
      }
      return t;
    }));

    setSelectedProjectId(null);
    setActiveTab('archive');
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header / Navigation */}
      <header className="sticky top-0 z-10 border-b border-[#2C2C2E] bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0A84FF]">
              <LayoutGrid className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Mission Control</h1>
          </div>

          <div className="flex items-center gap-4">
            <nav className="flex rounded-full bg-[#1C1C1E] p-1">
              <button
                onClick={() => {
                  setActiveTab('tasks');
                  setSelectedProjectId(null);
                }}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 active:scale-95 ${
                  activeTab === 'tasks' && !selectedProjectId
                    ? 'bg-[#2C2C2E] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white active:opacity-80'
                }`}
              >
                <CheckSquare className="h-4 w-4" />
                Tasks
              </button>
              <button
                onClick={() => {
                  setActiveTab('projects');
                  setSelectedProjectId(null);
                }}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 active:scale-95 ${
                  activeTab === 'projects' || selectedProjectId
                    ? 'bg-[#2C2C2E] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white active:opacity-80'
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
                Projects
              </button>
              <button
                onClick={() => {
                  setActiveTab('calendar');
                  setSelectedProjectId(null);
                }}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 active:scale-95 ${
                  activeTab === 'calendar' && !selectedProjectId
                    ? 'bg-[#2C2C2E] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white active:opacity-80'
                }`}
              >
                <CalendarIcon className="h-4 w-4" />
                Calendar
              </button>
              <button
                onClick={() => {
                  setActiveTab('documents');
                  setSelectedProjectId(null);
                }}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 active:scale-95 ${
                  activeTab === 'documents' && !selectedProjectId
                    ? 'bg-[#2C2C2E] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white active:opacity-80'
                }`}
              >
                <FileText className="h-4 w-4" />
                Documents
              </button>
              <button
                onClick={() => {
                  setActiveTab('journal');
                  setSelectedProjectId(null);
                }}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 active:scale-95 ${
                  activeTab === 'journal' && !selectedProjectId
                    ? 'bg-[#2C2C2E] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white active:opacity-80'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                Journal
              </button>
              <button
                onClick={() => {
                  setActiveTab('team');
                  setSelectedProjectId(null);
                }}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 active:scale-95 ${
                  activeTab === 'team' && !selectedProjectId
                    ? 'bg-[#2C2C2E] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white active:opacity-80'
                }`}
              >
                <Users className="h-4 w-4" />
                Team
              </button>
              <button
                onClick={() => {
                  setActiveTab('archive');
                  setSelectedProjectId(null);
                }}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 active:scale-95 ${
                  activeTab === 'archive' && !selectedProjectId
                    ? 'bg-[#2C2C2E] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white active:opacity-80'
                }`}
              >
                <Archive className="h-4 w-4" />
                Archive
              </button>
            </nav>
            <button
              onClick={() => {
                setNewTaskInitialProject('');
                setIsNewTaskModalOpen(true);
              }}
              className="flex items-center gap-2 rounded-full bg-[#0A84FF] px-4 py-1.5 text-sm font-medium text-white transition-all duration-200 hover:bg-[#007AFF] active:scale-95 active:opacity-80 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              New Task
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`mx-auto max-w-7xl px-6 py-8 ${(activeTab === 'tasks' || activeTab === 'documents' || activeTab === 'journal') && !selectedProjectId ? 'h-[calc(100vh-4rem)]' : 'min-h-[calc(100vh-4rem)]'}`}>
        <AnimatePresence mode="wait">
          {selectedProjectId && selectedProject ? (
            <motion.div
              key="project-detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <ProjectDetail
                project={selectedProject}
                tasks={tasks}
                onBack={() => setSelectedProjectId(null)}
                onOpenNewTask={(projectId) => {
                  setNewTaskInitialProject(projectId);
                  setIsNewTaskModalOpen(true);
                }}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onTaskClick={setSelectedTaskId}
                backLabel={activeTab === 'archive' ? 'Back to Archive' : 'Back to Projects'}
                onConfirmProject={handleConfirmProject}
              />
            </motion.div>
          ) : activeTab === 'tasks' ? (
            <motion.div
              key="tasks-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full"
            >
              <KanbanBoard
                tasks={tasks}
                projects={projects}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onTaskClick={setSelectedTaskId}
              />
            </motion.div>
          ) : activeTab === 'archive' ? (
            <motion.div
              key="archive-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ArchiveList
                tasks={tasks}
                projects={projects}
                onTaskClick={setSelectedTaskId}
                onProjectClick={setSelectedProjectId}
              />
            </motion.div>
          ) : activeTab === 'team' ? (
            <motion.div
              key="team-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <TeamOrgChart
                members={teamMembers}
                onMemberClick={setSelectedMemberId}
              />
            </motion.div>
          ) : activeTab === 'documents' ? (
            <motion.div
              key="documents-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full"
            >
              <DocumentsList
                documents={documents}
                onUpload={handleUploadDocument}
                onUpdateDoc={handleUpdateDocument}
              />
            </motion.div>
          ) : activeTab === 'journal' ? (
            <motion.div
              key="journal-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full"
            >
              <JournalList entries={journalEntries} />
            </motion.div>
          ) : activeTab === 'calendar' ? (
            <motion.div
              key="calendar-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full"
            >
              <CalendarView 
                tasks={tasks} 
                projects={projects} 
                onTaskClick={setSelectedTaskId} 
              />
            </motion.div>
          ) : (
            <motion.div
              key="projects-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ProjectsList
                projects={projects}
                tasks={tasks}
                onSelectProject={setSelectedProjectId}
                onAddProject={handleAddProject}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onAdd={handleAddTask}
        projects={projects}
        teamMembers={teamMembers}
        initialProjectId={newTaskInitialProject}
      />

      {tasks.find(t => t.id === selectedTaskId)?.isCron ? (
        <CronJobDetailModal
          task={tasks.find(t => t.id === selectedTaskId) || null}
          onClose={() => setSelectedTaskId(null)}
          teamMembers={teamMembers}
        />
      ) : (
        <TaskDetailModal
          task={tasks.find(t => t.id === selectedTaskId) || null}
          onClose={() => setSelectedTaskId(null)}
          onUpdateTask={handleUpdateTask}
          teamMembers={teamMembers}
        />
      )}

      <TeamMemberModal
        member={teamMembers.find(m => m.id === selectedMemberId) || null}
        onClose={() => setSelectedMemberId(null)}
      />
    </div>
  );
}
