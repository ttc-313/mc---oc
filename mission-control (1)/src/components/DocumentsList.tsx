import React, { useState } from 'react';
import { Document, DocFolder, DocType } from '../types';
import { motion } from 'motion/react';
import { 
  Search, Upload, FileText, FileImage, FileSpreadsheet, 
  FileIcon, Download, Calendar, User, HardDrive, Tag,
  ChevronDown, ChevronRight
} from 'lucide-react';
import { CustomSelect } from './CustomSelect';

interface DocumentsListProps {
  documents: Document[];
  onUpload: (doc: Partial<Document>) => void;
  onUpdateDoc: (id: string, updates: Partial<Document>) => void;
}

const DOC_TYPES: { value: string; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'pdf', label: 'PDF' },
  { value: 'word', label: 'Word' },
  { value: 'excel', label: 'Excel' },
  { value: 'image', label: 'Image' },
  { value: 'text', label: 'Text' },
];

const TYPE_ICONS: Record<DocType, React.ReactNode> = {
  pdf: <FileIcon className="h-5 w-5 text-red-500" />,
  word: <FileText className="h-5 w-5 text-blue-500" />,
  excel: <FileSpreadsheet className="h-5 w-5 text-green-500" />,
  image: <FileImage className="h-5 w-5 text-purple-500" />,
  text: <FileText className="h-5 w-5 text-gray-400" />,
};

const categorizeDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const dateMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffTime = nowMidnight.getTime() - dateMidnight.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays >= 2 && diffDays <= 6) {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }
  if (diffDays >= 7 && diffDays <= 13) return 'Last Week';
  if (diffDays >= 14 && diffDays <= 20) return 'Two Weeks Ago';
  if (diffDays >= 21 && diffDays <= 27) return 'Three Weeks Ago';
  
  const monthDiff = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
  if (monthDiff === 0) return 'Earlier this Month';
  if (monthDiff === 1) return 'Last Month';
  
  return 'Older';
};

