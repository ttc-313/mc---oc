import React from 'react';
import { TeamMember } from '../types';
import { motion } from 'motion/react';
import { Terminal, Code, PenTool, Database, ShieldCheck, MoreHorizontal, Cpu } from 'lucide-react';

interface TeamOrgChartProps {
  members: TeamMember[];
  onMemberClick: (memberId: string) => void;
}

const getMemberIcon = (name: string) => {
  switch (name) {
    case 'OpenClaw Master':
      return <Terminal className="h-5 w-5 text-[#0A84FF]" />;
    case 'CodeSmith':
      return <Code className="h-5 w-5 text-[#0A84FF]" />;
    case 'PixelWeaver':
      return <PenTool className="h-5 w-5 text-[#0A84FF]" />;
    case 'DataHound':
      return <Database className="h-5 w-5 text-[#0A84FF]" />;
    case 'Sentinel':
      return <ShieldCheck className="h-5 w-5 text-[#0A84FF]" />;
    default:
      return <Terminal className="h-5 w-5 text-[#0A84FF]" />;
  }
};

export function TeamOrgChart({ members, onMemberClick }: TeamOrgChartProps) {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-1">Teams</h2>
        <p className="text-sm text-gray-400">Manage your AI workforce and system hierarchy.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {members.map((member) => (
          <motion.div
            key={member.id}
            layoutId={`member-${member.id}`}
            onClick={() => onMemberClick(member.id)}
            whileTap={{ scale: 0.98, opacity: 0.9 }}
            className="group flex cursor-pointer flex-col rounded-2xl bg-[#1C1C1E] p-6 transition-colors duration-200 hover:bg-[#2C2C2E]"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2C2C2E] group-hover:bg-[#3A3A3C] transition-colors">
                {getMemberIcon(member.name)}
              </div>
              <button className="text-gray-500 hover:text-white transition-colors">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-4 flex-1">
              <h3 className="text-lg font-semibold text-white leading-tight">{member.name}</h3>
              <p className="text-sm font-medium text-[#0A84FF] mt-1">{member.title}</p>
              <p className="text-sm text-gray-400 mt-4 leading-relaxed line-clamp-3">
                {member.responsibility}
              </p>
            </div>

            <div className="pt-4 border-t border-[#2C2C2E] mt-auto">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                <Cpu className="h-4 w-4" />
                <span>Powered by: <span className="text-gray-300">{member.llmModels.join(', ')}</span></span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
