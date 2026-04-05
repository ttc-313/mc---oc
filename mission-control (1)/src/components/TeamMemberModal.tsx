import React from 'react';
import { TeamMember } from '../types';
import { X, User, Briefcase, Target, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getAvatarColor } from '../utils';

interface TeamMemberModalProps {
  member: TeamMember | null;
  onClose: () => void;
}

export function TeamMemberModal({ member, onClose }: TeamMemberModalProps) {
  return (
    <AnimatePresence>
      {member && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            layoutId={`member-${member.id}`}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-[#1C1C1E] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#2C2C2E] p-6">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${getAvatarColor(member.name)} text-xl font-bold text-white`}>
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{member.name}</h2>
                  <p className="text-sm font-medium text-[#0A84FF]">{member.title}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-gray-400 transition-all duration-200 hover:bg-[#2C2C2E] hover:text-white active:scale-95 active:opacity-80"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2 text-gray-400">
                  <Briefcase className="h-4 w-4" />
                  <h3 className="text-sm font-medium uppercase tracking-wider">Role</h3>
                </div>
                <p className="text-white bg-[#2C2C2E] p-3 rounded-xl">{member.role}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2 text-gray-400">
                  <Target className="h-4 w-4" />
                  <h3 className="text-sm font-medium uppercase tracking-wider">Responsibility</h3>
                </div>
                <p className="text-white bg-[#2C2C2E] p-3 rounded-xl leading-relaxed">
                  {member.responsibility}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3 text-gray-400">
                  <Cpu className="h-4 w-4" />
                  <h3 className="text-sm font-medium uppercase tracking-wider">LLM Models Used</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {member.llmModels.map((model, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-lg bg-[#0A84FF]/10 px-3 py-1.5 text-sm font-medium text-[#0A84FF]"
                    >
                      {model}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
