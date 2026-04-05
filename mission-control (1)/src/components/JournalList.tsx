import React, { useState } from 'react';
import { JournalEntry } from '../types';
import { 
  Search, BookOpen, Calendar, Tag,
  ChevronDown, ChevronRight
} from 'lucide-react';

interface JournalListProps {
  entries: JournalEntry[];
}

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

export function JournalList({ entries }: JournalListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [viewingEntryId, setViewingEntryId] = useState<string | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (groupName: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupName)) next.delete(groupName);
      else next.add(groupName);
      return next;
    });
  };

  // Filter entries
  const filteredEntries = entries.filter(entry => {
    const searchLower = searchQuery.toLowerCase();
    return (
      entry.title.toLowerCase().includes(searchLower) ||
      entry.content.toLowerCase().includes(searchLower) ||
      entry.keywords.some(k => k.toLowerCase().includes(searchLower))
    );
  });

  const sortedEntries = [...filteredEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const groupedEntriesArray = sortedEntries.reduce((acc, entry) => {
    const group = categorizeDate(entry.date);
    let groupObj = acc.find(g => g.group === group);
    if (!groupObj) {
      groupObj = { group, entries: [] };
      acc.push(groupObj);
    }
    groupObj.entries.push(entry);
    return acc;
  }, [] as { group: string; entries: JournalEntry[] }[]);

  const viewingEntry = entries.find(e => e.id === viewingEntryId);

  return (
    <div className="flex h-full gap-4">
      {/* Left Column - Journal List */}
      <div className="w-80 shrink-0 flex flex-col rounded-2xl bg-[#1C1C1E] border border-[#2C2C2E] overflow-hidden">
        {/* Search Header */}
        <div className="p-4 border-b border-[#2C2C2E] space-y-3 bg-[#1C1C1E] z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search journal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-xl bg-[#2C2C2E] pl-9 pr-4 text-sm text-white outline-none focus:ring-2 focus:ring-[#0A84FF] transition-all"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {groupedEntriesArray.map(({ group, entries: groupEntries }) => {
            if (!groupEntries || groupEntries.length === 0) return null;
            
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
                    {groupEntries.map(entry => (
                      <div
                        key={entry.id}
                        onClick={() => setSelectedEntryId(entry.id)}
                        onDoubleClick={() => setViewingEntryId(entry.id)}
                        className={`flex cursor-pointer flex-col gap-1 border-b border-[#2C2C2E]/50 p-3 transition-colors ${
                          selectedEntryId === entry.id 
                            ? 'bg-[#0A84FF]/10 border-l-2 border-l-[#0A84FF]' 
                            : 'hover:bg-[#2C2C2E] border-l-2 border-l-transparent'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className={`line-clamp-2 text-sm ${selectedEntryId === entry.id ? 'font-semibold text-white' : 'font-medium text-gray-200'}`}>
                            {entry.title}
                          </span>
                          <div className="shrink-0 mt-0.5">
                            <BookOpen className="h-4 w-4 text-[#0A84FF]" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                          <span className="truncate pr-2 line-clamp-1">{entry.content.substring(0, 40)}...</span>
                          <span className="shrink-0">{new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {filteredEntries.length === 0 && (
            <div className="p-8 text-center flex flex-col items-center justify-center text-gray-500 h-48">
              <Search className="h-8 w-8 mb-3 opacity-20" />
              <p className="text-sm">No entries found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column - Reading Pane */}
      <div className="flex-1 flex flex-col rounded-2xl bg-[#1C1C1E] border border-[#2C2C2E] overflow-hidden">
        {viewingEntry ? (
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#2C2C2E] p-6 bg-[#1C1C1E]">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2C2C2E]">
                  <BookOpen className="h-6 w-6 text-[#0A84FF]" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{viewingEntry.title}</h2>
                  <div className="mt-1 flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {new Date(viewingEntry.date).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tags */}
            {viewingEntry.keywords && viewingEntry.keywords.length > 0 && (
              <div className="flex items-center gap-2 border-b border-[#2C2C2E] px-6 py-3 bg-[#1C1C1E]/50">
                <Tag className="h-4 w-4 text-gray-500" />
                <div className="flex gap-2">
                  {viewingEntry.keywords.map(kw => (
                    <span key={kw} className="rounded-md bg-[#2C2C2E] px-2.5 py-1 text-xs font-medium text-gray-300">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Entry Content Area */}
            <div className="flex-1 bg-[#1C1C1E] p-8 overflow-y-auto flex justify-center">
              <div className="w-full max-w-3xl">
                 <div className="prose prose-invert max-w-none">
                   <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-[15px]">
                     {viewingEntry.content}
                   </p>
                 </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-gray-500">
            <BookOpen className="mb-4 h-16 w-16 opacity-20" />
            <p className="text-lg font-medium text-gray-400">Select an entry to read</p>
            <p className="text-sm mt-1">Double-click a journal entry in the list to open it here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