export function DocumentsList({ documents, onUpload, onUpdateDoc }: DocumentsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isUploading, setIsUploading] = useState(false);
  
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [viewingDocId, setViewingDocId] = useState<string | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (groupName: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupName)) next.delete(groupName);
      else next.add(groupName);
      return next;
    });
  };

  const availableTypes = new Set(documents.map(doc => doc.type));
  const dynamicDocTypes = DOC_TYPES.filter(t => t.value === 'all' || availableTypes.has(t.value));

  // Filter documents
  const filteredDocs = documents.filter(doc => {
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchLower) ||
      doc.keywords.some(k => k.toLowerCase().includes(searchLower)) ||
      doc.uploadedBy.toLowerCase().includes(searchLower);
    
    return matchesType && matchesSearch;
  });

  const sortedDocs = [...filteredDocs].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

  const groupedDocsArray = sortedDocs.reduce((acc, doc) => {
    const group = categorizeDate(doc.uploadedAt);
    let groupObj = acc.find(g => g.group === group);
    if (!groupObj) {
      groupObj = { group, docs: [] };
      acc.push(groupObj);
    }
    groupObj.docs.push(doc);
    return acc;
  }, [] as { group: string; docs: Document[] }[]);

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      onUpload({
        title: `New Document ${Math.floor(Math.random() * 1000)}.pdf`,
        type: 'pdf',
        size: '2.4 MB',
        uploadedBy: 'Current User',
        keywords: ['new', 'upload', 'auto'],
      });
      setIsUploading(false);
    }, 1000);
  };

  const viewingDoc = documents.find(d => d.id === viewingDocId);

  return (
    <div className="flex h-full gap-4">
      {/* Left Column - Document List (Outlook style) */}
      <div className="w-80 shrink-0 flex flex-col rounded-2xl bg-[#1C1C1E] border border-[#2C2C2E] overflow-hidden">
        {/* Search & Filter Header */}
        <div className="p-4 border-b border-[#2C2C2E] space-y-3 bg-[#1C1C1E] z-10">
          <button
            onClick={handleSimulateUpload}
            disabled={isUploading}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#0A84FF] px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#007AFF] active:scale-95 disabled:opacity-50 shadow-sm"
          >
            <Upload className="h-4 w-4" />
            {isUploading ? 'Uploading...' : 'Upload Document'}
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-xl bg-[#2C2C2E] pl-9 pr-4 text-sm text-white outline-none focus:ring-2 focus:ring-[#0A84FF] transition-all"
            />
          </div>
          <div className="flex gap-2">
            <CustomSelect
              value={typeFilter}
              onChange={setTypeFilter}
              options={dynamicDocTypes}
              triggerClassName="flex h-10 w-full items-center justify-between rounded-xl bg-[#2C2C2E] px-4 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-[#0A84FF] transition-all duration-200 active:scale-[0.98]"
              dropdownClassName="w-full left-0"
              iconSize={16}
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {groupedDocsArray.map(({ group, docs }) => {
            if (!docs || docs.length === 0) return null;
            
            const isCollapsed = collapsedGroups.has(group);
            
            return (
              <div key={group} className="mb-2">
                <div 
                  onClick={() => toggleGroup(group)}
                  className="sticky top-0 bg-[#1C1C1E]/95 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-[#0A84FF] z-10 border-b border-[#2C2C2E]/50 flex items-center justify-between cursor-pointer hover:bg-[#2C2C2E] transition-colors"
                >
                  <span>{group}</span>
                  {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
                {!isCollapsed && (
                  <div className="flex flex-col">
                    {docs.map(doc => (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDocId(doc.id)}
                        onDoubleClick={() => setViewingDocId(doc.id)}
                        className={`flex cursor-pointer flex-col gap-1 border-b border-[#2C2C2E]/50 p-3 transition-colors ${
                          selectedDocId === doc.id 
                            ? 'bg-[#0A84FF]/10 border-l-2 border-l-[#0A84FF]' 
                            : 'hover:bg-[#2C2C2E] border-l-2 border-l-transparent'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className={`line-clamp-2 text-sm ${selectedDocId === doc.id ? 'font-semibold text-white' : 'font-medium text-gray-200'}`}>
                            {doc.title}
                          </span>
                          <div className="shrink-0 mt-0.5">
                            {TYPE_ICONS[doc.type]}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                          <span className="truncate pr-2">{doc.uploadedBy}</span>
                          <span className="shrink-0">{new Date(doc.uploadedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {filteredDocs.length === 0 && (
            <div className="p-8 text-center flex flex-col items-center justify-center text-gray-500 h-48">
              <Search className="h-8 w-8 mb-3 opacity-20" />
              <p className="text-sm">No documents found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column - Reading Pane */}
      <div className="flex-1 flex flex-col rounded-2xl bg-[#1C1C1E] border border-[#2C2C2E] overflow-hidden">
        {viewingDoc ? (
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#2C2C2E] p-6 bg-[#1C1C1E]">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2C2C2E]">
                  {TYPE_ICONS[viewingDoc.type]}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{viewingDoc.title}</h2>
                  <div className="mt-1 flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {viewingDoc.uploadedBy}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {new Date(viewingDoc.uploadedAt).toLocaleString()}</span>
                    <span className="flex items-center gap-1"><HardDrive className="h-3.5 w-3.5" /> {viewingDoc.size}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => {
                  // Simulate download
                  const link = document.createElement('a');
                  link.href = 'data:text/plain;charset=utf-8,Simulated%20Document%20Download';
                  link.download = viewingDoc.title;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="flex items-center gap-2 rounded-xl bg-[#0A84FF] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#007AFF] active:scale-95"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
            
            {/* Tags */}
            <div className="flex items-center gap-2 border-b border-[#2C2C2E] px-6 py-3 bg-[#1C1C1E]/50">
              <Tag className="h-4 w-4 text-gray-500" />
              <div className="flex gap-2">
                {viewingDoc.keywords.map(kw => (
                  <span key={kw} className="rounded-md bg-[#2C2C2E] px-2.5 py-1 text-xs font-medium text-gray-300">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Document Preview Area */}
            <div className="flex-1 bg-[#000000] p-8 overflow-y-auto flex justify-center">
              <div className="w-full max-w-3xl min-h-[800px] bg-white rounded-lg shadow-2xl p-16 flex flex-col items-center justify-center text-gray-400">
                 {React.cloneElement(TYPE_ICONS[viewingDoc.type] as React.ReactElement, { className: 'h-32 w-32 mb-8 opacity-20' })}
                 <p className="text-2xl font-medium text-gray-500 mb-2">Document Preview</p>
                 <p className="text-gray-400">{viewingDoc.title}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-gray-500">
            <FileText className="mb-4 h-16 w-16 opacity-20" />
            <p className="text-lg font-medium text-gray-400">Select an item to read</p>
            <p className="text-sm mt-1">Double-click a document in the list to open it here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
